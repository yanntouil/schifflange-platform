/**
 * Nullable assertions
 * runtime typescript non-nullable assertion
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html
 */
export declare const assert: <V>(value: V, error?: Error | string) => NonNullable<V>;
export declare const assertNonNullable: <V>(value: V) => NonNullable<V>;
export declare const assertAwaited: <V>(data: Promise<V>) => Promise<NonNullable<Awaited<V>>>;
/**
 * Internal nullable guard
 */
export declare const isNullable: <V>(value: V) => value is NonNullable<V>;
