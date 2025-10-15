import { fetch, withBase, withDeclarations, withMethods, withOptions } from "adnf"
import { withTransaction } from "./transaction"

export const createApi = (apiPath: string) => {
  // prefetch options
  const apiFetch = withOptions(withBase(fetch, apiPath), {
    credentials: "include",
    strict: true,
  })

  const api = {
    fetch: apiFetch,
    transaction: withTransaction(apiFetch),
    ...withMethods(apiFetch),
    declare: withDeclarations(apiFetch),
  }
  return api
}
export type CreateApi = ReturnType<typeof createApi>
