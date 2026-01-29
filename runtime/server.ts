/**
 * ALIVE System - WebSocket Server
 * System owns the socket. Clients connect to system.
 */

import { WebSocketServer } from 'ws';
import { SYSTEM_CONFIG } from './config.js';
import { registerClient, unregisterClient, getClientCount } from './registry.js';
import { handleInbound } from './router.js';
import { assertClientRole } from './guards.js';
import { ClientRole } from './types.js';

export function startServer(): void {
  const wss = new WebSocketServer({ port: SYSTEM_CONFIG.port });

  wss.on('connection', (socket, req) => {
    let clientRole: ClientRole | null = null;

    try {
      const url = new URL(req.url || '', 'http://localhost');
      const role = url.searchParams.get('type') as ClientRole | null;

      assertClientRole(role, ['host', 'body']);
      clientRole = role;

      registerClient(socket, role);

      socket.on('message', data => {
        try {
          const msg = JSON.parse(data.toString());
          handleInbound(msg, role);
        } catch (err) {
          console.error('[server] Failed to parse message:', err);
        }
      });

      socket.on('close', () => {
        unregisterClient(socket);
      });

      socket.on('error', err => {
        console.error('[server] Socket error:', err);
      });

    } catch (err) {
      console.log('[server] Rejecting connection:', (err as Error).message);
      socket.close(1008, 'Unauthorized');
    }
  });

  wss.on('error', err => {
    console.error('[server] Server error:', err);
  });

  console.log(`
╔═══════════════════════════════════════════════════════╗
║                    ALIVE SYSTEM                       ║
╠═══════════════════════════════════════════════════════╣
║  Status:   RUNNING                                    ║
║  Port:     ${String(SYSTEM_CONFIG.port).padEnd(43)}║
║  Hosts:    ws://localhost:${SYSTEM_CONFIG.port}/?type=host            ║
║  Body:     ws://localhost:${SYSTEM_CONFIG.port}/?type=body            ║
╠═══════════════════════════════════════════════════════╣
║  Mode:     AUTHORITATIVE ROUTER (no cognition)        ║
╚═══════════════════════════════════════════════════════╝
  `);

  setInterval(() => {
    const count = getClientCount();
    if (count.hosts > 0 || count.bodies > 0) {
      console.log(`[system] clients: ${count.hosts} host(s), ${count.bodies} body(s)`);
    }
  }, 30000);
}
