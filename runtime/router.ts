/**
 * ALIVE System - Router
 * The ENTIRE brain of the system. Anything more would be illegal.
 */

import { ClientRole, Observation, RenderInstruction } from './types.js';
import { forwardObservationToBody, broadcastRender } from './body-adapter.js';

export function handleInbound(msg: any, role: ClientRole): void {
  if (role === 'host') {
    handleHostMessage(msg);
  } else if (role === 'body') {
    handleBodyMessage(msg);
  }
}

function handleHostMessage(msg: any): void {
  if (msg?.type !== 'observation') {
    console.log('[router] Ignoring non-observation from host:', msg?.type);
    return;
  }

  const observation = msg as Observation;
  console.log(`[router] observation (${observation.modality}): ${typeof observation.raw === 'string' ? observation.raw.slice(0, 50) : '[data]'}`);

  forwardObservationToBody(observation);

  broadcastRender({
    type: 'render',
    canvas: 'text',
    content: { status: 'received' }
  });
}

function handleBodyMessage(msg: any): void {
  if (msg?.type !== 'render') {
    console.log('[router] Ignoring non-render from body:', msg?.type);
    return;
  }

  const render = msg as RenderInstruction;
  console.log(`[router] render (${render.canvas})`);

  broadcastRender(render);
}
