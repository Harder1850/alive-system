/**
 * ALIVE Signal Bus
 * 
 * Synthetic emotions. Broadcast signals that change system-wide behavior.
 * Like hormones in bloodstream - produced by any component, affects all.
 * 
 * NOT magic. Just chemistry we can code.
 * 
 * Human Equivalent:
 *   Adrenaline  → THREAT
 *   Dopamine    → ATTRACTION  
 *   Cortisol    → PRESSURE
 *   Serotonin   → STABLE
 *   Disgust     → AVERSION
 *   Curiosity   → INTEREST
 *   Pain        → DAMAGE
 */

export const SignalBus = {

  // Current signal levels (0.0 to 1.0)
  signals: {
    THREAT: 0,      // Danger detected - heighten awareness
    ATTRACTION: 0,  // Something good - pursue it
    PRESSURE: 0,    // Resources strained - conserve
    STABLE: 0,      // All good - relax, do background work
    AVERSION: 0,    // Something bad - avoid it
    INTEREST: 0,    // Something novel - investigate
    DAMAGE: 0,      // Something broken - fix it
    URGENCY: 0      // Time pressure - speed up
  },

  // Signal decay rates (per second) - signals fade if not reinforced
  decayRates: {
    THREAT: 0.1,     // Fades slowly (stay alert)
    ATTRACTION: 0.2,
    PRESSURE: 0.05,  // Fades very slowly
    STABLE: 0.1,
    AVERSION: 0.15,
    INTEREST: 0.3,   // Fades fast (novelty wears off)
    DAMAGE: 0.02,    // Fades very slowly (don't ignore damage)
    URGENCY: 0.2
  },

  // Who's contributing to each signal
  sources: {},

  // Subscribers (components listening)
  subscribers: [],

  // Last update timestamp
  lastUpdate: Date.now(),

  // === EMIT SIGNALS ===

  /**
   * Emit a signal from a source
   * @param {string} signal - Signal type (THREAT, ATTRACTION, etc)
   * @param {number} intensity - 0.0 to 1.0
   * @param {string} source - Who's emitting (body.sensor.camera, core.reasoning, etc)
   * @param {object} context - Optional context about why
   */
  emit: function(signal, intensity, source, context = {}) {
    if (!this.signals.hasOwnProperty(signal)) {
      console.warn(`[SignalBus] Unknown signal: ${signal}`);
      return;
    }

    intensity = Math.max(0, Math.min(1, intensity));

    // Track source contribution
    if (!this.sources[signal]) {
      this.sources[signal] = {};
    }
    this.sources[signal][source] = {
      intensity,
      timestamp: Date.now(),
      context
    };

    // Recalculate combined signal level
    this._recalculate(signal);

    // Notify subscribers
    this._notify(signal, source, context);
  },

  /**
   * Remove a source's contribution
   */
  withdraw: function(signal, source) {
    if (this.sources[signal] && this.sources[signal][source]) {
      delete this.sources[signal][source];
      this._recalculate(signal);
    }
  },

  // === READ SIGNALS ===

  /**
   * Get current level of a signal
   */
  get: function(signal) {
    return this.signals[signal] || 0;
  },

  /**
   * Get all current signal levels
   */
  getAll: function() {
    return { ...this.signals };
  },

  /**
   * Get dominant signal (highest intensity)
   */
  getDominant: function() {
    let max = 0;
    let dominant = 'STABLE';

    for (const [signal, level] of Object.entries(this.signals)) {
      if (level > max) {
        max = level;
        dominant = signal;
      }
    }

    return { signal: dominant, intensity: max };
  },

  /**
   * Get computed arousal level based on signals
   */
  getArousalLevel: function() {
    const threat = this.signals.THREAT;
    const damage = this.signals.DAMAGE;
    const urgency = this.signals.URGENCY;
    const pressure = this.signals.PRESSURE;
    const stable = this.signals.STABLE;

    // Emergency if high threat or damage
    if (threat > 0.7 || damage > 0.8) {
      return 'EMERGENCY';
    }

    // Alert if moderate threat or urgency
    if (threat > 0.4 || urgency > 0.6 || damage > 0.4) {
      return 'ALERT';
    }

    // Relaxed if stable and low everything else
    if (stable > 0.5 && threat < 0.1 && pressure < 0.3) {
      return 'RELAXED';
    }

    // Idle if very stable
    if (stable > 0.7 && threat < 0.05 && pressure < 0.1) {
      return 'IDLE';
    }

    return 'NORMAL';
  },

  /**
   * Get what to focus on based on signals
   */
  getFocus: function() {
    const dominant = this.getDominant();

    switch (dominant.signal) {
      case 'THREAT':
        return { type: 'threat', action: 'assess_and_respond' };
      case 'DAMAGE':
        return { type: 'damage', action: 'diagnose_and_repair' };
      case 'ATTRACTION':
        return { type: 'opportunity', action: 'pursue' };
      case 'AVERSION':
        return { type: 'hazard', action: 'avoid' };
      case 'INTEREST':
        return { type: 'novelty', action: 'investigate' };
      case 'URGENCY':
        return { type: 'deadline', action: 'prioritize' };
      case 'PRESSURE':
        return { type: 'resources', action: 'conserve' };
      case 'STABLE':
      default:
        return { type: 'background', action: 'plan_and_learn' };
    }
  },

  // === SUBSCRIBE ===

  /**
   * Subscribe to signal changes
   */
  subscribe: function(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  },

  /**
   * Subscribe to specific signal
   */
  on: function(signal, callback) {
    return this.subscribe((sig, level, source, context) => {
      if (sig === signal) {
        callback(level, source, context);
      }
    });
  },

  // === DECAY ===

  /**
   * Update decay (call periodically)
   */
  tick: function() {
    const now = Date.now();
    const elapsed = (now - this.lastUpdate) / 1000; // seconds
    this.lastUpdate = now;

    // Decay signals from sources that haven't refreshed
    for (const [signal, sources] of Object.entries(this.sources)) {
      const decay = this.decayRates[signal] || 0.1;
      
      for (const [source, data] of Object.entries(sources)) {
        const age = (now - data.timestamp) / 1000;
        
        // If source hasn't refreshed in 1 second, start decay
        if (age > 1) {
          data.intensity = Math.max(0, data.intensity - decay * elapsed);
          
          // Remove dead sources
          if (data.intensity <= 0) {
            delete sources[source];
          }
        }
      }

      this._recalculate(signal);
    }
  },

  /**
   * Start automatic decay ticker
   */
  startDecay: function(intervalMs = 100) {
    this._decayTimer = setInterval(() => this.tick(), intervalMs);
  },

  /**
   * Stop decay ticker
   */
  stopDecay: function() {
    if (this._decayTimer) {
      clearInterval(this._decayTimer);
      this._decayTimer = null;
    }
  },

  // === INTERNAL ===

  _recalculate: function(signal) {
    const sources = this.sources[signal] || {};
    
    // Combine sources: take max (not sum, to prevent runaway)
    let max = 0;
    for (const data of Object.values(sources)) {
      max = Math.max(max, data.intensity);
    }

    this.signals[signal] = max;
  },

  _notify: function(signal, source, context) {
    const level = this.signals[signal];
    
    for (const callback of this.subscribers) {
      try {
        callback(signal, level, source, context);
      } catch (err) {
        console.error('[SignalBus] Subscriber error:', err.message);
      }
    }
  },

  // === QUERIES ===

  /**
   * Get sources contributing to a signal
   */
  getSources: function(signal) {
    return { ...this.sources[signal] };
  },

  /**
   * Get full state for debugging
   */
  getState: function() {
    return {
      signals: { ...this.signals },
      arousal: this.getArousalLevel(),
      focus: this.getFocus(),
      dominant: this.getDominant(),
      sources: JSON.parse(JSON.stringify(this.sources))
    };
  },

  // === RESET ===

  reset: function() {
    for (const signal of Object.keys(this.signals)) {
      this.signals[signal] = 0;
    }
    this.sources = {};
    this.subscribers = [];
    this.stopDecay();
  }
};

export default SignalBus;
