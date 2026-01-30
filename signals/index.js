/**
 * ALIVE Signals Module
 * 
 * Synthetic emotions / hormone system.
 * 
 * Exports:
 * - SignalBus: Central signal broadcast system
 * - Awareness: Component's interface to signals
 * - SignalPropagation: Cascading signals (inflammation)
 */

export { SignalBus } from './signal.bus.js';
export { Awareness } from './awareness.js';
export { SignalPropagation } from './propagation.js';

export default SignalBus;
