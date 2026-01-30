/**
 * ALIVE Guardian Module
 * 
 * The immune system for ALIVE.
 * 
 * Exports:
 * - Guardian: Main coordinator
 * - HealthMonitor: Component watchdog
 * - IntegrityChecker: File/code verification
 * - Cleanup: Garbage collection
 * - Adaptation: Safe self-modification
 */

export { Guardian } from './guardian.js';
export { HealthMonitor } from './health.monitor.js';
export { IntegrityChecker } from './integrity.checker.js';
export { Cleanup } from './cleanup.js';
export { Adaptation } from './adaptation.js';

export default Guardian;
