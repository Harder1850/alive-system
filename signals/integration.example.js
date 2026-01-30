/**
 * ALIVE Signal Integration Examples
 * 
 * Shows how Body, Core, and System each participate in the signal system.
 */

import { SignalBus } from './signal.bus.js';
import { Awareness } from './awareness.js';

// ============================================================
// BODY AWARENESS
// ============================================================

export function createBodyAwareness() {
  const awareness = new Awareness('body', SignalBus);

  // --- PRODUCERS ---

  // Camera threat detection
  awareness.registerProducer('camera', () => {
    // Would check actual camera data
    const obstacleDistance = getObstacleDistance(); // hypothetical
    
    if (obstacleDistance < 1) {
      return { signal: 'THREAT', intensity: 0.9, context: { type: 'collision_imminent', distance: obstacleDistance } };
    } else if (obstacleDistance < 5) {
      return { signal: 'THREAT', intensity: 0.3, context: { type: 'obstacle_near', distance: obstacleDistance } };
    }
    return null;
  });

  // Sensor health
  awareness.registerProducer('health', () => {
    const sensorErrors = getSensorErrorCount(); // hypothetical
    
    if (sensorErrors > 5) {
      return { signal: 'DAMAGE', intensity: 0.7, context: { errors: sensorErrors } };
    } else if (sensorErrors > 0) {
      return { signal: 'DAMAGE', intensity: 0.2, context: { errors: sensorErrors } };
    }
    return null;
  });

  // Novelty detection
  awareness.registerProducer('novelty', () => {
    const newObjects = getNewObjectCount(); // hypothetical
    
    if (newObjects > 0) {
      return { signal: 'INTEREST', intensity: Math.min(0.8, newObjects * 0.2), context: { count: newObjects } };
    }
    return null;
  });

  // --- REACTIONS ---

  awareness.onArousal('EMERGENCY', () => {
    // Max sensitivity, all sensors active
    setSensorSensitivity(1.0);
    setAllSensorsActive(true);
    enableReflexes(true);
  });

  awareness.onArousal('ALERT', () => {
    setSensorSensitivity(0.8);
    setAllSensorsActive(true);
    enableReflexes(true);
  });

  awareness.onArousal('NORMAL', () => {
    setSensorSensitivity(0.5);
    setAllSensorsActive(true);
    enableReflexes(true);
  });

  awareness.onArousal('RELAXED', () => {
    setSensorSensitivity(0.3);
    setNonEssentialSensors(false);
    enableReflexes(true); // always keep reflexes
  });

  awareness.onArousal('IDLE', () => {
    setSensorSensitivity(0.1);
    setNonEssentialSensors(false);
    enableReflexes(true);
  });

  return awareness;
}


// ============================================================
// CORE AWARENESS
// ============================================================

export function createCoreAwareness() {
  const awareness = new Awareness('core', SignalBus);

  // --- PRODUCERS ---

  // Reasoning detected threat
  awareness.registerProducer('reasoning', () => {
    const threat = getCurrentThreatAssessment(); // from SWOT
    
    if (threat && threat.severity > 0) {
      return { signal: 'THREAT', intensity: threat.severity, context: threat };
    }
    return null;
  });

  // Goal attraction
  awareness.registerProducer('goals', () => {
    const opportunity = getCurrentOpportunity(); // hypothetical
    
    if (opportunity && opportunity.value > 0) {
      return { signal: 'ATTRACTION', intensity: opportunity.value, context: opportunity };
    }
    return null;
  });

  // Something to avoid (ethical, dangerous, etc)
  awareness.registerProducer('ethics', () => {
    const violation = checkEthicalConcerns(); // hypothetical
    
    if (violation) {
      return { signal: 'AVERSION', intensity: violation.severity, context: violation };
    }
    return null;
  });

  // Time pressure
  awareness.registerProducer('deadlines', () => {
    const urgentTask = getMostUrgentTask(); // hypothetical
    
    if (urgentTask && urgentTask.timeLeft < 60000) { // less than 1 minute
      return { signal: 'URGENCY', intensity: 0.9, context: urgentTask };
    } else if (urgentTask && urgentTask.timeLeft < 300000) { // less than 5 minutes
      return { signal: 'URGENCY', intensity: 0.5, context: urgentTask };
    }
    return null;
  });

  // --- REACTIONS ---

  awareness.onArousal('EMERGENCY', () => {
    // All attention to immediate problem
    suspendBackgroundThinking();
    setDecisionMode('fast');
    prioritizeSurvival();
  });

  awareness.onArousal('ALERT', () => {
    reduceBackgroundThinking();
    setDecisionMode('quick');
  });

  awareness.onArousal('NORMAL', () => {
    enableBackgroundThinking(0.5);
    setDecisionMode('balanced');
  });

  awareness.onArousal('RELAXED', () => {
    enableBackgroundThinking(0.8);
    setDecisionMode('thorough');
    // Good time for planning, learning, consolidation
    triggerLearningCycle();
  });

  awareness.onArousal('IDLE', () => {
    enableBackgroundThinking(0.9);
    setDecisionMode('deep');
    // Deep thinking, goal review, memory consolidation
    triggerMemoryConsolidation();
    reviewLongTermGoals();
  });

  return awareness;
}


