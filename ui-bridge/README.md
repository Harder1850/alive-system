# UI Bridge (Phase 1.5)

This module provides a **minimal HTTP bridge** between a local UI shell
and the ALIVE system.

## Endpoint

POST http://localhost:7331/input

### Request

```json
{
  "input": "string",
  "source": "ui",
  "timestamp": "iso8601"
}
```

### Response

```json
{
  "output": "string",
  "type": "text",
  "timestamp": "iso8601"
}
```

## Invariants

- Text only
- No execution
- No scheduling
- No background loops
- No memory persistence
- No authority escalation
- Localhost only

The bridge is a mail slot, not a controller.

If deleted, ALIVE continues to function.

## Run (dev)

From `alive-system/ui-bridge`:

```bash
node server.ts
```

You should see:

```
[ui-bridge] listening on http://localhost:7331
```

