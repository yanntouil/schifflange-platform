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
type QueryType = NonNullableRecord<Query.Workspaces.Logs>
type LogsState = {
  key: string | null
  query: QueryType
  columnSizing: ColumnSizingState
}

/**
 * initial state
 */
const initialFilterBy: QueryType["filterBy"] = {
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
      name: "admin-workspaces-logs-store",
      enabled: true,
    },
    devtools: {
      name: "admin-workspaces-logs-store",
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
    setFilterBy: (filterBy: QueryType["filterBy"]) =>
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
