import { A, G } from "@mobily/ts-belt";
/**
 * oneIsNotNullable
 * Check if at least one param is not null or undefined
 */
export const oneIsNotNullable = (...params) => A.some(params, G.isNotNullable);
