import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, placeholder, T } from "@compo/utils"
import { getCoreRowModel, Row, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Users } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import adminWorkspacesIdRoute from "./[workspaceId]"
import { useWorkspaces } from "./context"
import { useWorkspacesStore, workspacesStore } from "./store"
import { WorkspaceAvatar } from "./workspaces.avatar"
import { StatusIcon } from "./workspaces.icons"
import { WorkspaceMenu } from "./workspaces.menu"

type WorkspacesTableProps = {
  workspaces: Api.Admin.Workspace[]
}

/**
 * WorkspacesTable
 * display a table of workspaces with a menu and a checkbox (tanstack table)
 */
export const WorkspacesTable: React.FC<WorkspacesTableProps> = ({ workspaces }) => {
  const { _ } = useTranslation(dictionary)
  const columnSizing = Dashboard.useTableColumnSizing(useWorkspacesStore(D.prop("columnSizing")), workspacesStore.actions.setColumnSizing)
  const table = useReactTable<DataItem>({
    data: useData(workspaces),
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnSizing: columnSizing.state,
    },
    onColumnSizingChange: columnSizing.onChange,
    defaultColumn: Dashboard.makeColumnSize(),
    initialState: {
      columnPinning: {
        right: ["menu"],
      },
      columnSizing: columnSizing.initial,
    },
  })
  const { selectable } = useWorkspaces()
  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => (
        <Dashboard.Table.Row
          key={row.id}
          menu={<WorkspaceMenu workspace={row.original.workspace} />}
          item={row.original.workspace}
          selectable={selectable}
          {...smartClick(row.original.workspace, selectable)}
          cells={row.getVisibleCells()}
        />
      )}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * prepare data and data types
 */
const useData = (workspaces: Api.Admin.Workspace[]) =>
  React.useMemo(
    () =>
      A.map(workspaces, (workspace) => ({
        id: workspace.id,
        workspace,
      })),
    [workspaces]
  )
type DataItem = ReturnType<typeof useData>[number]
type ColumnProps = { row: Row<DataItem> }

/**
 * configure columns rendering
 */
const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useWorkspaces()
  return <Dashboard.Table.Checkbox item={row.original.workspace} selectable={selectable} />
}

const ColumnName: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = row.original
  const name = placeholder(workspace.name, _("name-placeholder"))
  return (
    <div className="inline-flex items-center gap-4">
      <WorkspaceAvatar workspace={workspace} />
      <Link to={adminWorkspacesIdRoute(workspace.id)} className="truncate font-medium">
        {name}
      </Link>
    </div>
  )
}

const ColumnStatus: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const status = row.original.workspace.status
  return (
    <span className="inline-flex items-center gap-2">
      <StatusIcon status={status} className="size-4" />
      {_(`status-${status}`)}
    </span>
  )
}

const ColumnType: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const type = row.original.workspace.type
  return <span className="text-sm">{_(`type-${type}`)}</span>
}

const ColumnMembers: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const membersCount = row.original.workspace.members?.length || 0
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <Users className="size-4" aria-hidden />
      {_("members", { count: membersCount })}
    </span>
  )
}

const ColumnCreated: React.FC<ColumnProps> = ({ row }) => {
  const { _, format } = useTranslation(dictionary)
  const createdAt = row.original.workspace.createdAt
  return format(T.parseISO(createdAt), "PPPp")
}

/**
 * define columns
 */
const columns: ColumnDef<DataItem>[] = [
  {
    id: "select",
    cell: ({ row }) => <ColumnSelect row={row} />,
    size: 28,
    enableResizing: false,
  },
  {
    header: "name-label",
    id: "name",
    cell: ({ row }) => <ColumnName row={row} />,
  },
  {
    header: "status-label",
    id: "status",
    cell: ({ row }) => <ColumnStatus row={row} />,
  },
  {
    header: "type-label",
    id: "type",
    cell: ({ row }) => <ColumnType row={row} />,
  },
  {
    header: "members-label",
    id: "members",
    cell: ({ row }) => <ColumnMembers row={row} />,
  },
  {
    header: "created-label",
    id: "created",
    cell: ({ row }) => <ColumnCreated row={row} />,
  },
  {
    id: "menu",
    cell: ({ row }) => <Dashboard.Table.Menu menu={<WorkspaceMenu workspace={row.original.workspace} />} />,
    size: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "name-label": "Name",
    "name-placeholder": "Unnamed workspace",
    "status-label": "Status",
    "status-active": "Active",
    "status-suspended": "Suspended",
    "status-deleted": "Deleted",
    "type-label": "Type",
    "type-lumiq": "LumiQ",
    "type-type-a": "Type A",
    "type-type-b": "Type B",
    "type-type-c": "Type C",
    "members-label": "Members",
    members: "{{count}} members",
    "created-label": "Creation date",
    "menu-label": "Menu",
  },
  fr: {
    "name-label": "Nom",
    "name-placeholder": "Espace de travail sans nom",
    "status-label": "Statut",
    "status-active": "Actif",
    "status-suspended": "Suspendu",
    "status-deleted": "Supprimé",
    "type-label": "Type",
    "type-lumiq": "LumiQ",
    "type-type-a": "Type A",
    "type-type-b": "Type B",
    "type-type-c": "Type C",
    "members-label": "Membres",
    members: "{{count}} membres",
    "created-label": "Date de création",
    "menu-label": "Menu",
  },
  de: {
    "name-label": "Name",
    "name-placeholder": "Unbenannter Arbeitsbereich",
    "status-label": "Status",
    "status-active": "Aktiv",
    "status-suspended": "Gesperrt",
    "status-deleted": "Gelöscht",
    "type-label": "Typ",
    "type-lumiq": "LumiQ",
    "type-type-a": "Typ A",
    "type-type-b": "Typ B",
    "type-type-c": "Typ C",
    "members-label": "Mitglieder",
    members: "{{count}} Mitglieder",
    "created-label": "Erstellungsdatum",
    "menu-label": "Menü",
  },
}
