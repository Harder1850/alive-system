# ALIVE UI Shell

## Purpose
Provide a **minimal interface** to interact with ALIVE.

The UI is intentionally:
- Lightweight
- Ephemeral
- On-demand

## Capabilities
- Text input
- (Planned) voice input
- Terminal-style interaction
- Optional dashboards

## Non-Goals
- Persistent GUI
- Complex menus
- Background services

ALIVE works even if the UI is closed.

## Architecture
- UI does not access filesystem
- UI communicates via `ui-bridge`
- UI renders responses only
