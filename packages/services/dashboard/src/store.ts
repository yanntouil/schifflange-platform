import { G } from "@compo/utils"
import { create } from "zustand"
import { CreateApi } from "./api"
import { decorateStore } from "./zustand"

/**
 * actions
 */
export const actions = (api: CreateApi, store: ReturnType<typeof makeStore>) => ({
  check: async () => {
    const result = await api.get<{ isHealthy: boolean; status: "ok" | "warning" | "error" }>("health")
    if (result.ok && result.data.isHealthy && result.data.status === "ok") {
      store.set({ isReady: true, lastCheck: new Date() })
      return true
    }
    store.set({ isReady: false, lastCheck: new Date() })
    return false
  },
  secure: <T extends (...args: any[]) => Promise<{ ok: boolean; except?: unknown }>>(fn: T): T => {
    return (async (...args: Parameters<T>) => {
      const result = await fn(...args)
      if (!result.ok && G.isNullable(result.except)) {
        store.set({ isReady: false, lastCheck: new Date() })
      }
      return result
    }) as T
  },
})

/**
 * types
 */
type ApiState = {
  isReady: boolean
  lastCheck: Date
}

/**
 * initial state
 */
const initialState: ApiState = {
  isReady: true,
  lastCheck: new Date(),
}

/**
 * store
 */
export const makeStore = (api: CreateApi) => {
  const store = decorateStore(initialState, create, {
    devtools: {
      name: "services-dashboard-store",
      enabled: true,
    },
  })
  store.actions = actions(api, store)
  return store
}

export type Store = ReturnType<typeof makeStore>
export type Secure = ReturnType<typeof actions>["secure"]
