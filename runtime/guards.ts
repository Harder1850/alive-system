/**
 * ALIVE System - Authority Guards
 * Non-negotiable boundary enforcement.
 */

import { ClientRole } from './types.js';

export function assertClientRole(
  role: ClientRole | null,
  allowed: ClientRole[]
): asserts role is ClientRole {
  if (!role || !allowed.includes(role)) {
    throw new Error(`Unauthorized role: ${role}`);
  }
}
