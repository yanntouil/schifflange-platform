import { D, G } from "@compo/utils"

/**
 * convert params to query string and append to path
 */
export const appendQS = (path: string, query: unknown) => {
  if (typeof query !== "object" || query === null) return path
  const parsedQuery = D.map(query, (row) =>
    G.isString(row) || G.isNumber(row) ? `${row}` : JSON.stringify(row)
  ) as Record<string, string>
  if (D.isEmpty(parsedQuery)) return path
  const qs = new URLSearchParams(parsedQuery).toString()
  return path + "?" + qs
}
