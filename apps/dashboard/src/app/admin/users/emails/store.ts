import globalConfig from "@/config/global"
import { makeAuthDependStore } from "@/features/auth"
import { Query } from "@/services"
import { decorateStore } from "@/utils/zustand"
import { D, NonNullableRecord } from "@compo/utils"
import { ColumnSizingState } from "@tanstack/react-table"
import { create } from "zustand"

/**
 * types
 */
type Query = NonNullableRecord<Query.Admin.EmailLogs.List>
type EmailsState = {
  key: string | null
  query: Query
  columnSizing: ColumnSizingState
}

/**
 * initial state
 */
const initialFilterBy: Query["filterBy"] = {
  status: null,
  email: null,
  template: null,
}
const initialState: EmailsState = {
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
export const emailsStore = decorateStore(
  initialState,
  create,
  {
    persist: {
      name: "admin-users-emails-store",
      enabled: true,
    },
    devtools: {
      name: "admin-users-emails-store",
      enabled: globalConfig.inDevelopment,
    },
  },
  {
    // actions
    setQuery: (query) => emailsStore.set((state) => ({ ...state, query })),
    setSearch: (search) => emailsStore.set((state) => ({ ...state, query: { ...state.query, search, page: 1 } })),
    setPage: (page) => emailsStore.set((state) => ({ ...state, query: { ...state.query, page } })),
    setLimit: (limit) => emailsStore.set((state) => ({ ...state, query: { ...state.query, limit } })),
    setSortBy: (sortBy) => emailsStore.set((state) => ({ ...state, query: { ...state.query, sortBy } })),
    setFilterBy: (filterBy: Query["filterBy"]) =>
      emailsStore.set((state) => ({ ...state, query: { ...state.query, filterBy, page: 1, search: "" } })),
    resetFilterBy: () =>
      emailsStore.set((state) => {
        const t = {
          ...state,
          query: {
            ...state.query,
            filterBy: {
              ...D.selectKeys(state.query.filterBy, ["status", "email", "template"]),
              ...initialFilterBy,
            },
            page: 1,
            search: "",
          },
        }
        return t
      }),
    resetRange: () =>
      emailsStore.set((state) => ({
        ...state,
        query: {
          ...state.query,
          filterBy: {
            ...D.deleteKeys(state.query.filterBy, ["status", "email", "template"]),
            ...D.selectKeys(initialFilterBy, ["status", "email", "template"]),
          },
          page: 1,
          search: "",
        },
      })),
    setColumnSizing: (columnSizing) => emailsStore.set({ columnSizing }),
  }
)
export const useEmailsStore = makeAuthDependStore(emailsStore.use, (key) => emailsStore.set(() => ({ ...initialState, key })))
