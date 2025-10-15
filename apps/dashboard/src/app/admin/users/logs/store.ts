import globalConfig from "@/config/global"
import { makeAuthDependStore } from "@/features/auth"
import { Query } from "@/services"
import { decorateStore } from "@/utils/zustand"
import { D, NonNullableRecord, T } from "@compo/utils"
import { ColumnSizingState } from "@tanstack/react-table"
import { create } from "zustand"

/**
 * types
 */
type Query = NonNullableRecord<Query.Admin.Users.SecurityLogs>
type LogsState = {
  key: string | null
  query: Query
  columnSizing: ColumnSizingState
}

/**
 * initial state
 */
const initialFilterBy: Query["filterBy"] = {
  dateFrom: T.formatISO(T.startOfMonth(new Date())),
  dateTo: T.formatISO(T.endOfMonth(new Date())),
}
const initialState: LogsState = {
  key: null,
  query: {
    search: "",
    page: 1,
    limit: 50,
    sortBy: {
      field: "createdAt",
      direction: "desc",
    },
    filterBy: initialFilterBy,
  },
  columnSizing: {},
}

/**
 * store
 */
export const logsStore = decorateStore(
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
    setQuery: (query) => logsStore.set((state) => ({ ...state, query })),
    setSearch: (search) => logsStore.set((state) => ({ ...state, query: { ...state.query, search, page: 1 } })),
    setPage: (page) => logsStore.set((state) => ({ ...state, query: { ...state.query, page } })),
    setLimit: (limit) => logsStore.set((state) => ({ ...state, query: { ...state.query, limit } })),
    setSortBy: (sortBy) => logsStore.set((state) => ({ ...state, query: { ...state.query, sortBy } })),
    setFilterBy: (filterBy: Query["filterBy"]) =>
      logsStore.set((state) => ({ ...state, query: { ...state.query, filterBy, page: 1, search: "" } })),
    resetFilterBy: () =>
      logsStore.set((state) => {
        const t = {
          ...state,
          query: {
            ...state.query,
            filterBy: {
              ...D.selectKeys(state.query.filterBy, ["dateFrom", "dateTo"]),
              ...D.deleteKeys(initialFilterBy, ["dateFrom", "dateTo"]),
            },
            page: 1,
            search: "",
          },
        }
        return t
      }),
    resetRange: () =>
      logsStore.set((state) => ({
        ...state,
        query: {
          ...state.query,
          filterBy: {
            ...D.deleteKeys(state.query.filterBy, ["dateFrom", "dateTo"]),
            ...D.selectKeys(initialFilterBy, ["dateFrom", "dateTo"]),
          },
          page: 1,
          search: "",
        },
      })),
    setColumnSizing: (columnSizing) => logsStore.set({ columnSizing }),
  }
)
export const useLogsStore = makeAuthDependStore(logsStore.use, (key) => logsStore.set(() => ({ ...initialState, key })))
