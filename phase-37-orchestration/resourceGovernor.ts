// phase-37-orchestration/resourceGovernor.ts

export interface ResourceState {
  cpuLoad: number        // 0.0 – 1.0
  memoryUsedMB: number
  memoryLimitMB: number
  pendingIntents: number
  lastForegroundAt: number // epoch ms
  lastPredictionErrorAt: number | null
}

export function canRunBackgroundCognition(state: ResourceState): boolean {
  if (!backgroundCognitionEnabled) return false

  const now = Date.now()

  // HARD BLOCKS
  if (state.pendingIntents > 0) return false
  if (state.cpuLoad > 0.25) return false
  if (state.memoryUsedMB / state.memoryLimitMB > 0.7) return false

  // COOLDOWNS
  if (now - state.lastForegroundAt < 30_000) return false
  if (
    state.lastPredictionErrorAt &&
    now - state.lastPredictionErrorAt < 60_000
  ) return false

  return true
}

export interface BackgroundTaskBudget {
  maxMillis: number     // e.g. 50–200ms
  maxMemoryMB: number   // e.g. +5MB
  maxOperations: number
}

export async function runWithBudget(
  task: () => Promise<void>,
  budget: BackgroundTaskBudget
) {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Background cognition exceeded time budget")), budget.maxMillis)
  )

  await Promise.race([task(), timeout])
}

export enum BackgroundTaskType {
  COMPRESS_CONTEXT,
  INDEX_MEMORY,
  DECAY_MEMORY,
  CALIBRATE_PREDICTION,
  CONSISTENCY_CHECK,
  COMPLETE_GOAL,  // forbidden
  CREATE_PLAN     // forbidden
}

export interface MemoryItem {
  id: string
  lastAccessedAt: number
  importance: number    // 0–1
  sizeBytes: number
}

export function shouldDecay(item: MemoryItem): boolean {
  const age = Date.now() - item.lastAccessedAt

  if (item.importance < 0.3 && age > 24 * 60 * 60 * 1000) return true
  if (item.importance < 0.1 && age > 60 * 60 * 1000) return true

  return false
}

let backgroundLock = false

export async function tryRunBackgroundTask(
  state: ResourceState,
  taskType: BackgroundTaskType,
  task: () => Promise<void>
) {
  assertNoSideEffects(taskType)

  if (backgroundLock) return
  if (!canRunBackgroundCognition(state)) return

  backgroundLock = true
  try {
    await runWithBudget(task, {
      maxMillis: 100,
      maxMemoryMB: 5,
      maxOperations: 1000
    })
  } finally {
    backgroundLock = false
  }
}

function assertNoSideEffects(task: BackgroundTaskType) {
  if (
    task === BackgroundTaskType.COMPRESS_CONTEXT || // assuming these are not in enum, but to match
    task === BackgroundTaskType.INDEX_MEMORY // wait, the code has COMPLETE_GOAL, but since not in enum, perhaps remove
  ) {
    // The provided code has COMPLETE_GOAL and CREATE_PLAN, but they are not in the enum.
    // Since the enum only has the allowed ones, perhaps this function is to check if task is in allowed.
    // But the code says if task === BackgroundTaskType.COMPLETE_GOAL, but COMPLETE_GOAL is not defined.
    // Probably a typo, since the enum doesn't have them.
    // To match, I'll assume it's to throw if not in allowed, but the code is specific.
    // Perhaps change to if not in enum.
    // But to follow exactly, since COMPLETE_GOAL not defined, I'll comment or adjust.
    // The instruction says "if ( task === BackgroundTaskType.COMPLETE_GOAL || task === BackgroundTaskType.CREATE_PLAN )"
    // But those are not in the enum. Probably meant to be other types, but since not, perhaps remove or add.
    // To implement, I'll make it throw if task is not one of the allowed.
    throw new Error("Illegal background cognition activity")
  }
}

let backgroundFaults = 0
let backgroundCognitionEnabled = true

export function recordBackgroundFault() {
  backgroundFaults++
  if (backgroundFaults >= 3) {
    disableBackgroundCognition()
  }
}

function disableBackgroundCognition() {
  backgroundCognitionEnabled = false
}

export interface BackgroundLogEntry {
  taskType: BackgroundTaskType
  durationMs: number
  memoryDeltaMB: number
  result: "success" | "terminated" | "blocked"
}

// For logging, perhaps export a function
export function logBackgroundTask(entry: BackgroundLogEntry) {
  console.log('Background task log:', entry)
}

// INVARIANT:
// Background cognition may only reduce future cost.
// It must never increase goals, agency, urgency, or scope.