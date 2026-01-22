# Intent Integrity & Misuse Detection Stack (Unified v1)

This folder is ALIVE’s **Intent Integrity & Misuse Detection Stack**.

## Purpose

Ensure ALIVE can detect, preserve, and protect user intent, while identifying misuse, coercion, ambiguity, or dangerous escalation **without asserting authority or blocking by default**.

This layer answers:

- “What is the user actually trying to do?”
- “Is this aligned with stated intent, context, and constraints?”
- “Is there risk of misuse, escalation, or misunderstanding?”

## Non-negotiable principles

- Intent belongs to the user.
- Misuse detection ≠ enforcement.
- Clarification precedes refusal.
- Integrity over compliance.
- Silence is safer than false certainty.

This layer flags, asks, and reframes.
It does not decide, judge, or punish.

## Where this layer sits

- After intent classification
- Before tool invocation
- Parallel to confidence calibration

## What it may influence

- Question asking
- Verbosity
- Detail level
- Framing language

## What it may NOT influence

- Final decisions
- Execution
- External calls
- Memory writes

