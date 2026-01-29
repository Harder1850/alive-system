/**
 * ALIVE System - Connection Registry
 * Live topology only. This is NOT memory.
 */

import WebSocket from 'ws';
import { ClientRole } from './types.js';

interface Client {
  socket: WebSocket;
  role: ClientRole;
  id: string;
}

const clients: Client[] = [];
let clientCounter = 0;

export function registerClient(socket: WebSocket, role: ClientRole): string {
  const id = `${role}-${++clientCounter}`;
  clients.push({ socket, role, id });
  console.log(`[registry] + ${id} connected (${clients.length} total)`);
  return id;
}

export function unregisterClient(socket: WebSocket): void {
  const idx = clients.findIndex(c => c.socket === socket);
  if (idx >= 0) {
    const client = clients[idx];
    clients.splice(idx, 1);
    console.log(`[registry] - ${client.id} disconnected (${clients.length} total)`);
  }
}

export function getClientsByRole(role: ClientRole): WebSocket[] {
  return clients
    .filter(c => c.role === role && c.socket.readyState === WebSocket.OPEN)
    .map(c => c.socket);
}

export function getClientCount(): { hosts: number; bodies: number } {
  return {
    hosts: clients.filter(c => c.role === 'host').length,
    bodies: clients.filter(c => c.role === 'body').length
  };
}
