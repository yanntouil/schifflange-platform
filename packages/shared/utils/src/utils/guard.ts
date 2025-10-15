import { A, G, Option } from "@mobily/ts-belt"

/**
 * oneIsNotNullable
 * Check if at least one param is not null or undefined
 */
export const oneIsNotNullable = (...params: Option<unknown>[]) => A.some(params, G.isNotNullable)
