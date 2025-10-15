/**
 * byLanguage
 */
export const byLanguage = <L extends { languageId: string }, R = void>(
  items: L[],
  localize?: (item: L) => R
): { [key: string]: R extends void ? L : R } => {
  return items.reduce((acc, item) => {
    return { ...acc, [item.languageId]: localize ? localize(item) : item }
  }, {})
}
