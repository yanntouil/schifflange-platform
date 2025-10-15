/**
 * Delays the execution of a function for a given number of milliseconds
 * @param ms - The number of milliseconds to delay
 * @returns A promise that resolves after the delay
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
