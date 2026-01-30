/**
 * ALIVE Signal Propagation
 * 
 * Handles cascading signals based on severity and scope.
 * Like inflammation - damage in one area affects neighbors.
 * 
 * Severity × Scope = Total Impact
 * 
 * Human equivalents:
 *   - Histamines spreading from injury site
 *   - Pain radiating outward
 *   - Fever (whole-body response to local infection)
 *   - Inflammation cascade
 */

import { SignalBus } from './signal.bus.js';

export const SignalPropagation = {

  // Component dependency graph
  // If A depends on B, damage to B affects A
  dependencies: {
    'core.reasoning': ['body.sensors', 'core.knowledge', 'core.memory'],
    'core.learning': ['core.reasoning', 'core.memory'],
    'core.knowledge': ['system.storage'],
    'body.sensors': ['system.resources'],
    'body.actuators': ['system.resources', 'core.reasoning'],
    'body.navigation': ['body.sensors', 'core.reasoning'],
    'system.guardian': ['system.resources'],
    'system.orchestrator': ['core.reasoning', 'body.sensors', 'system.resources']
  },

  // Propagation rules
  rules: {
    // Severity thresholds for escalation
    escalateAt: 0.5,      // Above this, signal spreads
    cascadeDecay: 0.3,    // How much signal loses when spreading
    maxCascadeDepth: 3,   // Don't spread forever
    
    // Time-based escalation
    escalateAfterMs: 5000,  // Unresolved issues escalate
    escalateRate: 0.1       // How much to increase per interval
  },

  // Active issues being tracked
  activeIssues: new Map(),

  // === ISSUE MANAGEMENT ===

  /**
   * Report an issue (damage, threat, etc)
   */
  reportIssue: function(issue) {
    const entry = {
      id: issue.id || `issue_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      source: issue.source,           // Which component
      type: issue.type,               // damage, threat, malfunction, etc
      severity: issue.severity,       // 0-1
      scope: issue.scope || 'local',  // local, component, system
      description: issue.description,
      
      // Tracking
      acknowledged: false,
      escalated: false,
      escalationCount: 0,
      resolved: false,
      
      // Affected components (will be populated by propagation)
      affected: [issue.source]
    };

    this.activeIssues.set(entry.id, entry);

    // Emit initial signal
    this._emitForIssue(entry);

    // Propagate based on severity
    if (entry.severity >= this.rules.escalateAt) {
      this._propagate(entry);
    }

    console.log(`[Propagation] Issue reported: ${entry.type} at ${entry.source} (severity: ${entry.severity})`);

    return entry.id;
  },

  /**
   * Acknowledge an issue (we know about it, working on it)
   */
  acknowledgeIssue: function(issueId) {
    const issue = this.activeIssues.get(issueId);
    if (issue) {
      issue.acknowledged = true;
      issue.acknowledgedAt = Date.now();
      // Reduce signal slightly when acknowledged
      issue.severity = Math.max(0.1, issue.severity * 0.8);
      this._emitForIssue(issue);
    }
  },

  /**
   * Resolve an issue
   */
  resolveIssue: function(issueId) {
    const issue = this.activeIssues.get(issueId);
    if (issue) {
      issue.resolved = true;
      issue.resolvedAt = Date.now();
      
      // Withdraw signals
      this._withdrawForIssue(issue);
      
      // Keep in history briefly, then remove
      setTimeout(() => {
        this.activeIssues.delete(issueId);
      }, 10000);

      console.log(`[Propagation] Issue resolved: ${issueId}`);
    }
  },

  /**
   * Update issue severity (getting worse or better)
   */
  updateSeverity: function(issueId, newSeverity) {
    const issue = this.activeIssues.get(issueId);
    if (issue && !issue.resolved) {
      const oldSeverity = issue.severity;
      issue.severity = Math.max(0, Math.min(1, newSeverity));
      
      // Re-emit signals
      this._emitForIssue(issue);
      
      // If getting worse and crosses threshold, propagate more
      if (newSeverity > oldSeverity && newSeverity >= this.rules.escalateAt) {
        this._propagate(issue);
      }

      console.log(`[Propagation] Issue ${issueId} severity: ${oldSeverity.toFixed(2)} → ${newSeverity.toFixed(2)}`);
    }
  },

  // === TIME-BASED ESCALATION ===

  /**
   * Check for unresolved issues and escalate
   * Call this periodically
   */
  tick: function() {
    const now = Date.now();

    for (const [id, issue] of this.activeIssues) {
      if (issue.resolved) continue;

      const age = now - issue.timestamp;
      const timeSinceAck = issue.acknowledgedAt ? (now - issue.acknowledgedAt) : age;

      // Unacknowledged issues escalate faster
      if (!issue.acknowledged && age > this.rules.escalateAfterMs) {
        this._escalate(issue, 'unacknowledged');
      }
      // Acknowledged but unresolved issues escalate slower
      else if (issue.acknowledged && timeSinceAck > this.rules.escalateAfterMs * 2) {
        this._escalate(issue, 'unresolved');
      }
    }
  },

  /**
   * Start automatic escalation ticker
   */
  startTicker: function(intervalMs = 1000) {
    this._ticker = setInterval(() => this.tick(), intervalMs);
  },

  /**
   * Stop ticker
   */
  stopTicker: function() {
    if (this._ticker) {
      clearInterval(this._ticker);
      this._ticker = null;
    }
  },

  // === QUERIES ===

  /**
   * Get all active issues
   */
  getActiveIssues: function() {
    return [...this.activeIssues.values()].filter(i => !i.resolved);
  },

  /**
   * Get issues affecting a component
   */
  getIssuesFor: function(component) {
    return this.getActiveIssues().filter(i => 
      i.affected.some(a => a.startsWith(component))
    );
  },

  /**
   * Get overall system health score (0-1, 1 = healthy)
   */
  getHealthScore: function() {
    const issues = this.getActiveIssues();
    if (issues.length === 0) return 1;

    // Sum of severity weighted by scope
    let totalImpact = 0;
    for (const issue of issues) {
      const scopeMultiplier = issue.scope === 'system' ? 3 : (issue.scope === 'component' ? 2 : 1);
      totalImpact += issue.severity * scopeMultiplier;
    }

    // Normalize (assuming max reasonable impact of 5)
    return Math.max(0, 1 - (totalImpact / 5));
  },

  // === INTERNAL ===

  _emitForIssue: function(issue) {
    if (issue.resolved) return;

    // Determine signal type based on issue type
    let signal = 'DAMAGE';
    if (issue.type === 'threat') signal = 'THREAT';
    if (issue.type === 'resource') signal = 'PRESSURE';
    if (issue.type === 'malfunction') signal = 'DAMAGE';

    // Emit from each affected component
    for (const component of issue.affected) {
      SignalBus.emit(signal, issue.severity, `${component}.issue.${issue.id}`, {
        issueId: issue.id,
        type: issue.type,
        scope: issue.scope
      });
    }
  },

  _withdrawForIssue: function(issue) {
    const signal = issue.type === 'threat' ? 'THREAT' : (issue.type === 'resource' ? 'PRESSURE' : 'DAMAGE');
    
    for (const component of issue.affected) {
      SignalBus.withdraw(signal, `${component}.issue.${issue.id}`);
    }
  },

  _propagate: function(issue, depth = 0) {
    if (depth >= this.rules.maxCascadeDepth) return;

    // Find components that depend on affected components
    const newlyAffected = [];

    for (const [component, deps] of Object.entries(this.dependencies)) {
      // Skip if already affected
      if (issue.affected.includes(component)) continue;

      // Check if any dependency is affected
      const affectedDep = deps.find(dep => 
        issue.affected.some(a => a.startsWith(dep) || dep.startsWith(a))
      );

      if (affectedDep) {
        newlyAffected.push(component);
      }
    }

    if (newlyAffected.length > 0) {
      // Add to affected list
      issue.affected.push(...newlyAffected);
      
      // Expand scope if spreading
      if (issue.affected.length > 3) {
        issue.scope = 'system';
      } else if (issue.affected.length > 1) {
        issue.scope = 'component';
      }

      // Re-emit with cascaded (decayed) severity
      const cascadedSeverity = issue.severity * (1 - this.rules.cascadeDecay);
      
      for (const component of newlyAffected) {
        const signal = issue.type === 'threat' ? 'THREAT' : 'DAMAGE';
        SignalBus.emit(signal, cascadedSeverity, `${component}.cascade.${issue.id}`, {
          issueId: issue.id,
          cascadeDepth: depth + 1,
          cascadedFrom: issue.source
        });
      }

      console.log(`[Propagation] Issue ${issue.id} spread to: ${newlyAffected.join(', ')}`);

      // Continue propagation
      this._propagate(issue, depth + 1);
    }
  },

  _escalate: function(issue, reason) {
    issue.escalated = true;
    issue.escalationCount++;
    issue.lastEscalation = Date.now();

    // Increase severity
    const oldSeverity = issue.severity;
    issue.severity = Math.min(1, issue.severity + this.rules.escalateRate);

    // Expand scope if escalating multiple times
    if (issue.escalationCount >= 3 && issue.scope === 'local') {
      issue.scope = 'component';
    } else if (issue.escalationCount >= 5 && issue.scope === 'component') {
      issue.scope = 'system';
    }

    // Re-emit and possibly propagate
    this._emitForIssue(issue);
    
    if (issue.severity >= this.rules.escalateAt) {
      this._propagate(issue);
    }

    console.log(`[Propagation] Issue ${issue.id} escalated (${reason}): ${oldSeverity.toFixed(2)} → ${issue.severity.toFixed(2)}, scope: ${issue.scope}`);
  },

  // === RESET ===

  reset: function() {
    // Withdraw all signals
    for (const issue of this.activeIssues.values()) {
      this._withdrawForIssue(issue);
    }
    this.activeIssues.clear();
    this.stopTicker();
  }
};

export default SignalPropagation;
