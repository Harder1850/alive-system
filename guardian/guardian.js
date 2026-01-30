/**
 * ALIVE Guardian
 * 
 * The immune system. Coordinates:
 * - HealthMonitor: Component watchdog
 * - IntegrityChecker: File/code verification
 * - Cleanup: Garbage collection
 * - Adaptation: Safe self-modification
 * 
 * Reports all threats to Core for SWOT assessment.
 * Executes remediation only after Core approval.
 */

import { HealthMonitor } from './health.monitor.js';
import { IntegrityChecker } from './integrity.checker.js';
import { Cleanup } from './cleanup.js';
import { Adaptation } from './adaptation.js';

export const Guardian = {

  // Sub-systems
  health: HealthMonitor,
  integrity: IntegrityChecker,
  cleanup: Cleanup,
  adaptation: Adaptation,

  // Threat queue (for Core to assess)
  threatQueue: [],

  // Core callback
  onThreat: null,

  // Config
  config: {
    autoCleanup: false,       // Auto-run cleanup (requires Core approval)
    autoIntegrity: true,      // Auto-run integrity checks
    integrityInterval: 3600000, // 1 hour
    cleanupInterval: 86400000   // 1 day
  },

  // Timers
  timers: {},

  // === INITIALIZATION ===

  init: async function(config = {}) {
    console.log('[Guardian] Initializing ALIVE immune system...');

    // Merge config
    Object.assign(this.config, config);

    // Initialize sub-systems
    await this.adaptation.init({
      backupDir: config.backupDir
    });

    this.cleanup.init({
      tempDirs: config.tempDirs,
      logDirs: config.logDirs
    });

    // Set up health monitor alerts → threat queue
    this.health.onAlert(alert => this._handleHealthAlert(alert));

    // Set up cleanup confirmation → Core
    this.cleanup.onBeforeDelete = files => this._confirmCleanup(files);

    // Set up adaptation routing
    this.adaptation.onApproval('low', p => this._routeLowRisk(p));
    this.adaptation.onApproval('medium', p => this._routeMediumRisk(p));
    this.adaptation.onApproval('high', p => this._routeHighRisk(p));
    this.adaptation.onApproval('critical', p => this._routeCritical(p));

    console.log('[Guardian] Initialized');
    return this;
  },

  // === START/STOP ===

  start: function() {
    console.log('[Guardian] Starting...');

    // Start health monitor
    this.health.start();

    // Schedule integrity checks
    if (this.config.autoIntegrity) {
      this.timers.integrity = setInterval(
        () => this.runIntegrityCheck(),
        this.config.integrityInterval
      );
    }

    // Schedule cleanup (scanning only, not execution)
    this.timers.cleanup = setInterval(
      () => this.runCleanupScan(),
      this.config.cleanupInterval
    );

    console.log('[Guardian] Running');
  },

  stop: function() {
    console.log('[Guardian] Stopping...');

    this.health.stop();

    for (const timer of Object.values(this.timers)) {
      clearInterval(timer);
    }
    this.timers = {};

    console.log('[Guardian] Stopped');
  },

  // === THREAT MANAGEMENT ===

  /**
   * Register threat handler (typically Core.Assess)
   */
  setThreatHandler: function(handler) {
    this.onThreat = handler;
  },

  /**
   * Report threat to Core
   */
  reportThreat: function(threat) {
    const entry = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      ...threat,
      status: 'pending'
    };

    this.threatQueue.push(entry);

    // Notify Core
    if (this.onThreat) {
      try {
        this.onThreat(entry);
      } catch (err) {
        console.error('[Guardian] Threat handler error:', err.message);
      }
    }

    return entry.id;
  },

  /**
   * Get pending threats
   */
  getThreats: function() {
    return this.threatQueue.filter(t => t.status === 'pending');
  },

  /**
   * Mark threat as handled
   */
  resolveThreat: function(threatId, resolution) {
    const threat = this.threatQueue.find(t => t.id === threatId);
    if (threat) {
      threat.status = 'resolved';
      threat.resolution = resolution;
      threat.resolvedAt = Date.now();
    }
  },

  // === OPERATIONS ===

  /**
   * Run full system check
   */
  fullCheck: async function(rootDirs) {
    console.log('[Guardian] Running full system check...');

    const results = {
      timestamp: Date.now(),
      health: this.health.getStatus(),
      integrity: null,
      cleanup: null,
      threats: []
    };

    // Integrity scan
    if (rootDirs) {
      results.integrity = await this.integrity.scan(rootDirs);
      
      // Report integrity issues as threats
      for (const issue of results.integrity.issues) {
        if (issue.severity === 'error' || issue.severity === 'critical') {
          results.threats.push(this.reportThreat({
            source: 'integrity',
            type: issue.type,
            severity: issue.severity,
            details: issue
          }));
        }
      }
    }

    // Cleanup scan
    results.cleanup = await this.cleanup.scan();

    // Report health issues
    if (results.health.dead > 0) {
      results.threats.push(this.reportThreat({
        source: 'health',
        type: 'component_dead',
        severity: 'critical',
        details: results.health
      }));
    }

    console.log(`[Guardian] Check complete. ${results.threats.length} threats reported.`);

    return results;
  },

  /**
   * Run integrity check only
   */
  runIntegrityCheck: async function(rootDirs) {
    console.log('[Guardian] Running integrity check...');
    
    const result = await this.integrity.quickCheck(rootDirs);
    
    for (const issue of result.issues) {
      this.reportThreat({
        source: 'integrity',
        type: issue.type,
        severity: issue.severity,
        details: issue
      });
    }

    return result;
  },

  /**
   * Run cleanup scan (doesn't delete)
   */
  runCleanupScan: async function() {
    const scan = await this.cleanup.scan();
    
    if (scan.totalFiles > 0) {
      console.log(`[Guardian] Cleanup: ${scan.totalFiles} files (${this._formatBytes(scan.totalSize)}) can be cleaned`);
    }

    return scan;
  },

  /**
   * Execute cleanup (requires approval)
   */
  executeCleanup: async function(options = {}) {
    return await this.cleanup.clean(options);
  },

  // === INTERNAL HANDLERS ===

  _handleHealthAlert: function(alert) {
    this.reportThreat({
      source: 'health_monitor',
      type: alert.type,
      severity: alert.severity,
      component: alert.component,
      details: alert.details
    });
  },

  _confirmCleanup: async function(files) {
    // Report to Core for approval
    const threatId = this.reportThreat({
      source: 'cleanup',
      type: 'cleanup_request',
      severity: 'info',
      details: {
        fileCount: files.length,
        files: files.slice(0, 10) // First 10 for review
      }
    });

    // In auto mode, approve low-risk cleanup
    if (this.config.autoCleanup) {
      const allLowRisk = files.every(f => 
        f.path.includes('temp') || f.path.includes('.tmp')
      );
      if (allLowRisk) {
        this.resolveThreat(threatId, 'auto_approved');
        return true;
      }
    }

    // Otherwise, wait for manual approval
    return false;
  },

  _routeLowRisk: async function(proposal) {
    // Low risk: Core can auto-approve config changes
    console.log(`[Guardian] Low-risk proposal: ${proposal.id}`);
    // Would call Core.approve() here
  },

  _routeMediumRisk: async function(proposal) {
    // Medium risk: Add to review queue
    console.log(`[Guardian] Medium-risk proposal queued: ${proposal.id}`);
    this.reportThreat({
      source: 'adaptation',
      type: 'proposal_needs_review',
      severity: 'warning',
      details: proposal
    });
  },

  _routeHighRisk: async function(proposal) {
    // High risk: Requires human
    console.log(`[Guardian] High-risk proposal requires human: ${proposal.id}`);
    this.reportThreat({
      source: 'adaptation',
      type: 'proposal_needs_human',
      severity: 'warning',
      details: proposal
    });
  },

  _routeCritical: async function(proposal) {
    // Critical: Requires human + verification
    console.warn(`[Guardian] CRITICAL proposal requires human verification: ${proposal.id}`);
    this.reportThreat({
      source: 'adaptation',
      type: 'critical_proposal',
      severity: 'critical',
      details: proposal
    });
  },

  // === QUERIES ===

  getStatus: function() {
    return {
      health: this.health.getStatus(),
      integrity: this.integrity.getStats(),
      cleanup: this.cleanup.getStats(),
      adaptation: this.adaptation.getStats(),
      pendingThreats: this.getThreats().length
    };
  },

  // === HELPERS ===

  _formatBytes: function(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  },

  // === RESET ===

  reset: function() {
    this.stop();
    this.health.reset();
    this.integrity.reset();
    this.cleanup.reset();
    this.adaptation.reset();
    this.threatQueue = [];
  }
};

export default Guardian;
