import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, placeholder, T } from "@compo/utils"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { CalendarX, Clock, Crown, Mail, Shield, User, UserCheck, UserX } from "lucide-react"
import React from "react"
import { UserDetails } from "../../users/users.details"
import { InvitationMenu } from "./invitations.menu"

/**
 * InvitationsTable
 * display a table of workspace invitations with actions
 */
type InvitationsTableProps = {
  invitations: Api.Admin.WorkspaceInvitation[]
}

export const InvitationsTable: React.FC<InvitationsTableProps> = ({ invitations }) => {
  const { _ } = useTranslation(dictionary)

  const table = useReactTable({
    data: invitations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: { right: ["menu"] },
    },
  })

  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => (
        <Dashboard.Table.Row
          key={row.id}
          menu={<InvitationMenu invitation={row.original} />}
          item={row.original}
          cells={row.getVisibleCells()}
        />
      )}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * Column helper and definitions
 */
const columns: ColumnDef<Api.Admin.WorkspaceInvitation>[] = [
  {
    id: "invitation",
    header: "invitation-label",
    cell: ({ row }) => <ColumnInvitation invitation={row.original} />,
    size: 400,
    minSize: 200,
    maxSize: 2400,
  },
  {
    id: "role",
    header: "role-label",
    cell: ({ row }) => <ColumnRole invitation={row.original} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    id: "created-by",
    header: "created-by-label",
    cell: ({ row }) => <UserDetails user={row.original.createdBy} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    id: "status",
    header: "status-label",
    cell: ({ row }) => <ColumnStatus invitation={row.original} />,
    ...Dashboard.makeColumnSize({ size: 200 }),
  },
  {
    id: "expires",
    header: "expires-label",
    cell: ({ row }) => <ColumnExpires invitation={row.original} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    id: "menu",
    cell: ({ row }) => (
      <Dashboard.Table.Menu menu={row.original.status === "pending" ? <InvitationMenu invitation={row.original} /> : null} />
    ),
    size: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
]

/**
 * Column components
 */
const ColumnInvitation: React.FC<{ invitation: Api.Admin.WorkspaceInvitation }> = ({ invitation }) => {
  const { _, formatDistance } = useTranslation(dictionary)
  const { email, createdBy, createdAt } = invitation
  const createdByName = createdBy
    ? placeholder(`${createdBy.profile.firstname} ${createdBy.profile.lastname}`, _("unknown-user"))
    : _("unknown-user")

  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
        <Mail className="size-4" aria-hidden />
      </div>
      <div className="space-y-1">
        <div className="font-medium">{email}</div>
        <div className="text-muted-foreground text-sm">{_("created-at", { date: formatDistance(T.parseISO(createdAt), new Date()) })}</div>
      </div>
    </div>
  )
}
/**
 * Column components
 */
const ColumnRole: React.FC<{ invitation: Api.Admin.WorkspaceInvitation }> = ({ invitation }) => {
  const { _ } = useTranslation(dictionary)
  const { role } = invitation

  const roleConfig = {
    owner: { icon: Crown, variant: "destructive" as const, label: _("role-owner") },
    admin: { icon: Shield, variant: "default" as const, label: _("role-admin") },
    member: { icon: User, variant: "secondary" as const, label: _("role-member") },
  }

  const config = roleConfig[role] || roleConfig.member
  const Icon = config.icon

  return (
    <Ui.Badge variant={config.variant} className="gap-1.5">
      <Icon className="size-3" aria-hidden />
      {config.label}
    </Ui.Badge>
  )
}

const ColumnStatus: React.FC<{ invitation: Api.Admin.WorkspaceInvitation }> = ({ invitation }) => {
  const { _ } = useTranslation(dictionary)
  const { status } = invitation

  const statusConfig = {
    pending: { icon: Clock, variant: "secondary" as const, label: _("status-pending") },
    accepted: { icon: UserCheck, variant: "default" as const, label: _("status-accepted") },
    refused: { icon: UserX, variant: "destructive" as const, label: _("status-refused") },
    deleted: { icon: UserX, variant: "outline" as const, label: _("status-deleted") },
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <Ui.Badge variant={config.variant} className="gap-1.5">
      <Icon className="size-3" aria-hidden />
      {config.label}
    </Ui.Badge>
  )
}

const ColumnExpires: React.FC<{ invitation: Api.Admin.WorkspaceInvitation }> = ({ invitation }) => {
  const { _, format } = useTranslation(dictionary)
  const { expiresAt } = invitation

  const expiresDate = T.parseISO(expiresAt)
  const isExpired = T.isBefore(expiresDate, new Date())

  return (
    <span className={cxm("flex items-center gap-2 text-sm", isExpired && "text-destructive")}>
      <CalendarX className="size-4" aria-hidden />
      <span>{format(expiresDate, "PPP")}</span>
      {isExpired && <span className="text-xs">({_("expired")})</span>}
    </span>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "invitation-label": "Invitation",
    "role-label": "Rôle",
    "created-at": "Invité {{date}}",
    "status-label": "Statut",
    "expires-label": "Expire le",
    "invited-by": "Invité par {{name}}",
    "unknown-user": "Utilisateur inconnu",
    "role-owner": "Propriétaire",
    "role-admin": "Administrateur",
    "role-member": "Membre",
    "status-pending": "En attente",
    "status-accepted": "Acceptée",
    "status-refused": "Refusée",
    "status-deleted": "Supprimée",
    expired: "Expirée",
  },
  en: {
    "invitation-label": "Invitation",
    "role-label": "Role",
    "created-at": "Invited {{date}}",
    "status-label": "Status",
    "expires-label": "Expires",
    "invited-by": "Invited by {{name}}",
    "unknown-user": "Unknown user",
    "role-owner": "Owner",
    "role-admin": "Admin",
    "role-member": "Member",
    "status-pending": "Pending",
    "status-accepted": "Accepted",
    "status-refused": "Refused",
    "status-deleted": "Deleted",
    expired: "Expired",
  },
  de: {
    "invitation-label": "Einladung",
    "role-label": "Rolle",
    "created-at": "Eingeladen {{date}}",
    "status-label": "Status",
    "expires-label": "Läuft ab",
    "invited-by": "Eingeladen von {{name}}",
    "unknown-user": "Unbekannter Benutzer",
    "role-owner": "Eigentümer",
    "role-admin": "Administrator",
    "role-member": "Mitglied",
    "status-pending": "Ausstehend",
    "status-accepted": "Angenommen",
    "status-refused": "Abgelehnt",
    "status-deleted": "Gelöscht",
    expired: "Abgelaufen",
  },
}
