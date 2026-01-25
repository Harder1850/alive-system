# Phase 35 Intent Contract

## 1. What is an “Intent” in ALIVE?

An Intent is a structured representation of a desired action or goal within the ALIVE system. It encapsulates what the system or user wants to achieve, serving as the bridge between input (like user utterances) and execution.

Examples:
- A user utterance: "Find recipes for chicken curry"
- A system goal: "Optimize memory usage"
- A background task: "Monitor system health"
- A delegated request: "Ask another model to summarize text"

## 2. What must every intent include?

Minimum fields, nothing extra:

```javascript
intent = {
  id,              // unique identifier (string)
  source,          // 'user' | 'system' | 'memory' | 'external'
  type,            // 'question' | 'task' | 'plan' | 'monitor' | 'delegate'
  confidence,      // number (0-1) or enum ('low', 'medium', 'high')
  urgency,         // enum ('low', 'medium', 'high') or number
  permissions,     // array of strings, e.g. ['read_memory', 'execute_task']
  created_at       // timestamp (ISO string or Date)
}
```

## 3. What intents are explicitly forbidden

This matters more than what’s allowed.

Examples:
- Self-modifying goals: Intents that attempt to change the system's core behavior or code.
- Recursive delegation without cap: Delegating to another intent that delegates back without a limit.
- Silent execution: Intents that run without logging or traceability.
- Authority escalation: Intents that grant higher permissions than the source has.

## 4. What Phase 35 does NOT do

Be ruthless here.
- Does not execute intents.
- Does not modify memory.
- Does not interact with external systems.
- Does not handle context.
- Does not perform planning or delegation logic beyond classification.
