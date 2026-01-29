/**
 * ALIVE System - Body Adapter
 * Thin, explicit forwarding. System does not care what Body does.
 */

import { Observation, RenderInstruction } from './types.js';
import { getClientsByRole } from './registry.js';

export function forwardObservationToBody(obs: Observation): void {
  const bodies = getClientsByRole('body');
  const msg = JSON.stringify(obs);
  
  for (const ws of bodies) {
    ws.send(msg);
  }
  
  if (bodies.length === 0) {
    console.log('[body-adapter] No body connected, observation queued in void');
  }
}

export function broadcastRender(render: RenderInstruction): void {
  const hosts = getClientsByRole('host');
  const msg = JSON.stringify(render);
  
  for (const ws of hosts) {
    ws.send(msg);
  }
}
