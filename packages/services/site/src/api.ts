import { withBase, withDeclarations, withMethods, withOptions } from "adnf"

export const createApi = (fetch: Parameters<typeof withBase>[0], apiPath: string) => {
  // prefetch options
  const apiFetch = withOptions(withBase(fetch, apiPath), {
    credentials: "include",
    strict: true,
    // @ts-expect-error - next is not a valid option for fetch
    next: { revalidate: 60 }, // ✅ ISR
  })

  const api = {
    fetch: apiFetch,
    ...withMethods(apiFetch),
    declare: withDeclarations(apiFetch),
  }
  return api
}
export type Api = ReturnType<typeof createApi>
