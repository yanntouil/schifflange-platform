import { G } from "@mobily/ts-belt";
/**
 * Throwable delayed promise
 */
const delayPresets = {
    fast: [100, 500], // slow 4G
    slow: [500, 1500], // slow 3G
    unstable: [100, 2200],
    indefinite: [120000, 120000],
};
export const delay = (options = {}) => {
    const opts = G.isNumber(options) ? { duration: 1000 } : options;
    const { duration = 1000, resolve, reject = false } = opts;
    const preset = G.isNumber(duration)
        ? [duration, duration]
        : G.isArray(duration)
            ? duration
            : delayPresets[duration];
    const ms = randomBetween(preset[0], preset[1]);
    if (opts.label) {
        console.info(`[${opts.label}] delayed: ${ms}ms`);
    }
    return new Promise((res, rej) => {
        setTimeout(() => void (reject ? rej(new Error("delay({ reject: true })")) : res(resolve)), ms);
    });
};
const randomBetween = (min, max) => {
    if (min === max)
        return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * Defer
 */
export const defer = (fn, ms = 1) => {
    setTimeout(fn, ms);
};
export const makeDeferred = (fn, ms = 1) => {
    return () => defer(fn, ms);
};
