import { Api, Query, service } from "@/services"
import { decorateStore } from "@/utils/zustand"
import { Dashboard } from "@compo/dashboard"
import { useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, NonNullableRecord, T } from "@compo/utils"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React from "react"
import { create } from "zustand"
import { columns } from "../logs/logs.table.columns"
import { ToolbarFilter } from "../logs/toolbar.filter"
import { ToolbarRange } from "../logs/toolbar.range"
import { useUser } from "./context"

/**
 * UserSessions
 * display the sessions of the user
 */
type Qs = NonNullableRecord<Query.Admin.Users.SecurityLogs>
export const UserLogs: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { user } = useUser()
  const { searchProps, rangeProps, filterProps, paginationProps, query } = useQuery()
  const { logs, metadata, swr } = useSecurityLogs(user.id, query)
  return (
    <Ui.Card.Root>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className="space-y-4">
        <Toolbar searchProps={searchProps} rangeProps={rangeProps} filterProps={filterProps} />
        <Dashboard.Collection>
          <Dashboard.Empty
            total={metadata.total + 1} // force to never display
            results={metadata.total}
            t={_.prefixed("empty")}
            reset={() => {
              filterProps.resetFilterBy()
              searchProps.setSearch("")
            }}
            isLoading={swr.isLoading}
          >
            <Table data={logs} />
          </Dashboard.Empty>
          <Dashboard.Pagination {...paginationProps} total={metadata.total} />
        </Dashboard.Collection>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * Toolbar
 * display the toolbar for the security logs table
 */
const Toolbar: React.FC<{
  searchProps: React.ComponentProps<typeof Dashboard.Toolbar.Search>
  rangeProps: React.ComponentProps<typeof ToolbarRange>
  filterProps: React.ComponentProps<typeof ToolbarFilter>
}> = ({ searchProps, rangeProps, filterProps }) => {
  const { _ } = useTranslation(dictionary)

  return (
    <Dashboard.Toolbar.Root size="lg">
      <Dashboard.Toolbar.Search {...searchProps} placeholder={_("search")} />
      <Dashboard.Toolbar.Aside>
        <ToolbarRange {...rangeProps} />
        <ToolbarFilter {...filterProps} />
      </Dashboard.Toolbar.Aside>
    </Dashboard.Toolbar.Root>
  )
}

/**
 * TanstackTable
 * display the table using the tanstack table
 */
const Table: React.FC<{ data: Api.Admin.SecurityLog[] }> = ({ data }) => {
  const { _ } = useTranslation(dictionary)
  const columnSizing = Dashboard.useTableColumnSizing(sessionsStore.use(D.prop("columnSizing")), sessionsStore.actions.setColumnSizing)
  const table = useReactTable<Api.Admin.SecurityLog>({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: { columnSizing: columnSizing.state },
    onColumnSizingChange: columnSizing.onChange,
    defaultColumn: Dashboard.makeColumnSize(),
    initialState: {
      columnPinning: { right: ["metadata"] },
      columnVisibility: { "created-by": false },
      columnSizing: columnSizing.initial,
    },
  })

  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => <Dashboard.Table.Row key={row.id} item={row.original.user} cells={row.getVisibleCells()} />}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * store
 */
const sessionsStore = decorateStore(
  { columnSizing: {} },
  create,
  { persist: { name: "admin-users-sessions-store", enabled: true } },
  { setColumnSizing: (columnSizing) => sessionsStore.set({ columnSizing }) }
)

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Historique des activités",
    description:
      "Consultez les événements de sécurité liés à cet utilisateur, incluant les connexions, déconnexions, et modifications sensibles.",
    search: "Rechercher dans les activités",
    "event-label": "Type d'événement",
    "ip-address-label": "Adresse IP",
    "created-at-label": "Date relative",
  },
  en: {
    title: "Activity history",
    description: "View security events related to this user, including logins, logouts, and sensitive updates.",
    search: "Search in activities",
    "event-label": "Type of event",
    "ip-address-label": "IP address",
    "created-at-label": "Related date",
  },
  de: {
    title: "Aktivitätsverlauf",
    description: "Sehen Sie Sicherheitsereignisse zu diesem Benutzer, einschließlich Anmeldungen, Abmeldungen und sensible Änderungen.",
    search: "In Aktivitäten suchen",
    "event-label": "Ereignistyp",
    "ip-address-label": "IP-Adresse",
    "created-at-label": "Bezugsdatum",
  },
}

/**
 * useSecurityLogs
 * prepare props for the security logs table, toolbar, pagination  and fetch logs data
 */
const useSecurityLogs = (id: string, query: Query.Admin.Users.SecurityLogs) => {
  const fetchData = React.useCallback(() => service.admin.users.id(id).securityLogs(query), [id, query])
  const { data, ...swr } = useSWR(
    {
      fetch: fetchData,
      key: useMemoKey("admin-users-security-logs", { id, query }),
    },
    { fallbackData }
  )

  const { logs, metadata } = data
  return { logs, metadata, swr }
}
const fallbackData = {
  metadata: service.fallbackMetadata,
  logs: [],
}

/**
 * useQuery
 * prepare props for the security logs table, toolbar, pagination  and fetch logs data
 */
const useQuery = () => {
  const [range, setRange] = React.useState<Qs["filterBy"]>(() => makeInitialRange())
  const rangeProps = { filterBy: range, setFilterBy: setRange }

  const [search, setSearch] = React.useState<string>("")
  const searchProps = React.useMemo(() => ({ search, setSearch }), [search, setSearch])

  const [filterBy, setFilterBy] = React.useState<Qs["filterBy"]>(() => initialFilterBy)
  const resetFilterBy = React.useCallback(() => setFilterBy(initialFilterBy), [setFilterBy])
  const filterProps: React.ComponentProps<typeof ToolbarFilter> = React.useMemo(
    () => ({ filterBy, setFilterBy, resetFilterBy }),
    [filterBy, setFilterBy, resetFilterBy]
  )

  const [page, setPage] = React.useState<number>(() => 1)
  const [limit, setLimit] = React.useState<number>(() => defaultLimit)

  const query: Query.Admin.Users.SecurityLogs = React.useMemo(
    () => ({
      page,
      limit: defaultLimit,
      search: search.trim() || undefined,
      sortBy: defaultSortBy,
      filterBy: {
        ...filterBy,
        dateFrom: range.dateFrom,
        dateTo: range.dateTo,
      },
    }),
    [page, search, filterBy, range]
  )

  return {
    query,
    rangeProps,
    searchProps,
    filterProps,
    paginationProps: { page, setPage, limit, setLimit },
  }
}
const defaultLimit = 10
const defaultSortBy = {
  field: "createdAt",
  direction: "desc" as const,
}
const initialFilterBy = {
  // no filter preset
}
const makeInitialRange = () => ({
  dateFrom: T.formatISO(T.startOfMonth(new Date())),
  dateTo: T.formatISO(T.endOfMonth(new Date())),
})
