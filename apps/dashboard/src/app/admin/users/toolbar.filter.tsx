import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, F, flow, pipe } from "@compo/utils"
import { FilterIcon, FunnelX, ShieldIcon, User2Icon } from "lucide-react"
import React from "react"
import { usersStore, useUsersStore } from "./store"

const { setFilterBy, resetFilterBy } = usersStore.actions

/**
 * Admin users toolbar sort
 */
export const ToolbarFilter: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const filterBy = useUsersStore(flow(D.prop("query"), D.prop("filterBy")))
  const { size: toolbarSize } = Dashboard.useToolbar()
  // role
  const onRoleChange = (role: string) => (checked: boolean) => {
    const typedRole = roleGuard(role) ? role : undefined
    const newRole = pipe(
      filterBy.role ?? [],
      A.filter((role) => role !== typedRole),
      checked ? A.append(role) : F.identity
    )
    setFilterBy({ ...filterBy, role: A.isNotEmpty(newRole) ? newRole : undefined })
  }
  const allRoles = A.isEmpty(filterBy.role ?? []) || filterBy.role?.length === roles.length
  const selectedRoles = allRoles ? _("filter.role-all") : A.map(filterBy.role ?? [], (role) => _(`filter.role-${role}`)).join(", ")

  // status
  const onStatusChange = (status: string) => {
    const typedStatus = statusGuard(status) ? status : "active"
    setFilterBy({ ...filterBy, status: typedStatus })
  }
  const selectedStatus = _(`filter.status-${filterBy.status}`)

  // tooltip
  const tooltip = allRoles ? _("filter.tooltip-all", { selectedStatus }) : _("filter.tooltip", { selectedRoles, selectedStatus })

  return (
    <Ui.DropdownMenu.Root>
      <Ui.Tooltip.Quick asChild tooltip={tooltip} side="top" align="center">
        <Ui.DropdownMenu.Trigger asChild>
          <Ui.Button variant="outline" icon size={toolbarSize}>
            <FilterIcon />
          </Ui.Button>
        </Ui.DropdownMenu.Trigger>
      </Ui.Tooltip.Quick>
      <Ui.DropdownMenu.Content side="left" align="start">
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>
            <ShieldIcon aria-hidden />
            {_("filter.role-label", { selectedRoles })}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            {roles.map((role) => (
              <Ui.DropdownMenu.CheckboxItem key={role} checked={A.includes(filterBy.role ?? [], role)} onCheckedChange={onRoleChange(role)}>
                {_(`filter.role-${role}`)}
              </Ui.DropdownMenu.CheckboxItem>
            ))}
          </Ui.DropdownMenu.SubContent>
        </Ui.DropdownMenu.Sub>
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>
            <User2Icon aria-hidden />
            {_("filter.status-label", { selectedStatus })}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            <Ui.DropdownMenu.RadioGroup value={filterBy.status} onValueChange={onStatusChange}>
              {statuses.map((status) => (
                <Ui.DropdownMenu.RadioItem key={status} value={status}>
                  {_(`filter.status-${status}`)}
                </Ui.DropdownMenu.RadioItem>
              ))}
            </Ui.DropdownMenu.RadioGroup>
          </Ui.DropdownMenu.SubContent>
        </Ui.DropdownMenu.Sub>
        <Ui.DropdownMenu.Separator />
        <Ui.DropdownMenu.Item onClick={resetFilterBy}>
          <FunnelX />
          {_("filter.reset-all")}
        </Ui.DropdownMenu.Item>
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * constants and guards
 */
const roles: string[] = ["superadmin", "admin", "member"] satisfies Api.UserRole[]
const statuses: string[] = ["pending", "active", "deleted", "suspended"] satisfies Api.UserStatus[]
const roleGuard = (role: string): role is Api.UserRole => roles.includes(role)
const statusGuard = (status: string): status is Api.UserStatus => statuses.includes(status)

/**
 * translations
 */
const dictionary = {
  en: {
    filter: {
      "role-label": "Roles: {{selectedRoles}}",
      "role-all": "All",
      "role-superadmin": "Super admin",
      "role-admin": "Admin",
      "role-member": "Member",
      "status-label": "Status: {{selectedStatus}}",
      "status-pending": "Pending account (not verified)",
      "status-active": "Active account (verified)",
      "status-deleted": "Deleted account",
      "status-suspended": "Suspended account",
      tooltip: "Displaying {{selectedStatus}} with {{selectedRoles}} roles",
      "tooltip-all": "Displaying {{selectedStatus}} with all roles",
      "reset-all": "Reset all filters",
    },
  },
  fr: {
    filter: {
      "role-label": "Rôles : {{selectedRoles}}",
      "role-all": "Tous",
      "role-superadmin": "Super Admin",
      "role-admin": "Admin",
      "role-member": "Membre",
      "status-label": "Statut : {{selectedStatus}}",
      "status-pending": "Comptes en attente (non vérifiés)",
      "status-active": "Comptes actifs (vérifiés)",
      "status-deleted": "Comptes supprimés",
      "status-suspended": "Comptes suspendus",
      tooltip: "Afficher les {{selectedStatus}} avec les rôles {{selectedRoles}}",
      "tooltip-all": "Afficher les {{selectedStatus}} quelque soit le rôle",
      "reset-all": "Réinitialiser tous les filtres",
    },
  },
  de: {
    filter: {
      "role-label": "Rollen: {{selectedRoles}}",
      "role-all": "Alle",
      "role-superadmin": "Super Admin",
      "role-admin": "Admin",
      "role-member": "Mitglied",
      "status-label": "Status: {{selectedStatus}}",
      "status-pending": "Konten in Wartestellung (nicht verifiziert)",
      "status-active": "Aktive Konten (verifiziert)",
      "status-deleted": "Gelöschte Konten",
      "status-suspended": "Suspendierte Konten",
      tooltip: "Anzeigen von {{selectedStatus}} mit {{selectedRoles}} Rollen",
      "tooltip-all": "Anzeigen von {{selectedStatus}} mit allen Rollen",
      "reset-all": "Alle Filter zurücksetzen",
    },
  },
}
