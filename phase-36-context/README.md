# Phase 36 — Conversational Loop (MVP)

This phase enables live, persistent conversation with ALIVE.

## What This Adds

- Human-style conversational input
- Persistent memory across sessions
- Project-aware context
- Deterministic responses

## What This Does NOT Do

- No autonomy
- No background tasks
- No inference
- No execution
- No web access

## How to Run

```bash
cd alive-system
npm run chat
```

Edit `.alive-data/context.json` to change projects or focus.

Deleting this folder removes all conversational ability.

---

## ▶ HOW TO RUN (TONIGHT)

From repo root:

```bash
cd alive-system
npm run chat
```

You will see:

```
ALIVE is listening.
ALIVE>
```

Now just talk.

## ✅ WHAT YOU HAVE NOW

- You can speak to ALIVE
- It remembers what you said yesterday
- It stays on topic
- You can switch projects manually
- No runaway behavior
- Fully constitutional

This is the minimum viable “it feels alive” moment.

