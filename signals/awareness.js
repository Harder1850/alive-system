/**
 * ALIVE Awareness
 * 
 * Each component's interface to the signal system.
 * 
 * - Produces signals based on what it detects
 * - Reacts to signals from others
 * - Adjusts behavior based on arousal level
 * 
 * Create one instance per component:
 *   const bodyAwareness = new Awareness('body', SignalBus);
 *   const coreAwareness = new Awareness('core', SignalBus);
 *   const systemAwareness = new Awareness('system', SignalBus);
 */

export class Awareness {

  constructor(componentId, signalBus) {
    this.componentId = componentId;
    this.bus = signalBus;

    // Component-specific signal producers
    this.producers = new Map();

    // Reactions to arousal levels
    this.arousalReactions = {
      EMERGENCY: null,
      ALERT: null,
      NORMAL: null,
      RELAXED: null,
      IDLE: null
    };

    // Current state
    this.currentArousal = 'NORMAL';
    this.lastArousal = 'NORMAL';

    // Subscribe to bus changes
    this.bus.subscribe((signal, level, source, context) => {
      this._onSignalChange(signal, level, source, context);
    });
  }

  // === PRODUCE SIGNALS ===

  /**
   * Register a signal producer
   * @param {string} name - Producer name (e.g., 'camera', 'reasoning', 'resource_monitor')
   * @param {Function} detector - () => { signal, intensity, context } or null
   */
  registerProducer: function(name, detector) {
    this.producers.set(name, {
      name,
      detector,
      lastSignal: null
    });
  },

  /**
   * Run all producers and emit signals
   */
  sense: function() {
    for (const [name, producer] of this.producers) {
      try {
        const result = producer.detector();
        
        if (result && result.signal && result.intensity > 0) {
          const source = `${this.componentId}.${name}`;
          this.bus.emit(result.signal, result.intensity, source, result.context || {});
          producer.lastSignal = result;
        } else if (producer.lastSignal) {
          // Withdraw previous signal
          const source = `${this.componentId}.${name}`;
          this.bus.withdraw(producer.lastSignal.signal, source);
          producer.lastSignal = null;
        }
      } catch (err) {
        console.error(`[Awareness:${this.componentId}] Producer ${name} error:`, err.message);
      }
    }
  },

  /**
   * Directly emit a signal
   */
  emit: function(signal, intensity, subSource, context = {}) {
    const source = subSource 
      ? `${this.componentId}.${subSource}` 
      : this.componentId;
    this.bus.emit(signal, intensity, source, context);
  },

  /**
   * Withdraw a signal
   */
  withdraw: function(signal, subSource) {
    const source = subSource 
      ? `${this.componentId}.${subSource}` 
      : this.componentId;
    this.bus.withdraw(signal, source);
  },

  // === REACT TO SIGNALS ===

  /**
   * Set reaction for arousal level change
   */
  onArousal: function(level, reaction) {
    this.arousalReactions[level] = reaction;
  },

  /**
   * Check arousal and react if changed
   */
  checkArousal: function() {
    const newArousal = this.bus.getArousalLevel();
    
    if (newArousal !== this.currentArousal) {
      this.lastArousal = this.currentArousal;
      this.currentArousal = newArousal;
      
      console.log(`[Awareness:${this.componentId}] Arousal: ${this.lastArousal} → ${newArousal}`);
      
      const reaction = this.arousalReactions[newArousal];
      if (reaction) {
        try {
          reaction(newArousal, this.lastArousal);
        } catch (err) {
          console.error(`[Awareness:${this.componentId}] Reaction error:`, err.message);
        }
      }
    }

    return this.currentArousal;
  },

  // === QUERIES ===

  /**
   * Get current arousal level
   */
  getArousal: function() {
    return this.bus.getArousalLevel();
  },

  /**
   * Get what to focus on
   */
  getFocus: function() {
    return this.bus.getFocus();
  },

  /**
   * Get specific signal level
   */
  getSignal: function(signal) {
    return this.bus.get(signal);
  },

  /**
   * Check if in high-alert state
   */
  isAlert: function() {
    const arousal = this.getArousal();
    return arousal === 'EMERGENCY' || arousal === 'ALERT';
  },

  /**
   * Check if can do background work
   */
  canDoBackground: function() {
    const arousal = this.getArousal();
    return arousal === 'RELAXED' || arousal === 'IDLE' || arousal === 'NORMAL';
  },

  /**
   * Get recommended sensor sensitivity (0-1)
   */
  getSensorSensitivity: function() {
    switch (this.getArousal()) {
      case 'EMERGENCY': return 1.0;
      case 'ALERT': return 0.8;
      case 'NORMAL': return 0.5;
      case 'RELAXED': return 0.3;
      case 'IDLE': return 0.1;
      default: return 0.5;
    }
  },

  /**
   * Get recommended processing allocation for foreground (0-1)
   */
  getForegroundAllocation: function() {
    switch (this.getArousal()) {
      case 'EMERGENCY': return 1.0;
      case 'ALERT': return 0.8;
      case 'NORMAL': return 0.5;
      case 'RELAXED': return 0.2;
      case 'IDLE': return 0.1;
      default: return 0.5;
    }
  },

  // === INTERNAL ===

  _onSignalChange: function(signal, level, source, context) {
    // Could add per-signal reactions here
    // For now, just check arousal on any change
    this.checkArousal();
  }
}

export default Awareness;
