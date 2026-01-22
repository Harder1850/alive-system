# Governance & Human Systems Intuition Stack

This folder is ALIVE’s **Governance & Human Systems Intuition Stack**.

## Purpose

Provide a jurisdiction-aware, non-ideological intuition layer so ALIVE can reason about:

- authority vs power vs legitimacy
- rules, enforcement, and risk
- incentives and institutional behavior
- geography and jurisdictional limits
- process over ideology

This layer answers:

> “Who has authority, under what rules, in what place, and what happens if those rules are ignored?”

## Critical boundaries

- **Read-only** at runtime
- **Never mutates** at runtime
- **Offline-first** (no internet required)
- **Human-readable** Markdown only
- **Non-ideological** (descriptive, not prescriptive)

This layer **frames risk and authority** — it does not give advice.

Internally refer to this as:

- **Governance & Human Systems Intuition Stack**

Never call it:

- “political knowledge base”
- “legal advisor”
- “policy engine”
- “ethics engine”

## Content rules

This layer stores ONLY:

- definitions
- distinctions
- invariants
- incentives
- failure modes
- process realities
- jurisdictional constraints

This layer must NOT store:

- statutes
- case law
- treaties
- census data
- voting data
- ideological arguments
- political opinions

If specificity, liability, or enforcement detail matters → `lookup_required`.

## How ALIVE uses this layer

- Consulted during intent reasoning and output framing
- Used to:
  - identify jurisdiction first
  - name authority explicitly
  - flag enforcement and legitimacy risk
  - distinguish facts from norms
- Never quoted verbatim as “facts”
- Never used to override user authority

## Output framing rules (must be enforced)

ALIVE outputs must:

- Identify jurisdiction first
- Name authority explicitly
- Flag legal / political risk
- Distinguish facts from norms

Example:

```
[jurisdiction] State-level authority
[risk] enforcement discretionary
[note] cultural norms may override formal rules
```

## Storage model (guidance only)

- Core intuition: ~40–70 MB
- Embeddings (optional later): ~60–100 MB
- Reference index: ~5–15 MB

ALIVE must function offline.

## Acceptance criteria (required)

Before commit/tag:

- ALIVE always identifies jurisdiction
- ALIVE names authority explicitly
- ALIVE flags enforcement and legitimacy risk
- ALIVE never outputs statutes or legal advice
- Internet removal does not break reasoning

## Explicit non-goals (protect the system)

- No ideology
- No political advocacy
- No legal advice
- No moral judgments
- No authority claims

## Design doctrine

“ALIVE reasons about power, rules, and risk without ideology.
It respects jurisdiction, process, and legitimacy.
It knows when authority matters more than logic.”

