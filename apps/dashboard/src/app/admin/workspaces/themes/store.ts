import globalConfig from "@/config/global"
import { makeAuthDependStore } from "@/features/auth"
import { Query } from "@/services"
import { decorateStore } from "@/utils/zustand"
import { Dashboard } from "@compo/dashboard"
import { NonNullableRecord } from "@compo/utils"
import { ColumnSizingState } from "@tanstack/react-table"
import { create } from "zustand"

/**
 * types
 */
type ThemesState = {
  key: string | null
  query: NonNullableRecord<Query.Admin.Workspaces.ThemesList>
  view: Dashboard.CollectionViewType
  columnSizing: ColumnSizingState
}

/**
 * initial state
 */
const initialState: ThemesState = {
  key: null,
  query: {
    search: "",
    page: 1,
    limit: 10,
    sortBy: {
      field: "name",
      direction: "asc",
    },
    filterBy: {},
  },
  view: "row",
  columnSizing: {},
}

/**
 * store
 */
export const themesStore = decorateStore(
  initialState,
  create,
  {
    persist: {
      name: "admin-themes-store",
      enabled: true,
    },
    devtools: {
      name: "admin-themes-store",
      enabled: globalConfig.inDevelopment,
    },
  },
  {
    // actions
    setQuery: (query) => themesStore.set((state) => ({ ...state, query })),
    setSearch: (search) => themesStore.set((state) => ({ ...state, query: { ...state.query, search, page: 1 } })),
    setPage: (page) => themesStore.set((state) => ({ ...state, query: { ...state.query, page } })),
    setLimit: (limit) => themesStore.set((state) => ({ ...state, query: { ...state.query, limit } })),
    setSortBy: (sortBy) => themesStore.set((state) => ({ ...state, query: { ...state.query, sortBy } })),
    setFilterBy: (filterBy) => themesStore.set((state) => ({ ...state, query: { ...state.query, filterBy, page: 1, search: "" } })),
    resetFilterBy: () => themesStore.set((state) => ({ ...state, query: { ...state.query, filterBy: {}, page: 1, search: "" } })),
    setView: (view) => themesStore.set((state) => ({ ...state, view })),
    setColumnSizing: (columnSizing) => themesStore.set({ columnSizing }),
  }
)

export const useThemesStore = makeAuthDependStore(themesStore.use, (key) => themesStore.set(() => ({ ...initialState, key })))

export const setSearch = themesStore.actions.setSearch
