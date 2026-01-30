/**
 * ALIVE Cleanup
 * 
 * Garbage collection and maintenance:
 * - Temp files
 * - Old logs
 * - Stale cache
 * - Orphaned data
 * - Memory cleanup
 * 
 * Runs on schedule or on-demand.
 * Reports to Core before destructive operations.
 */

import { readdir, unlink, stat, rmdir } from 'fs/promises';
import { join } from 'path';

export const Cleanup = {

  // Cleanup rules
  rules: {
    temp: {
      pattern: /^alive_.*\.(tmp|wav|json)$/,
      maxAge: 3600000,  // 1 hour
      locations: []     // Set during init
    },
    logs: {
      pattern: /\.log$/,
      maxAge: 604800000, // 7 days
      maxSize: 10485760, // 10 MB
      locations: []
    },
    cache: {
      pattern: /\.cache$/,
      maxAge: 86400000,  // 1 day
      locations: []
    },
    experience: {
      pattern: /\.jsonl$/,
      maxAge: 2592000000, // 30 days
      compress: true,    // compress old, don't delete
      locations: []
    }
  },

  // Cleanup history
  history: [],

  // Callbacks
  onBeforeDelete: null,  // (files) => boolean - return false to abort
  onAfterCleanup: null,  // (results) => void

  // === INITIALIZATION ===

  init: function(config = {}) {
    // Set temp locations
    this.rules.temp.locations = config.tempDirs || [
      process.env.TMPDIR || '/tmp',
      join(process.cwd(), 'temp')
    ];

    // Set log locations
    this.rules.logs.locations = config.logDirs || [
      join(process.cwd(), 'logs')
    ];

    // Set cache locations
    this.rules.cache.locations = config.cacheDirs || [
      join(process.cwd(), 'cache'),
      join(process.cwd(), '.cache')
    ];

    // Set experience locations
    this.rules.experience.locations = config.experienceDirs || [
      join(process.cwd(), 'data', 'experience')
    ];

    console.log('[Cleanup] Initialized');
    return this;
  },

  // === SCANNING ===

  /**
   * Scan for cleanable items (doesn't delete)
   */
  scan: async function() {
    const results = {
      timestamp: Date.now(),
      categories: {},
      totalFiles: 0,
      totalSize: 0
    };

    for (const [category, rule] of Object.entries(this.rules)) {
      const categoryResults = await this._scanCategory(category, rule);
      results.categories[category] = categoryResults;
      results.totalFiles += categoryResults.files.length;
      results.totalSize += categoryResults.totalSize;
    }

    return results;
  },

  /**
   * Scan single category
   */
  _scanCategory: async function(category, rule) {
    const files = [];
    let totalSize = 0;
    const now = Date.now();

    for (const location of rule.locations) {
      try {
        const entries = await readdir(location, { withFileTypes: true });

        for (const entry of entries) {
          if (!entry.isFile()) continue;
          if (!rule.pattern.test(entry.name)) continue;

          const fullPath = join(location, entry.name);

          try {
            const stats = await stat(fullPath);
            const age = now - stats.mtimeMs;

            // Check age
            if (age > rule.maxAge) {
              files.push({
                path: fullPath,
                name: entry.name,
                size: stats.size,
                age,
                reason: 'expired'
              });
              totalSize += stats.size;
            }
            // Check size (for logs)
            else if (rule.maxSize && stats.size > rule.maxSize) {
              files.push({
                path: fullPath,
                name: entry.name,
                size: stats.size,
                age,
                reason: 'oversized'
              });
              totalSize += stats.size;
            }
          } catch (err) {
            // Skip unreadable files
          }
        }
      } catch (err) {
        // Location doesn't exist, skip
      }
    }

    return {
      category,
      files,
      totalSize,
      count: files.length
    };
  },

  // === CLEANUP ===

  /**
   * Run cleanup (with confirmation callback)
   */
  clean: async function(options = {}) {
    const { 
      dryRun = false,
      categories = null,  // null = all, or ['temp', 'logs']
      force = false       // skip confirmation callback
    } = options;

    const scan = await this.scan();
    const results = {
      timestamp: Date.now(),
      dryRun,
      deleted: [],
      failed: [],
      skipped: [],
      freedBytes: 0
    };

    // Filter categories if specified
    const targetCategories = categories 
      ? Object.entries(scan.categories).filter(([cat]) => categories.includes(cat))
      : Object.entries(scan.categories);

    // Collect all files to delete
    const filesToDelete = [];
    for (const [category, data] of targetCategories) {
      for (const file of data.files) {
        filesToDelete.push({ ...file, category });
      }
    }

    if (filesToDelete.length === 0) {
      console.log('[Cleanup] Nothing to clean');
      return results;
    }

    // Confirmation callback
    if (!force && this.onBeforeDelete) {
      const proceed = await this.onBeforeDelete(filesToDelete);
      if (!proceed) {
        console.log('[Cleanup] Aborted by callback');
        results.skipped = filesToDelete;
        return results;
      }
    }

    // Delete files
    for (const file of filesToDelete) {
      if (dryRun) {
        results.deleted.push(file);
        results.freedBytes += file.size;
        continue;
      }

      try {
        await unlink(file.path);
        results.deleted.push(file);
        results.freedBytes += file.size;
      } catch (err) {
        results.failed.push({
          ...file,
          error: err.message
        });
      }
    }

    // Record history
    this.history.push({
      timestamp: results.timestamp,
      deleted: results.deleted.length,
      failed: results.failed.length,
      freedBytes: results.freedBytes,
      dryRun
    });

    // Trim history
    if (this.history.length > 100) {
      this.history = this.history.slice(-100);
    }

    // Callback
    if (this.onAfterCleanup) {
      this.onAfterCleanup(results);
    }

    console.log(`[Cleanup] ${dryRun ? 'Would delete' : 'Deleted'} ${results.deleted.length} files, freed ${this._formatBytes(results.freedBytes)}`);

    return results;
  },

  /**
   * Clean specific category
   */
  cleanCategory: async function(category, options = {}) {
    return this.clean({ ...options, categories: [category] });
  },

  /**
   * Emergency cleanup (aggressive, no confirmation)
   */
  emergencyClean: async function() {
    console.warn('[Cleanup] EMERGENCY CLEANUP');

    // Clean all temp files regardless of age
    const results = {
      timestamp: Date.now(),
      emergency: true,
      deleted: [],
      failed: [],
      freedBytes: 0
    };

    for (const location of this.rules.temp.locations) {
      try {
        const entries = await readdir(location, { withFileTypes: true });

        for (const entry of entries) {
          if (!entry.isFile()) continue;
          if (!this.rules.temp.pattern.test(entry.name)) continue;

          const fullPath = join(location, entry.name);

          try {
            const stats = await stat(fullPath);
            await unlink(fullPath);
            results.deleted.push({ path: fullPath, size: stats.size });
            results.freedBytes += stats.size;
          } catch (err) {
            results.failed.push({ path: fullPath, error: err.message });
          }
        }
      } catch (err) {
        // Skip
      }
    }

    console.warn(`[Cleanup] Emergency: deleted ${results.deleted.length} files, freed ${this._formatBytes(results.freedBytes)}`);
    return results;
  },

  // === MEMORY ===

  /**
   * Suggest garbage collection (if available)
   */
  suggestGC: function() {
    if (global.gc) {
      console.log('[Cleanup] Running garbage collection...');
      global.gc();
      return true;
    }
    return false;
  },

  /**
   * Get memory stats
   */
  getMemoryStats: function() {
    const usage = process.memoryUsage();
    return {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss,
      heapUsedMB: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024)
    };
  },

  // === QUERIES ===

  /**
   * Get cleanup history
   */
  getHistory: function(limit = 20) {
    return this.history.slice(-limit);
  },

  /**
   * Get stats
   */
  getStats: async function() {
    const scan = await this.scan();
    const memory = this.getMemoryStats();

    return {
      disk: {
        cleanableFiles: scan.totalFiles,
        cleanableBytes: scan.totalSize,
        cleanableByCategory: Object.fromEntries(
          Object.entries(scan.categories).map(([cat, data]) => [cat, data.count])
        )
      },
      memory,
      lastCleanup: this.history.length > 0 
        ? this.history[this.history.length - 1]
        : null
    };
  },

  // === HELPERS ===

  _formatBytes: function(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  },

  // === RESET ===

  reset: function() {
    this.history = [];
    this.onBeforeDelete = null;
    this.onAfterCleanup = null;
  }
};

export default Cleanup;