// ============================================================
// SYSTEM AWARENESS
// ============================================================

export function createSystemAwareness() {
  const awareness = new Awareness('system', SignalBus);

  // --- PRODUCERS ---

  // Resource pressure
  awareness.registerProducer('resources', () => {
    const usage = getResourceUsage(); // CPU, memory, battery
    
    if (usage.cpu > 0.9 || usage.memory > 0.9 || usage.battery < 0.1) {
      return { signal: 'PRESSURE', intensity: 0.8, context: usage };
    } else if (usage.cpu > 0.7 || usage.memory > 0.7 || usage.battery < 0.2) {
      return { signal: 'PRESSURE', intensity: 0.4, context: usage };
    }
    return null;
  });

  // System health
  awareness.registerProducer('health', () => {
    const health = getSystemHealth(); // from Guardian
    
    if (health.dead > 0) {
      return { signal: 'DAMAGE', intensity: 0.9, context: health };
    } else if (health.warning > 0) {
      return { signal: 'DAMAGE', intensity: 0.3, context: health };
    }
    return null;
  });

  // All good signal
  awareness.registerProducer('stability', () => {
    const stable = isSystemStable(); // hypothetical
    
    if (stable) {
      return { signal: 'STABLE', intensity: 0.7, context: { uptime: getUptime() } };
    }
    return null;
  });

  // --- REACTIONS ---

  awareness.onArousal('EMERGENCY', () => {
    // Max resources to critical systems
    setResourceMode('emergency');
    suspendNonCritical();
    allocateMax('body.sensors');
    allocateMax('core.reasoning');
  });

  awareness.onArousal('ALERT', () => {
    setResourceMode('alert');
    reduceBackground();
  });

  awareness.onArousal('NORMAL', () => {
    setResourceMode('normal');
    balanceResources();
  });

  awareness.onArousal('RELAXED', () => {
    setResourceMode('efficient');
    // Can do maintenance, cleanup
    scheduleCleanup();
  });

  awareness.onArousal('IDLE', () => {
    setResourceMode('idle');
    // Deep maintenance, updates, learning
    runMaintenance();
  });

  return awareness;
}


// ============================================================
// WIRE THEM TOGETHER
// ============================================================

export function initializeSignalSystem() {
  // Start the signal bus decay timer
  SignalBus.startDecay(100);

  // Create awareness for each component
  const body = createBodyAwareness();
  const core = createCoreAwareness();
  const system = createSystemAwareness();

  // Main loop would call these periodically:
  // body.sense();    // Run body's signal producers
  // core.sense();    // Run core's signal producers  
  // system.sense();  // Run system's signal producers

  return { body, core, system, bus: SignalBus };
}


// ============================================================
// PLACEHOLDER FUNCTIONS (would be real in actual implementation)
// ============================================================

function getObstacleDistance() { return 100; }
function getSensorErrorCount() { return 0; }
function getNewObjectCount() { return 0; }
function setSensorSensitivity(v) {}
function setAllSensorsActive(v) {}
function setNonEssentialSensors(v) {}
function enableReflexes(v) {}

function getCurrentThreatAssessment() { return null; }
function getCurrentOpportunity() { return null; }
function checkEthicalConcerns() { return null; }
function getMostUrgentTask() { return null; }
function suspendBackgroundThinking() {}
function reduceBackgroundThinking() {}
function enableBackgroundThinking(v) {}
function setDecisionMode(v) {}
function prioritizeSurvival() {}
function triggerLearningCycle() {}
function triggerMemoryConsolidation() {}
function reviewLongTermGoals() {}

function getResourceUsage() { return { cpu: 0.3, memory: 0.4, battery: 0.8 }; }
function getSystemHealth() { return { dead: 0, warning: 0 }; }
function isSystemStable() { return true; }
function getUptime() { return Date.now(); }
function setResourceMode(v) {}
function suspendNonCritical() {}
function reduceBackground() {}
function balanceResources() {}
function allocateMax(v) {}
function scheduleCleanup() {}
function runMaintenance() {}
