/**
 * ALIVE Adaptation
 * 
 * Safe self-modification system.
 * 
 * CRITICAL RULES:
 * 1. NEVER auto-apply changes without approval
 * 2. Core proposes, Human approves
 * 3. All changes are versioned and reversible
 * 4. Risky changes require explicit human consent
 * 
 * Adaptation types:
 * - Config changes (low risk, Core can approve)
 * - Procedure updates (medium risk, review required)
 * - Architecture changes (high risk, human required)
 * - Core changes (critical, human + verification)
 */

import { readFile, writeFile, copyFile, mkdir, readdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { createHash } from 'crypto';

export const Adaptation = {

  // Pending proposals
  proposals: new Map(),

  // Applied changes history
  applied: [],

  // Backup directory
  backupDir: null,

  // Approval callbacks
  approvalCallbacks: {
    low: null,       // Config changes - Core can approve
    medium: null,    // Procedure updates - review queue
    high: null,      // Architecture - human required
    critical: null   // Core changes - human + verification
  },

  // Risk classification
  riskLevels: {
    config: 'low',
    procedure: 'medium',
    adapter: 'medium',
    reasoning: 'high',
    knowledge: 'medium',
    learning: 'high',
    core: 'critical',
    guardian: 'critical'
  },

  // === INITIALIZATION ===

  init: async function(config = {}) {
    this.backupDir = config.backupDir || join(process.cwd(), 'backups');
    await mkdir(this.backupDir, { recursive: true });

    // Load pending proposals if any
    await this._loadPendingProposals();

    console.log('[Adaptation] Initialized');
    return this;
  },

  // === PROPOSALS ===

  /**
   * Propose a change
   */
  propose: async function(change) {
    const proposal = {
      id: this._generateId(),
      timestamp: Date.now(),
      status: 'pending',
      
      // What to change
      type: change.type,           // file, config, architecture
      target: change.target,       // file path or component name
      action: change.action,       // create, modify, delete, move
      
      // The change itself
      before: change.before,       // current state (for modify)
      after: change.after,         // proposed state
      diff: change.diff,           // human-readable diff
      
      // Why
      reason: change.reason,
      triggeredBy: change.triggeredBy,  // health_monitor, integrity_checker, core_reasoning
      
      // Risk assessment
      risk: this._assessRisk(change),
      reversible: change.reversible !== false,
      
      // Approval
      approvedBy: null,
      approvedAt: null,
      
      // Application
      appliedAt: null,
      backupPath: null,
      rollbackAvailable: false
    };

    this.proposals.set(proposal.id, proposal);
    await this._saveProposal(proposal);

    console.log(`[Adaptation] Proposal ${proposal.id}: ${proposal.action} ${proposal.target} (risk: ${proposal.risk})`);

    // Auto-route based on risk
    await this._routeForApproval(proposal);

    return proposal;
  },

  /**
   * Get proposal by ID
   */
  getProposal: function(proposalId) {
    return this.proposals.get(proposalId);
  },

  /**
   * Get all pending proposals
   */
  getPending: function() {
    return [...this.proposals.values()].filter(p => p.status === 'pending');
  },

  /**
   * Get proposals by risk level
   */
  getByRisk: function(risk) {
    return [...this.proposals.values()].filter(p => p.risk === risk && p.status === 'pending');
  },

  // === APPROVAL ===

  /**
   * Register approval callback for risk level
   */
  onApproval: function(riskLevel, callback) {
    this.approvalCallbacks[riskLevel] = callback;
  },

  /**
   * Approve a proposal
   */
  approve: async function(proposalId, approver) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      return { success: false, error: 'proposal_not_found' };
    }

    if (proposal.status !== 'pending') {
      return { success: false, error: 'proposal_not_pending', status: proposal.status };
    }

    // Verify approver has authority for this risk level
    if (proposal.risk === 'critical' && approver !== 'human') {
      return { success: false, error: 'human_approval_required' };
    }

    if (proposal.risk === 'high' && !['human', 'core_verified'].includes(approver)) {
      return { success: false, error: 'high_risk_requires_human_or_verified_core' };
    }

    proposal.status = 'approved';
    proposal.approvedBy = approver;
    proposal.approvedAt = Date.now();

    await this._saveProposal(proposal);

    console.log(`[Adaptation] Proposal ${proposalId} approved by ${approver}`);

    return { success: true, proposal };
  },

  /**
   * Reject a proposal
   */
  reject: async function(proposalId, reason, rejector) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      return { success: false, error: 'proposal_not_found' };
    }

    proposal.status = 'rejected';
    proposal.rejectedBy = rejector;
    proposal.rejectedAt = Date.now();
    proposal.rejectionReason = reason;

    await this._saveProposal(proposal);

    console.log(`[Adaptation] Proposal ${proposalId} rejected: ${reason}`);

    return { success: true };
  },

  // === APPLICATION ===

  /**
   * Apply an approved proposal
   */
  apply: async function(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      return { success: false, error: 'proposal_not_found' };
    }

    if (proposal.status !== 'approved') {
      return { success: false, error: 'proposal_not_approved', status: proposal.status };
    }

    try {
      // Create backup first
      if (proposal.action !== 'create') {
        proposal.backupPath = await this._backup(proposal.target);
        proposal.rollbackAvailable = true;
      }

      // Apply the change
      switch (proposal.action) {
        case 'create':
          await this._applyCreate(proposal);
          break;
        case 'modify':
          await this._applyModify(proposal);
          break;
        case 'delete':
          await this._applyDelete(proposal);
          break;
        case 'move':
          await this._applyMove(proposal);
          break;
        default:
          throw new Error(`Unknown action: ${proposal.action}`);
      }

      proposal.status = 'applied';
      proposal.appliedAt = Date.now();

      await this._saveProposal(proposal);

      // Record in history
      this.applied.push({
        id: proposal.id,
        target: proposal.target,
        action: proposal.action,
        appliedAt: proposal.appliedAt,
        rollbackAvailable: proposal.rollbackAvailable
      });

      console.log(`[Adaptation] Applied: ${proposal.action} ${proposal.target}`);

      return { success: true, proposal };

    } catch (err) {
      proposal.status = 'failed';
      proposal.error = err.message;
      await this._saveProposal(proposal);

      console.error(`[Adaptation] Failed to apply ${proposalId}: ${err.message}`);

      return { success: false, error: err.message };
    }
  },

  // === ROLLBACK ===

  /**
   * Rollback an applied change
   */
  rollback: async function(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      return { success: false, error: 'proposal_not_found' };
    }

    if (proposal.status !== 'applied') {
      return { success: false, error: 'proposal_not_applied' };
    }

    if (!proposal.rollbackAvailable || !proposal.backupPath) {
      return { success: false, error: 'rollback_not_available' };
    }

    try {
      // Restore from backup
      await copyFile(proposal.backupPath, proposal.target);

      proposal.status = 'rolled_back';
      proposal.rolledBackAt = Date.now();

      await this._saveProposal(proposal);

      console.log(`[Adaptation] Rolled back: ${proposal.target}`);

      return { success: true };

    } catch (err) {
      console.error(`[Adaptation] Rollback failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  },

  // === QUERIES ===

  /**
   * Get adaptation history
   */
  getHistory: function(limit = 50) {
    return this.applied.slice(-limit);
  },

  /**
   * Get stats
   */
  getStats: function() {
    const proposals = [...this.proposals.values()];

    return {
      pending: proposals.filter(p => p.status === 'pending').length,
      approved: proposals.filter(p => p.status === 'approved').length,
      applied: proposals.filter(p => p.status === 'applied').length,
      rejected: proposals.filter(p => p.status === 'rejected').length,
      failed: proposals.filter(p => p.status === 'failed').length,
      byRisk: {
        low: proposals.filter(p => p.risk === 'low').length,
        medium: proposals.filter(p => p.risk === 'medium').length,
        high: proposals.filter(p => p.risk === 'high').length,
        critical: proposals.filter(p => p.risk === 'critical').length
      }
    };
  },

  // === INTERNAL ===

  _generateId: function() {
    return `adapt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  },

  _assessRisk: function(change) {
    // Check file path for risk indicators
    const target = change.target.toLowerCase();

    if (target.includes('core') || target.includes('reasoning') || target.includes('guardian')) {
      return 'critical';
    }

    if (target.includes('learning') || target.includes('knowledge') || target.includes('identity')) {
      return 'high';
    }

    if (target.includes('procedure') || target.includes('adapter')) {
      return 'medium';
    }

    if (target.includes('config') || target.includes('.json')) {
      return 'low';
    }

    // Default based on type
    return this.riskLevels[change.type] || 'medium';
  },

  async _routeForApproval(proposal) {
    const callback = this.approvalCallbacks[proposal.risk];
    
    if (callback) {
      try {
        await callback(proposal);
      } catch (err) {
        console.error(`[Adaptation] Approval callback error: ${err.message}`);
      }
    } else {
      console.log(`[Adaptation] No approval callback for risk level: ${proposal.risk}`);
    }
  },

  async _backup(targetPath) {
    const timestamp = Date.now();
    const backupName = `${basename(targetPath)}.${timestamp}.backup`;
    const backupPath = join(this.backupDir, backupName);

    await copyFile(targetPath, backupPath);
    return backupPath;
  },

  async _applyCreate(proposal) {
    await mkdir(dirname(proposal.target), { recursive: true });
    await writeFile(proposal.target, proposal.after);
  },

  async _applyModify(proposal) {
    await writeFile(proposal.target, proposal.after);
  },

  async _applyDelete(proposal) {
    const { unlink } = await import('fs/promises');
    await unlink(proposal.target);
  },

  async _applyMove(proposal) {
    const { rename } = await import('fs/promises');
    await rename(proposal.target, proposal.after);
  },

  async _saveProposal(proposal) {
    const proposalDir = join(this.backupDir, 'proposals');
    await mkdir(proposalDir, { recursive: true });
    await writeFile(
      join(proposalDir, `${proposal.id}.json`),
      JSON.stringify(proposal, null, 2)
    );
  },

  async _loadPendingProposals() {
    const proposalDir = join(this.backupDir, 'proposals');
    
    try {
      const files = await readdir(proposalDir);
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        try {
          const data = JSON.parse(await readFile(join(proposalDir, file), 'utf8'));
          if (data.status === 'pending' || data.status === 'approved') {
            this.proposals.set(data.id, data);
          }
        } catch (err) {
          // Skip invalid files
        }
      }
    } catch (err) {
      // No proposals directory yet
    }
  },

  // === RESET ===

  reset: function() {
    this.proposals.clear();
    this.applied = [];
  }
};

export default Adaptation;
