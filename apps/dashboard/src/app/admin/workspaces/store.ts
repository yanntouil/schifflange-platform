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
type WorkspacesState = {
  key: string | null
  query: NonNullableRecord<Query.Admin.Workspaces.List>
  view: Dashboard.CollectionViewType
  columnSizing: ColumnSizingState
}

/**
 * initial state
 */
const initialFilterBy = {
  status: "active" as const,
}

const initialState: WorkspacesState = {
  key: null,
  query: {
    search: "",
    page: 1,
    limit: 10,
    sortBy: {
      field: "createdAt",
      direction: "desc",
    },
    filterBy: initialFilterBy,
  },
  view: "row",
  columnSizing: {},
}

/**
 * store
 */
export const workspacesStore = decorateStore(
  initialState,
  create,
  {
    persist: {
      name: "admin-workspaces-store",
      enabled: true,
    },
    devtools: {
      name: "admin-workspaces-store",
      enabled: globalConfig.inDevelopment,
    },
  },
  {
    // actions
    setQuery: (query) => workspacesStore.set((state) => ({ ...state, query })),
    setSearch: (search) => workspacesStore.set((state) => ({ ...state, query: { ...state.query, search, page: 1 } })),
    setPage: (page) => workspacesStore.set((state) => ({ ...state, query: { ...state.query, page } })),
    setLimit: (limit) => workspacesStore.set((state) => ({ ...state, query: { ...state.query, limit } })),
    setSortBy: (sortBy) => workspacesStore.set((state) => ({ ...state, query: { ...state.query, sortBy } })),
    setFilterBy: (filterBy) => workspacesStore.set((state) => ({ ...state, query: { ...state.query, filterBy, page: 1, search: "" } })),
    resetFilterBy: () =>
      workspacesStore.set((state) => ({ ...state, query: { ...state.query, filterBy: initialFilterBy, page: 1, search: "" } })),
    setView: (view) => workspacesStore.set((state) => ({ ...state, view })),
    setColumnSizing: (columnSizing) => workspacesStore.set({ columnSizing }),
  }
)

const t = workspacesStore.use
export const useWorkspacesStore = makeAuthDependStore(workspacesStore.use, (key) => workspacesStore.set(() => ({ ...initialState, key })))
