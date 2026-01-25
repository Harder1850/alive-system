# UI Bridge

## Purpose
Provide a **Node-based bridge** between UI and ALIVE internals.

This exists to:
- Handle filesystem safely
- Avoid browser fs issues
- Keep Rust untouched

## Responsibilities
- Accept HTTP requests from UI
- Route to memory / intent modules
- Persist files deterministically

## Explicit Constraints
- No execution authority
- No background jobs
- No hidden state

## Endpoints
- POST `/memory`
- POST `/intent`

This bridge is replaceable by design.
