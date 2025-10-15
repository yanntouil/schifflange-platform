import { D, Option } from "@mobily/ts-belt"

/**
 * MatchableSize
 * size that can be matched (used inside most components)
 */
export type MatchableSize = "lg" | "default" | "sm" | "xs" | "xxs"

/**
 * matchSize
 * match a size to a value
 */
export const matchSize = <T extends string = MatchableSize>(size: Option<T>, values: Partial<Record<T, string>>) => {
  const sizeValue = size ?? ("default" as T)
  return D.get(values, sizeValue) ?? ""
}
