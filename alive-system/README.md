# ALIVE System

The authoritative router. First executable incarnation of ALIVE.

**Boring. Non-cognitive. Correct.**

---

## What This Does

- Accept WebSocket connections
- Authenticate client roles (host / body)
- Route messages
- Enforce authority boundaries
- Stay alive
- Stay dumb

## What This Does NOT

- Parse intent
- Execute actions
- Store memory
- Reason
- Decide meaning

Those belong elsewhere.

---

## Quick Start

```bash
npm install
npm start
```

---

## Connection URLs

| Client | URL |
|--------|-----|
| Host (UI/CLI) | `ws://localhost:7070/?type=host` |
| Body | `ws://localhost:7070/?type=body` |

---

## Message Flow

```
host → observation → alive-system → body
body → render      → alive-system → host
```

No shortcuts. No backchannels.

---

## Message Types

### Host → System

```json
{
  "type": "observation",
  "source": "host-ui",
  "modality": "text",
  "raw": "user input here",
  "meta": {}
}
```

### System → Host (via Body)

```json
{
  "type": "render",
  "canvas": "text",
  "content": { "text": "response here" }
}
```

---

## Architecture

```
runtime/
├── index.ts        # Entry point
├── server.ts       # WebSocket server
├── router.ts       # Message routing (the entire brain)
├── registry.ts     # Live connection topology
├── body-adapter.ts # Thin forwarding to Body
├── guards.ts       # Authority enforcement
├── config.ts       # Configuration
└── types.ts        # Canonical message types (THE LAW)
```

---

## Updating host-ui

The `host-ui-update/` folder contains updated files for host-ui:

1. Copy `system-client.js` → `host-ui/src/services/`
2. Copy `coordinator.js` → `host-ui/src/host/`
3. Copy `output-panel.js` → `host-ui/src/panels/`
4. Copy `server.js` → `host-ui/`

This converts host-ui from a server to a client that connects to alive-system.

---

## What's Next

1. **Wire alive-body** - Connects as `?type=body`, receives observations, sends renders
2. **Test the loop** - Host → System → Body → System → Host
3. **Add alive-core** - Body forwards to Core for cognition
