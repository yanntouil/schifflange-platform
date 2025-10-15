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
type UsersState = {
  key: string | null
  view: Dashboard.CollectionViewType
  query: NonNullableRecord<Query.Admin.Users.List>
  columnSizing: ColumnSizingState
}
/**
 * initial state
 */
const initialFilterBy: NonNullableRecord<Query.Admin.Users.List>["filterBy"] = {
  role: undefined,
  status: "active",
}
const initialState: UsersState = {
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
export const usersStore = decorateStore(
  initialState,
  create,
  {
    persist: {
      name: "admin-users-store",
      enabled: true,
    },
    devtools: {
      name: "admin-users-store",
      enabled: globalConfig.inDevelopment,
    },
  },
  {
    // actions
    setQuery: (query) => usersStore.set((state) => ({ ...state, query })),
    setSearch: (search) => usersStore.set((state) => ({ ...state, query: { ...state.query, search, page: 1 } })),
    setPage: (page) => usersStore.set((state) => ({ ...state, query: { ...state.query, page } })),
    setLimit: (limit) => usersStore.set((state) => ({ ...state, query: { ...state.query, limit } })),
    setSortBy: (sortBy) => usersStore.set((state) => ({ ...state, query: { ...state.query, sortBy } })),
    setFilterBy: (filterBy) => usersStore.set((state) => ({ ...state, query: { ...state.query, filterBy, page: 1, search: "" } })),
    resetFilterBy: () =>
      usersStore.set((state) => ({ ...state, query: { ...state.query, filterBy: initialFilterBy, page: 1, search: "" } })),
    setView: (view) => usersStore.set((state) => ({ ...state, view })),
    setColumnSizing: (columnSizing) => usersStore.set({ columnSizing }),
  }
)
const t = usersStore.use
export const useUsersStore = makeAuthDependStore(usersStore.use, (key) => usersStore.set(() => ({ ...initialState, key })))
