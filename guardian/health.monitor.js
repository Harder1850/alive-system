/**
 * ALIVE Health Monitor
 * 
 * Watchdog for all components. Detects:
 * - Component failures (no heartbeat)
 * - Resource leaks (memory, handles)
 * - Stuck processes (no progress)
 * - Anomalous behavior (outside normal patterns)
 * 
 * Reports threats to Core for SWOT assessment.
 * Does NOT decide responses - only detects and reports.
 */

export const HealthMonitor = {

  // Registered components
  components: new Map(),

  // Health history
  history: [],

  // Alert callbacks
  alertHandlers: [],

  // Config
  config: {
    heartbeatTimeout: 5000,      // ms before component considered dead
    checkInterval: 1000,         // ms between health checks
    historyLimit: 1000,          // max history entries
    anomalyThreshold: 2.0        // standard deviations for anomaly
  },

  // Running state
  running: false,
  checkTimer: null,

  // === REGISTRATION ===

  /**
   * Register a component for monitoring
   */
  register: function(componentId, options = {}) {
    this.components.set(componentId, {
      id: componentId,
      type: options.type || 'unknown',      // core, body, system
      critical: options.critical || false,   // system fails if this dies
      lastHeartbeat: Date.now(),
      lastMetrics: null,
      status: 'unknown',
      baseline: null,                        // normal metrics baseline
      anomalyCount: 0
    });

    console.log(`[HealthMonitor] Registered: ${componentId}`);
    return true;
  },

  /**
   * Unregister a component
   */
  unregister: function(componentId) {
    this.components.delete(componentId);
  },

  // === HEARTBEATS ===

  /**
   * Receive heartbeat from component
   */
  heartbeat: function(componentId, metrics = {}) {
    const component = this.components.get(componentId);
    if (!component) {
      console.warn(`[HealthMonitor] Heartbeat from unknown component: ${componentId}`);
      return false;
    }

    const now = Date.now();
    
    component.lastHeartbeat = now;
    component.lastMetrics = {
      ...metrics,
      timestamp: now
    };
    component.status = 'alive';

    // Check for anomalies
    if (component.baseline) {
      const anomaly = this._detectAnomaly(component, metrics);
      if (anomaly) {
        component.anomalyCount++;
        this._alert({
          type: 'anomaly',
          severity: 'warning',
          component: componentId,
          details: anomaly,
          timestamp: now
        });
      } else {
        component.anomalyCount = Math.max(0, component.anomalyCount - 1);
      }
    } else {
      // Build baseline from first N readings
      this._updateBaseline(component, metrics);
    }

    return true;
  },

  // === MONITORING ===

  /**
   * Start monitoring
   */
  start: function() {
    if (this.running) return;
    
    this.running = true;
    this.checkTimer = setInterval(() => this._check(), this.config.checkInterval);
    console.log('[HealthMonitor] Started');
  },

  /**
   * Stop monitoring
   */
  stop: function() {
    this.running = false;
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
    console.log('[HealthMonitor] Stopped');
  },

  /**
   * Run health check
   */
  _check: function() {
    const now = Date.now();
    const alerts = [];

    for (const [id, component] of this.components) {
      // Check heartbeat timeout
      const timeSinceHeartbeat = now - component.lastHeartbeat;
      
      if (timeSinceHeartbeat > this.config.heartbeatTimeout) {
        const wasAlive = component.status === 'alive';
        component.status = 'dead';

        if (wasAlive) {
          alerts.push({
            type: 'component_dead',
            severity: component.critical ? 'critical' : 'error',
            component: id,
            details: {
              lastSeen: component.lastHeartbeat,
              timeout: timeSinceHeartbeat
            },
            timestamp: now
          });
        }
      }

      // Check for resource leaks (if metrics available)
      if (component.lastMetrics) {
        const leak = this._detectResourceLeak(component);
        if (leak) {
          alerts.push({
            type: 'resource_leak',
            severity: 'warning',
            component: id,
            details: leak,
            timestamp: now
          });
        }
      }

      // Check for stuck process
      if (component.lastMetrics?.progress !== undefined) {
        const stuck = this._detectStuck(component);
        if (stuck) {
          alerts.push({
            type: 'stuck_process',
            severity: 'warning',
            component: id,
            details: stuck,
            timestamp: now
          });
        }
      }
    }

    // Record history
    this._recordHistory({
      timestamp: now,
      components: this._snapshot(),
      alerts: alerts.length
    });

    // Send alerts
    for (const alert of alerts) {
      this._alert(alert);
    }
  },

  // === ALERTS ===

  /**
   * Register alert handler (typically Core.Assess)
   */
  onAlert: function(handler) {
    this.alertHandlers.push(handler);
  },

  /**
   * Send alert to all handlers
   */
  _alert: function(alert) {
    console.warn(`[HealthMonitor] ALERT: ${alert.type} - ${alert.component} (${alert.severity})`);
    
    for (const handler of this.alertHandlers) {
      try {
        handler(alert);
      } catch (err) {
        console.error('[HealthMonitor] Alert handler error:', err.message);
      }
    }
  },

  // === QUERIES ===

  /**
   * Get current health status
   */
  getStatus: function() {
    const components = {};
    let healthy = 0;
    let dead = 0;
    let warning = 0;

    for (const [id, component] of this.components) {
      components[id] = {
        status: component.status,
        lastHeartbeat: component.lastHeartbeat,
        anomalyCount: component.anomalyCount,
        critical: component.critical
      };

      if (component.status === 'alive' && component.anomalyCount === 0) {
        healthy++;
      } else if (component.status === 'dead') {
        dead++;
      } else {
        warning++;
      }
    }

    return {
      overall: dead > 0 ? 'critical' : (warning > 0 ? 'degraded' : 'healthy'),
      healthy,
      warning,
      dead,
      components
    };
  },

  /**
   * Get component health
   */
  getComponent: function(componentId) {
    return this.components.get(componentId) || null;
  },

  /**
   * Get health history
   */
  getHistory: function(limit = 100) {
    return this.history.slice(-limit);
  },

  // === DETECTION HELPERS ===

  _detectAnomaly: function(component, metrics) {
    const baseline = component.baseline;
    if (!baseline || !baseline.samples || baseline.samples < 10) return null;

    const anomalies = [];

    for (const [key, value] of Object.entries(metrics)) {
      if (typeof value !== 'number') continue;
      if (!baseline[key]) continue;

      const { mean, stddev } = baseline[key];
      if (stddev === 0) continue;

      const zScore = Math.abs((value - mean) / stddev);
      if (zScore > this.config.anomalyThreshold) {
        anomalies.push({
          metric: key,
          value,
          expected: mean,
          deviation: zScore
        });
      }
    }

    return anomalies.length > 0 ? anomalies : null;
  },

  _detectResourceLeak: function(component) {
    const metrics = component.lastMetrics;
    const baseline = component.baseline;
    
    if (!baseline || !metrics) return null;

    const leaks = [];

    // Check memory growth
    if (metrics.memoryUsed && baseline.memoryUsed) {
      const growth = metrics.memoryUsed / baseline.memoryUsed.mean;
      if (growth > 2.0) { // 2x baseline
        leaks.push({ resource: 'memory', growth });
      }
    }

    // Check handle count
    if (metrics.handles && baseline.handles) {
      const growth = metrics.handles / baseline.handles.mean;
      if (growth > 1.5) {
        leaks.push({ resource: 'handles', growth });
      }
    }

    return leaks.length > 0 ? leaks : null;
  },

  _detectStuck: function(component) {
    // Would need multiple readings to detect stuck
    // For now, placeholder
    return null;
  },

  _updateBaseline: function(component, metrics) {
    if (!component.baseline) {
      component.baseline = { samples: 0 };
    }

    component.baseline.samples++;

    for (const [key, value] of Object.entries(metrics)) {
      if (typeof value !== 'number') continue;

      if (!component.baseline[key]) {
        component.baseline[key] = { mean: value, stddev: 0, min: value, max: value, sum: value, sumSq: value * value };
      } else {
        const b = component.baseline[key];
        b.sum += value;
        b.sumSq += value * value;
        b.min = Math.min(b.min, value);
        b.max = Math.max(b.max, value);
        
        const n = component.baseline.samples;
        b.mean = b.sum / n;
        b.stddev = Math.sqrt((b.sumSq / n) - (b.mean * b.mean));
      }
    }
  },

  _snapshot: function() {
    const snap = {};
    for (const [id, component] of this.components) {
      snap[id] = component.status;
    }
    return snap;
  },

  _recordHistory: function(entry) {
    this.history.push(entry);
    if (this.history.length > this.config.historyLimit) {
      this.history.shift();
    }
  },

  // === RESET ===

  reset: function() {
    this.stop();
    this.components.clear();
    this.history = [];
    this.alertHandlers = [];
  }
};

export default HealthMonitor;
