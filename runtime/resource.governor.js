/**
 * ALIVE Resource Governor
 * 
 * Dynamic resource allocation based on system state.
 * Emergency mode vs idle mode distribution.
 * 
 * Principle: Spend resources where they matter most, right now.
 */

export const ResourceGovernor = {

  // Current mode
  mode: 'normal',

  // Mode definitions
  modes: {
    emergency: {
      priority: ['sensors', 'actuators', 'reasoning'],
      throttle: ['memory', 'learning', 'swarm'],
      suspend: ['aesthetics', 'optimization'],
      cpuCeiling: 1.0,    // 100%
      memoryCeiling: 0.9,  // 90%
      networkPriority: 'critical_only'
    },
    alert: {
      priority: ['sensors', 'reasoning', 'actuators'],
      throttle: ['learning', 'optimization'],
      suspend: ['aesthetics'],
      cpuCeiling: 0.85,
      memoryCeiling: 0.8,
      networkPriority: 'high'
    },
    normal: {
      priority: ['reasoning', 'sensors'],
      throttle: [],
      suspend: [],
      cpuCeiling: 0.7,
      memoryCeiling: 0.7,
      networkPriority: 'normal'
    },
    idle: {
      priority: ['learning', 'memory', 'optimization'],
      throttle: ['sensors', 'actuators'],
      suspend: [],
      cpuCeiling: 0.3,
      memoryCeiling: 0.5,
      networkPriority: 'low'
    },
    critical_battery: {
      priority: ['sensors', 'reasoning'],
      throttle: ['actuators', 'swarm', 'learning'],
      suspend: ['aesthetics', 'optimization', 'memory'],
      cpuCeiling: 0.4,
      memoryCeiling: 0.4,
      networkPriority: 'emergency_only'
    }
  },

  // Resource budgets (current allocations)
  budgets: {
    sensors: { cpu: 0, memory: 0, priority: 0 },
    actuators: { cpu: 0, memory: 0, priority: 0 },
    reasoning: { cpu: 0, memory: 0, priority: 0 },
    memory: { cpu: 0, memory: 0, priority: 0 },
    learning: { cpu: 0, memory: 0, priority: 0 },
    swarm: { cpu: 0, memory: 0, priority: 0 },
    aesthetics: { cpu: 0, memory: 0, priority: 0 },
    optimization: { cpu: 0, memory: 0, priority: 0 }
  },

  // System state
  state: {
    cpu: { total: 1.0, used: 0, available: 1.0 },
    memory: { total: 1.0, used: 0, available: 1.0 },
    battery: { level: 1.0, charging: false, critical: false },
    temperature: { level: 0.5, throttling: false }
  },

  // === MODE MANAGEMENT ===

  setMode: function(newMode) {
    if (!this.modes[newMode]) {
      console.error(`[Governor] Unknown mode: ${newMode}`);
      return false;
    }

    const oldMode = this.mode;
    this.mode = newMode;
    
    console.log(`[Governor] Mode: ${oldMode} → ${newMode}`);
    
    // Reallocate resources
    this._reallocate();
    
    return true;
  },

  // Auto-select mode based on conditions
  autoMode: function() {
    // Check battery first
    if (this.state.battery.level < 0.1 && !this.state.battery.charging) {
      return this.setMode('critical_battery');
    }

    // Check for emergency conditions (would come from SWOT)
    if (this._hasEmergency()) {
      return this.setMode('emergency');
    }

    // Check for alert conditions
    if (this._hasAlert()) {
      return this.setMode('alert');
    }

    // Check if idle
    if (this._isIdle()) {
      return this.setMode('idle');
    }

    // Default to normal
    return this.setMode('normal');
  },

  // === RESOURCE ALLOCATION ===

  // Request resources for a subsystem
  request: function(subsystem, needs) {
    const modeConfig = this.modes[this.mode];
    
    // Check if suspended
    if (modeConfig.suspend.includes(subsystem)) {
      return {
        granted: false,
        reason: 'suspended_in_current_mode',
        mode: this.mode
      };
    }

    // Calculate available
    const available = {
      cpu: this.state.cpu.available * modeConfig.cpuCeiling,
      memory: this.state.memory.available * modeConfig.memoryCeiling
    };

    // Priority multiplier
    let priorityMult = 1.0;
    if (modeConfig.priority.includes(subsystem)) {
      priorityMult = 1.5;
    } else if (modeConfig.throttle.includes(subsystem)) {
      priorityMult = 0.5;
    }

    // Calculate grant
    const granted = {
      cpu: Math.min(needs.cpu || 0, available.cpu) * priorityMult,
      memory: Math.min(needs.memory || 0, available.memory) * priorityMult
    };

    // Update budgets
    this.budgets[subsystem] = {
      cpu: granted.cpu,
      memory: granted.memory,
      priority: priorityMult
    };

    // Update state
    this.state.cpu.used += granted.cpu;
    this.state.cpu.available -= granted.cpu;
    this.state.memory.used += granted.memory;
    this.state.memory.available -= granted.memory;

    return {
      granted: true,
      allocation: granted,
      priority: priorityMult,
      mode: this.mode
    };
  },

  // Release resources
  release: function(subsystem) {
    const budget = this.budgets[subsystem];
    if (!budget) return;

    // Return to pool
    this.state.cpu.used -= budget.cpu;
    this.state.cpu.available += budget.cpu;
    this.state.memory.used -= budget.memory;
    this.state.memory.available += budget.memory;

    // Clear budget
    this.budgets[subsystem] = { cpu: 0, memory: 0, priority: 0 };
  },

  // === QUERIES ===

  // Can subsystem run right now?
  canRun: function(subsystem) {
    const modeConfig = this.modes[this.mode];
    return !modeConfig.suspend.includes(subsystem);
  },

  // What priority is subsystem?
  getPriority: function(subsystem) {
    const modeConfig = this.modes[this.mode];
    
    if (modeConfig.priority.includes(subsystem)) return 'high';
    if (modeConfig.throttle.includes(subsystem)) return 'low';
    if (modeConfig.suspend.includes(subsystem)) return 'suspended';
    return 'normal';
  },

  // Get current allocations
  getAllocations: function() {
    return {
      mode: this.mode,
      budgets: { ...this.budgets },
      state: { ...this.state },
      ceilings: {
        cpu: this.modes[this.mode].cpuCeiling,
        memory: this.modes[this.mode].memoryCeiling
      }
    };
  },

  // === STATE UPDATES ===

  updateCPU: function(used) {
    this.state.cpu.used = used;
    this.state.cpu.available = this.state.cpu.total - used;
    
    // Auto-throttle if overloaded
    if (this.state.cpu.available < 0.1) {
      this._emergencyThrottle();
    }
  },

  updateMemory: function(used) {
    this.state.memory.used = used;
    this.state.memory.available = this.state.memory.total - used;
    
    // Auto-throttle if low
    if (this.state.memory.available < 0.1) {
      this._emergencyThrottle();
    }
  },

  updateBattery: function(level, charging = false) {
    this.state.battery.level = level;
    this.state.battery.charging = charging;
    this.state.battery.critical = level < 0.1 && !charging;
    
    // Auto-switch to critical mode
    if (this.state.battery.critical && this.mode !== 'critical_battery') {
      this.setMode('critical_battery');
    }
  },

  updateTemperature: function(level) {
    this.state.temperature.level = level;
    this.state.temperature.throttling = level > 0.85;
    
    // Reduce ceilings if throttling
    if (this.state.temperature.throttling) {
      this._thermalThrottle();
    }
  },

  // === INTERNAL ===

  _reallocate: function() {
    // Release all current allocations
    for (const subsystem of Object.keys(this.budgets)) {
      this.release(subsystem);
    }

    // Subsystems will need to re-request
    console.log(`[Governor] Resources reallocated for mode: ${this.mode}`);
  },

  _emergencyThrottle: function() {
    console.warn('[Governor] Emergency throttle - low resources');
    
    // Suspend non-essential
    const modeConfig = this.modes[this.mode];
    for (const subsystem of [...modeConfig.throttle, ...modeConfig.suspend]) {
      this.release(subsystem);
    }
  },

  _thermalThrottle: function() {
    console.warn('[Governor] Thermal throttle active');
    
    // Reduce all allocations by 30%
    for (const [subsystem, budget] of Object.entries(this.budgets)) {
      if (budget.cpu > 0) {
        const reduction = budget.cpu * 0.3;
        this.budgets[subsystem].cpu -= reduction;
        this.state.cpu.used -= reduction;
        this.state.cpu.available += reduction;
      }
    }
  },

  _hasEmergency: function() {
    // Placeholder - would check SWOT threats
    return false;
  },

  _hasAlert: function() {
    // Placeholder - would check SWOT threats/opportunities
    return false;
  },

  _isIdle: function() {
    // Placeholder - would check activity levels
    return this.state.cpu.used < 0.1;
  },

  // === REPORTING ===

  getReport: function() {
    const modeConfig = this.modes[this.mode];
    
    return {
      mode: this.mode,
      state: {
        cpu: `${Math.round(this.state.cpu.used * 100)}% used`,
        memory: `${Math.round(this.state.memory.used * 100)}% used`,
        battery: `${Math.round(this.state.battery.level * 100)}%${this.state.battery.charging ? ' (charging)' : ''}`,
        temperature: this.state.temperature.throttling ? 'THROTTLING' : 'OK'
      },
      priorities: {
        high: modeConfig.priority,
        throttled: modeConfig.throttle,
        suspended: modeConfig.suspend
      },
      allocations: Object.entries(this.budgets)
        .filter(([_, b]) => b.cpu > 0 || b.memory > 0)
        .map(([name, b]) => `${name}: CPU ${Math.round(b.cpu * 100)}%, MEM ${Math.round(b.memory * 100)}%`)
    };
  },

  // === RESET ===

  reset: function() {
    this.mode = 'normal';
    this.state = {
      cpu: { total: 1.0, used: 0, available: 1.0 },
      memory: { total: 1.0, used: 0, available: 1.0 },
      battery: { level: 1.0, charging: false, critical: false },
      temperature: { level: 0.5, throttling: false }
    };
    
    for (const subsystem of Object.keys(this.budgets)) {
      this.budgets[subsystem] = { cpu: 0, memory: 0, priority: 0 };
    }
  }
};

export default ResourceGovernor;
