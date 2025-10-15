import { ImplicitAny } from "./types";
/**
 * Throwable delayed promise
 */
declare const delayPresets: {
    readonly fast: readonly [100, 500];
    readonly slow: readonly [500, 1500];
    readonly unstable: readonly [100, 2200];
    readonly indefinite: readonly [120000, 120000];
};
export declare const delay: <R>(options?: number | DelayDeclaration<R>) => Promise<R>;
export type DelayDeclaration<R = unknown> = {
    duration?: number | [number, number] | keyof typeof delayPresets;
    label?: string;
    resolve?: R;
    reject?: boolean;
};
/**
 * Defer
 */
export declare const defer: (fn: (...args: ImplicitAny[]) => ImplicitAny, ms?: number) => void;
export declare const makeDeferred: (fn: (...args: ImplicitAny[]) => ImplicitAny, ms?: number) => () => void;
export {};
