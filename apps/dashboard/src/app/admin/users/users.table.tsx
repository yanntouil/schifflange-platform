import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, placeholder, T } from "@compo/utils"
import { getCoreRowModel, Row, useReactTable, type ColumnDef } from "@tanstack/react-table"
import React from "react"
import { Link } from "wouter"
import adminUsersIdRouteTo from "./[userId]"
import { useUsers } from "./context"
import { usersStore, useUsersStore } from "./store"
import { UserAvatar } from "./users.avatar"
import { RoleIcon, StatusIcon } from "./users.icons"
import { UserMenu } from "./users.menu"

/**
 * UsersTable
 * display a table of users with a menu and a checkbox (tanstack table)
 */
export const UsersTable: React.FC<{ users: Api.Admin.User[] }> = ({ users }) => {
  const { _ } = useTranslation(dictionary)
  const columnSizing = Dashboard.useTableColumnSizing(useUsersStore(D.prop("columnSizing")), usersStore.actions.setColumnSizing)
  const table = useReactTable<DataItem>({
    data: useData(users),
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
  const { selectable } = useUsers()
  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => (
        <Dashboard.Table.Row
          key={row.id}
          menu={<UserMenu user={row.original.user} />}
          item={row.original.user}
          selectable={selectable}
          {...smartClick(row.original.user, selectable)}
          cells={row.getVisibleCells()}
        />
      )}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * prepare data and data types
 */
const useData = (users: Api.Admin.User[]) =>
  React.useMemo(
    () =>
      A.map(users, (user) => ({
        id: user.id,
        lastActivity: A.head(user.sessions ?? [])?.lastActivity,
        user,
      })),
    [users]
  )
type DataItem = ReturnType<typeof useData>[number]
type ColumnProps = { row: Row<DataItem> }

/**
 * configure columns rendering
 */
const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useUsers()
  return <Dashboard.Table.Checkbox item={row.original.user} selectable={selectable} />
}
const ColumnFullname: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { user } = row.original
  const { firstname, lastname } = user.profile
  const fullname = placeholder(`${firstname} ${lastname}`, _("fullname-placeholder"))
  return (
    <div className="inline-flex items-center gap-4">
      <UserAvatar user={user} />
      <Link to={adminUsersIdRouteTo(user.id)} className="truncate font-medium">
        {fullname}
      </Link>
    </div>
  )
}
const ColumnEmail: React.FC<ColumnProps> = ({ row }) => {
  return row.original.user.email
}
const ColumnLastActivity: React.FC<ColumnProps> = ({ row }) => {
  const { _, formatDistance } = useTranslation(dictionary)
  const lastActivity = A.head(row.original.user.sessions ?? [])?.lastActivity
  return lastActivity ? formatDistance(T.parseISO(lastActivity)) : _("last-activity-never")
}
const ColumnLanguage: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { code } = row.original.user.language
  return _(`language-${code}`)
}
const ColumnStatus: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const status = row.original.user.status
  return (
    <span className="inline-flex items-center gap-2">
      <StatusIcon status={status} className="size-4" />
      {_(`status-${status}`)}
    </span>
  )
}
const ColumnRole: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { role } = row.original.user
  return (
    <span className="inline-flex items-center gap-2">
      <RoleIcon role={role} className="size-4" />
      {_(`role-${role}`)}
    </span>
  )
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
    header: "fullname-label",
    id: "fullname",
    cell: ({ row }) => <ColumnFullname row={row} />,
  },
  {
    header: "email-label",
    id: "email",
    cell: ({ row }) => <ColumnEmail row={row} />,
  },
  {
    header: "last-activity-label",
    id: "lastActivity",
    cell: ({ row }) => <ColumnLastActivity row={row} />,
  },
  {
    header: "language-label",
    id: "language",
    cell: ({ row }) => <ColumnLanguage row={row} />,
  },
  {
    header: "status-label",
    id: "status",
    cell: ({ row }) => <ColumnStatus row={row} />,
  },
  {
    header: "role-label",
    id: "role",
    cell: ({ row }) => <ColumnRole row={row} />,
  },
  {
    header: "menu-label",
    id: "menu",
    cell: ({ row }) => <Dashboard.Table.Menu menu={<UserMenu user={row.original.user} />} />,
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
    "fullname-label": "Full name",
    "fullname-placeholder": "Unnamed user",
    "email-label": "Email",
    "last-activity-label": "Last activity",
    "last-activity": "Last activity {{date}}",
    "last-activity-never": "Never",
    "language-label": "Language",
    "language-fr": "Français",
    "language-en": "English",
    "status-label": "Status",
    "status-pending": "Pending",
    "status-active": "Active",
    "status-deleted": "Deleted",
    "status-suspended": "Suspended",
    "role-label": "Role",
    "role-member": "Member",
    "role-admin": "Admin",
    "role-superadmin": "Super admin",
  },
  fr: {
    "fullname-label": "Nom complet",
    "fullname-placeholder": "Utilisateur sans nom",
    "email-label": "Email",
    "last-activity-label": "Dernière activité",
    "last-activity-never": "Jamais",
    "language-label": "Langue",
    "language-fr": "Français",
    "language-en": "Anglais",
    "status-label": "Statut",
    "status-pending": "En attente",
    "status-active": "Actif",
    "status-deleted": "Supprimé",
    "status-suspended": "Suspendu",
    "role-label": "Rôle",
    "role-member": "Membre",
    "role-admin": "Administrateur",
    "role-superadmin": "Super administrateur",
  },
  de: {
    "fullname-label": "Vollständiger Name",
    "fullname-placeholder": "Unbenannter Benutzer",
    "email-label": "E-Mail",
    "last-activity-label": "Letzte Aktivität",
    "last-activity": "Letzte Aktivität {{date}}",
    "last-activity-never": "Niemals",
    "language-label": "Sprache",
    "language-fr": "Französisch",
    "language-en": "Englisch",
    "status-label": "Status",
    "status-pending": "Ausstehend",
    "status-active": "Aktiv",
    "status-deleted": "Gelöscht",
    "status-suspended": "Gesperrt",
    "role-label": "Rolle",
    "role-member": "Mitglied",
    "role-admin": "Administrator",
    "role-superadmin": "Super-Administrator",
  },
}
