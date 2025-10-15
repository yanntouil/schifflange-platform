/**
 * createDedupeContext
 * This function creates a deduplication context.
 * It maintains a map of timestamps associated with keys.
 *
 * @returns A function that takes a key, a threshold, and a callback function.
 * The returned function checks if the time elapsed since the last invocation
 * with the same key exceeds the threshold. If it does, it updates the timestamp
 * and invokes the callback function.
 */
export declare const createDedupeContext: () => <K, F extends () => void>(key: K, threshold: number, fn: F) => void;
