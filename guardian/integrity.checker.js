/**
 * ALIVE Integrity Checker
 * 
 * Detects:
 * - File corruption (hash mismatch)
 * - Unauthorized modifications
 * - Missing required files
 * - Malformed configurations
 * - Suspicious patterns in code
 * 
 * Reports threats to Core for assessment.
 * Does NOT auto-fix - waits for Core decision.
 */

import { readFile, readdir, stat, access } from 'fs/promises';
import { join, extname } from 'path';
import { createHash } from 'crypto';

export const IntegrityChecker = {

  // Known good hashes
  manifest: new Map(),

  // Scan results
  lastScan: null,

  // Suspicious patterns to detect in code
  suspiciousPatterns: [
    { pattern: /eval\s*\(/g, name: 'eval_usage', severity: 'high' },
    { pattern: /Function\s*\(/g, name: 'function_constructor', severity: 'high' },
    { pattern: /child_process/g, name: 'child_process_import', severity: 'medium' },
    { pattern: /require\s*\(\s*['"`]\s*\.\./g, name: 'parent_dir_require', severity: 'low' },
    { pattern: /__proto__/g, name: 'proto_access', severity: 'medium' },
    { pattern: /process\.env/g, name: 'env_access', severity: 'info' },
    { pattern: /while\s*\(\s*true\s*\)/g, name: 'infinite_loop', severity: 'medium' },
    { pattern: /rm\s+-rf/g, name: 'dangerous_shell', severity: 'critical' },
    { pattern: /DELETE\s+FROM.*WHERE\s*$/gi, name: 'unfiltered_delete', severity: 'high' }
  ],

  // Required files for each component
  requiredFiles: {
    'alive-core': [
      'reasoning/reasoning.js',
      'reasoning/assess.js',
      'knowledge/knowledge.interface.js'
    ],
    'alive-body': [
      'hal/hal.interface.js',
      'senses/sensors.fusion.js'
    ],
    'alive-system': [
      'runtime/resource.governor.js',
      'guardian/health.monitor.js'
    ]
  },

  // === INITIALIZATION ===

  /**
   * Initialize with baseline hashes
   */
  init: async function(rootDirs) {
    console.log('[IntegrityChecker] Building baseline...');
    
    for (const dir of rootDirs) {
      await this._hashDirectory(dir);
    }

    console.log(`[IntegrityChecker] Baseline: ${this.manifest.size} files`);
    return this;
  },

  /**
   * Save manifest to file
   */
  saveManifest: async function(filePath) {
    const data = {};
    for (const [path, info] of this.manifest) {
      data[path] = info;
    }
    
    const { writeFile } = await import('fs/promises');
    await writeFile(filePath, JSON.stringify(data, null, 2));
  },

  /**
   * Load manifest from file
   */
  loadManifest: async function(filePath) {
    try {
      const data = JSON.parse(await readFile(filePath, 'utf8'));
      this.manifest.clear();
      
      for (const [path, info] of Object.entries(data)) {
        this.manifest.set(path, info);
      }
      
      console.log(`[IntegrityChecker] Loaded manifest: ${this.manifest.size} files`);
      return true;
    } catch (err) {
      console.warn('[IntegrityChecker] Could not load manifest:', err.message);
      return false;
    }
  },

  // === SCANNING ===

  /**
   * Full integrity scan
   */
  scan: async function(rootDirs) {
    const results = {
      timestamp: Date.now(),
      issues: [],
      scanned: 0,
      passed: 0
    };

    // Check each directory
    for (const dir of rootDirs) {
      await this._scanDirectory(dir, results);
    }

    // Check for required files
    for (const [component, files] of Object.entries(this.requiredFiles)) {
      for (const file of files) {
        const found = rootDirs.some(dir => {
          const fullPath = join(dir, file);
          return this.manifest.has(fullPath);
        });

        if (!found) {
          results.issues.push({
            type: 'missing_required',
            severity: 'error',
            file,
            component,
            message: `Required file missing: ${file}`
          });
        }
      }
    }

    results.passed = results.scanned - results.issues.length;
    this.lastScan = results;

    return results;
  },

  /**
   * Quick check - only verify hashes, no pattern scan
   */
  quickCheck: async function(rootDirs) {
    const issues = [];

    for (const [filePath, baseline] of this.manifest) {
      try {
        const content = await readFile(filePath);
        const currentHash = this._hash(content);

        if (currentHash !== baseline.hash) {
          issues.push({
            type: 'hash_mismatch',
            severity: 'warning',
            file: filePath,
            expected: baseline.hash,
            actual: currentHash,
            message: 'File modified since baseline'
          });
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          issues.push({
            type: 'file_missing',
            severity: 'error',
            file: filePath,
            message: 'File deleted since baseline'
          });
        }
      }
    }

    return {
      timestamp: Date.now(),
      quick: true,
      issues,
      checked: this.manifest.size
    };
  },

  /**
   * Scan single file for suspicious patterns
   */
  scanFile: async function(filePath) {
    const issues = [];
    
    try {
      const content = await readFile(filePath, 'utf8');

      for (const { pattern, name, severity } of this.suspiciousPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          issues.push({
            type: 'suspicious_pattern',
            severity,
            file: filePath,
            pattern: name,
            count: matches.length,
            message: `Found ${matches.length} instance(s) of ${name}`
          });
        }
      }

      // Check for syntax errors (basic)
      if (filePath.endsWith('.js')) {
        try {
          new Function(content);
        } catch (syntaxError) {
          issues.push({
            type: 'syntax_error',
            severity: 'error',
            file: filePath,
            message: syntaxError.message
          });
        }
      }

      // Check for very long lines (possible obfuscation)
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > 1000) {
          issues.push({
            type: 'suspicious_line',
            severity: 'warning',
            file: filePath,
            line: i + 1,
            length: lines[i].length,
            message: 'Extremely long line (possible obfuscation)'
          });
        }
      }

    } catch (err) {
      issues.push({
        type: 'read_error',
        severity: 'error',
        file: filePath,
        message: err.message
      });
    }

    return issues;
  },

  // === VERIFICATION ===

  /**
   * Verify a specific file hasn't changed
   */
  verifyFile: async function(filePath) {
    const baseline = this.manifest.get(filePath);
    if (!baseline) {
      return { verified: false, reason: 'not_in_manifest' };
    }

    try {
      const content = await readFile(filePath);
      const currentHash = this._hash(content);

      if (currentHash === baseline.hash) {
        return { verified: true };
      } else {
        return { 
          verified: false, 
          reason: 'hash_mismatch',
          expected: baseline.hash,
          actual: currentHash
        };
      }
    } catch (err) {
      return { verified: false, reason: 'read_error', error: err.message };
    }
  },

  /**
   * Update manifest for a file (after approved change)
   */
  updateFile: async function(filePath) {
    try {
      const content = await readFile(filePath);
      const stats = await stat(filePath);

      this.manifest.set(filePath, {
        hash: this._hash(content),
        size: stats.size,
        modified: stats.mtimeMs,
        updated: Date.now()
      });

      return true;
    } catch (err) {
      return false;
    }
  },

  // === QUERIES ===

  /**
   * Get last scan results
   */
  getLastScan: function() {
    return this.lastScan;
  },

  /**
   * Get manifest stats
   */
  getStats: function() {
    let totalSize = 0;
    let oldestUpdate = Date.now();
    
    for (const info of this.manifest.values()) {
      totalSize += info.size || 0;
      if (info.updated && info.updated < oldestUpdate) {
        oldestUpdate = info.updated;
      }
    }

    return {
      files: this.manifest.size,
      totalSize,
      oldestUpdate,
      lastScan: this.lastScan?.timestamp
    };
  },

  // === INTERNAL ===

  async _hashDirectory(dir) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        if (entry.name === 'node_modules') continue;

        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          await this._hashDirectory(fullPath);
        } else if (entry.isFile() && this._shouldHash(entry.name)) {
          try {
            const content = await readFile(fullPath);
            const stats = await stat(fullPath);

            this.manifest.set(fullPath, {
              hash: this._hash(content),
              size: stats.size,
              modified: stats.mtimeMs,
              updated: Date.now()
            });
          } catch (err) {
            // Skip unreadable files
          }
        }
      }
    } catch (err) {
      // Skip unreadable directories
    }
  },

  async _scanDirectory(dir, results) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        if (entry.name === 'node_modules') continue;

        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          await this._scanDirectory(fullPath, results);
        } else if (entry.isFile() && this._shouldScan(entry.name)) {
          results.scanned++;

          // Check hash if in manifest
          const baseline = this.manifest.get(fullPath);
          if (baseline) {
            try {
              const content = await readFile(fullPath);
              const currentHash = this._hash(content);

              if (currentHash !== baseline.hash) {
                results.issues.push({
                  type: 'modified',
                  severity: 'warning',
                  file: fullPath,
                  message: 'File modified since baseline'
                });
              }
            } catch (err) {
              results.issues.push({
                type: 'read_error',
                severity: 'error',
                file: fullPath,
                message: err.message
              });
            }
          }

          // Scan for suspicious patterns
          const patternIssues = await this.scanFile(fullPath);
          results.issues.push(...patternIssues);
        }
      }
    } catch (err) {
      results.issues.push({
        type: 'directory_error',
        severity: 'error',
        file: dir,
        message: err.message
      });
    }
  },

  _hash: function(content) {
    return createHash('sha256').update(content).digest('hex');
  },

  _shouldHash: function(filename) {
    const ext = extname(filename).toLowerCase();
    return ['.js', '.ts', '.json', '.md'].includes(ext);
  },

  _shouldScan: function(filename) {
    const ext = extname(filename).toLowerCase();
    return ['.js', '.ts'].includes(ext);
  },

  // === RESET ===

  reset: function() {
    this.manifest.clear();
    this.lastScan = null;
  }
};

export default IntegrityChecker;
