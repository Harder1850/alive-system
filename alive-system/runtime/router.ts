/**
 * ALIVE System - Router
 * 
 * The ENTIRE brain of the system. Anything more would be illegal.
 */

import { ClientRole, Observation, RenderInstruction } from './types.js';
import { forwardObservationToBody, broadcastRender } from './body-adapter.js';

/**
 * Handle inbound message from a client.
 * Routes based on role and message type. No interpretation.
 */
export function handleInbound(msg: any, role: ClientRole): void {
  if (role === 'host') {
    handleHostMessage(msg);
  } else if (role === 'body') {
    handleBodyMessage(msg);
  }
}

/**
 * Host sends observations. Forward to Body.
 */
function handleHostMessage(msg: any): void {
  if (msg?.type !== 'observation') {
    console.log('[router] Ignoring non-observation from host:', msg?.type);
    return;
  }

  const observation = msg as Observation;
  console.log(`[router] observation (${observation.modality}): ${typeof observation.raw === 'string' ? observation.raw.slice(0, 50) : '[data]'}`);

  // Forward raw observation to Body
  forwardObservationToBody(observation);

  // Acknowledge receipt (non-semantic)
  broadcastRender({
    type: 'render',
    canvas: 'text',
    content: { status: 'received' }
  });
}

/**
 * Body sends render instructions. Broadcast to Hosts.
 */
function handleBodyMessage(msg: any): void {
  if (msg?.type !== 'render') {
    console.log('[router] Ignoring non-render from body:', msg?.type);
    return;
  }

  const render = msg as RenderInstruction;
  console.log(`[router] render (${render.canvas})`);

  // Broadcast to all hosts
  broadcastRender(render);
}
