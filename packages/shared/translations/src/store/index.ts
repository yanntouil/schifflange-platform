import { type Api } from "@services/dashboard"
import { create } from "zustand"
import { decorateStore } from "../zustand"

/**
 * types
 */
type LanguagesState = {
  languages: Api.Language[]
}

/**
 * initial state
 */
const initialState: LanguagesState = {
  languages: [],
}

/**
 * store
 */
export const languagesStore = decorateStore(
  initialState,
  create,
  {
    persist: {
      name: "languages-store",
      enabled: true,
    },
    devtools: {
      name: "languages-store",
      enabled: false,
    },
  },
  {
    setLanguages: (languages: Api.Language[]) => {
      languagesStore.set({ languages })
    },
  }
)
export const useLanguagesStore = languagesStore.use
