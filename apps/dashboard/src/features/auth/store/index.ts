import globalConfig from "@/config/global"
import { Api } from "@/services"
import { decorateStore } from "@/utils/zustand"
import { create } from "zustand"
import { StoreApi as VanillaStoreApi } from "zustand/vanilla"
import * as actions from "./actions"

/**
 * types
 */
type AuthState = {
  me: Api.Me | null
  session: Api.UserSession | null
  isAuthenticated: boolean
  isInit: boolean
}

/**
 * initial state
 */
const initialState: AuthState = {
  me: null,
  session: null,
  isAuthenticated: false,
  isInit: false,
}

/**
 * store
 */
export const authStore = decorateStore(
  initialState,
  create,
  {
    persist: {
      name: "auth-store",
      enabled: true,
    },
    devtools: {
      name: "auth-store",
      enabled: globalConfig.inDevelopment,
    },
  },
  actions
)
export const useAuthStore = authStore.use

export type ReadonlyStoreApi<T> = Pick<VanillaStoreApi<T>, "getState" | "getInitialState" | "subscribe">
