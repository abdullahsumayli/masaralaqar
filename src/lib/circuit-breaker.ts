/**
 * Circuit Breaker — prevents repeated calls to failing Evolution instances.
 *
 * When an instance fails too many times in a short window, the circuit
 * "opens" and subsequent calls are skipped (returns true for isCircuitOpen).
 * After a cooldown period, the circuit resets to allow retry.
 *
 * This prevents hammering a disconnected instance and wasting API calls.
 */

const FAILURE_THRESHOLD = 5; // failures before circuit opens
const WINDOW_MS = 60_000; // 1 minute window for counting failures
const COOLDOWN_MS = 120_000; // 2 minutes before circuit resets

interface CircuitState {
  failures: number;
  firstFailureAt: number;
  openedAt: number | null;
}

const circuits = new Map<string, CircuitState>();

/**
 * Check if the circuit is open (i.e., instance should be skipped).
 */
export function isCircuitOpen(instanceName: string): boolean {
  const state = circuits.get(instanceName);
  if (!state) return false;

  // Circuit is open — check if cooldown has passed
  if (state.openedAt) {
    if (Date.now() - state.openedAt > COOLDOWN_MS) {
      // Reset circuit after cooldown
      circuits.delete(instanceName);
      console.log(
        `[CircuitBreaker] ${instanceName} circuit reset after cooldown`,
      );
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Record a failure for an instance. Opens the circuit if threshold is reached.
 */
export function recordFailure(instanceName: string): void {
  const now = Date.now();
  let state = circuits.get(instanceName);

  if (!state) {
    state = { failures: 0, firstFailureAt: now, openedAt: null };
    circuits.set(instanceName, state);
  }

  // Reset window if too old
  if (now - state.firstFailureAt > WINDOW_MS) {
    state.failures = 0;
    state.firstFailureAt = now;
    state.openedAt = null;
  }

  state.failures++;

  if (state.failures >= FAILURE_THRESHOLD && !state.openedAt) {
    state.openedAt = now;
    console.log(
      `[CircuitBreaker] ${instanceName} circuit OPENED after ${state.failures} failures`,
    );
  }
}

/**
 * Record a success — resets the circuit for an instance.
 */
export function recordSuccess(instanceName: string): void {
  if (circuits.has(instanceName)) {
    circuits.delete(instanceName);
    console.log(`[CircuitBreaker] ${instanceName} circuit reset on success`);
  }
}
