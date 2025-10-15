import adminUsersIdRouteTo from "@/app/admin/users/[userId]"
import { UserAvatar } from "@/app/admin/users/users.avatar"
import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, placeholder, T } from "@compo/utils"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { CalendarPlus, Crown, Shield, User } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { MemberMenu } from "./members.menu"

/**
 * MembersTable
 * display a table of workspace members with actions
 */
type MembersTableProps = {
  members: Api.Admin.WorkspaceMember[]
}

export const MembersTable: React.FC<MembersTableProps> = ({ members }) => {
  const { _ } = useTranslation(dictionary)

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: { right: ["menu"] },
    },
  })

  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => (
        <Dashboard.Table.Row key={row.id} menu={<MemberMenu member={row.original} />} item={row.original} cells={row.getVisibleCells()} />
      )}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * Column helper and definitions
 */
const columns: ColumnDef<Api.Admin.WorkspaceMember>[] = [
  {
    id: "member",
    header: "member-label",
    cell: ({ row }) => <ColumnMember member={row.original} />,
    size: 400,
    minSize: 200,
    maxSize: 2400,
  },
  {
    id: "role",
    header: "role-label",
    cell: ({ row }) => <ColumnRole member={row.original} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    id: "joined",
    header: "joined-label",
    cell: ({ row }) => <ColumnJoined member={row.original} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    id: "menu",
    cell: ({ row }) => <Dashboard.Table.Menu menu={<MemberMenu member={row.original} />} />,
    size: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
]

/**
 * Column components
 */
const ColumnMember: React.FC<{ member: Api.Admin.WorkspaceMember }> = ({ member }) => {
  const { _ } = useTranslation(dictionary)
  const { firstname, lastname } = member.profile
  const fullname = placeholder(`${firstname} ${lastname}`, _("member-placeholder"))

  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={member} size="size-8" />
      <div className="space-y-1">
        <Link to={adminUsersIdRouteTo(member.id)} className={cxm("font-medium", variants.link())}>
          {fullname}
        </Link>
        <div className="text-muted-foreground text-sm">{member.email}</div>
      </div>
    </div>
  )
}

const ColumnRole: React.FC<{ member: Api.Admin.WorkspaceMember }> = ({ member }) => {
  const { _ } = useTranslation(dictionary)
  const { workspaceRole } = member

  const roleConfig = {
    owner: { icon: Crown, variant: "destructive" as const, label: _("role-owner") },
    admin: { icon: Shield, variant: "default" as const, label: _("role-admin") },
    member: { icon: User, variant: "secondary" as const, label: _("role-member") },
  }

  const config = roleConfig[workspaceRole] || roleConfig.member
  const Icon = config.icon

  return (
    <Ui.Badge variant={config.variant} className="gap-1.5">
      <Icon className="size-3" aria-hidden />
      {config.label}
    </Ui.Badge>
  )
}

const ColumnJoined: React.FC<{ member: Api.Admin.WorkspaceMember }> = ({ member }) => {
  const { format } = useTranslation(dictionary)
  const { workspaceCreatedAt } = member

  return (
    <span className="flex items-center gap-2 text-sm">
      <CalendarPlus className="text-muted-foreground size-4" aria-hidden />
      <span>{format(T.parseISO(workspaceCreatedAt), "PPP")}</span>
    </span>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "member-label": "Membre",
    "role-label": "Rôle",
    "joined-label": "Rejoint le",
    "member-placeholder": "Membre anonyme",
    "role-owner": "Propriétaire",
    "role-admin": "Administrateur",
    "role-member": "Membre",
  },
  en: {
    "member-label": "Member",
    "role-label": "Role",
    "joined-label": "Joined",
    "member-placeholder": "Anonymous member",
    "role-owner": "Owner",
    "role-admin": "Admin",
    "role-member": "Member",
  },
  de: {
    "member-label": "Mitglied",
    "role-label": "Rolle",
    "joined-label": "Beigetreten",
    "member-placeholder": "Anonymes Mitglied",
    "role-owner": "Eigentümer",
    "role-admin": "Administrator",
    "role-member": "Mitglied",
  },
}
