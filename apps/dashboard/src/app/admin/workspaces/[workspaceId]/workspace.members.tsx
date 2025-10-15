import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useFilterable, useMatchable, useSortable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, pipe, S } from "@compo/utils"
import { Circle, CircleCheckBig, Filter, UserPlus } from "lucide-react"
import React from "react"
import { useWorkspace } from "./context"
import { MemberAdd } from "./members.add"
import { MembersTable } from "./members.table"

/**
 * WorkspaceMembers
 * display and manage members of the workspace
 */
export const WorkspaceMembers: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace, swr } = useWorkspace()

  const { members } = workspace

  const [filterable, filterBy, activeRole] = useFilters()
  const [matchable, matchIn] = useMatchable<Api.Admin.WorkspaceMember>(`admin-workspace-members-search`, [
    "email",
    "profile.firstname",
    "profile.lastname",
  ])
  const [, sortBy] = useSortable<Api.Admin.WorkspaceMember>(
    `admin-workspace-members-sort`,
    {
      workspaceCreatedAt: [({ workspaceCreatedAt }) => workspaceCreatedAt, "desc", "number"],
      name: [({ profile }) => `${profile.firstname} ${profile.lastname}`, "asc", "alphabet"],
    },
    "workspaceCreatedAt"
  )

  // Filter, search and sort members
  const filteredMembers = React.useMemo(() => {
    return pipe(members, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn)
  }, [members, matchable.search, sortBy, matchIn, filterBy])

  const totalMembers = filteredMembers.length
  const allMembers = members.length

  const [addMember, addMemberProps] = Ui.useQuickDialog<Api.Admin.Workspace, Api.Admin.WorkspaceMember>({
    mutate: async (member) => {
      swr.appendMember(member)
    },
  })

  // Reset function
  const resetFilters = () => {
    filterable.reset()
    matchable.setSearch("")
  }
  const description = totalMembers === 0 ? _("description-empty") : "description"
  return (
    <Ui.Card.Root>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>
          {_(description, {
            count: totalMembers,
            total: allMembers,
            role: activeRole ? _(`role-${activeRole}`) : "",
          })}
        </Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className="space-y-4">
        <Dashboard.Toolbar.Root>
          <Dashboard.Toolbar.Search {...matchable} placeholder={_("search-placeholder")} />
          <Dashboard.Toolbar.Aside>
            <Filters {...filterable} />
            <Dashboard.Toolbar.Button onClick={() => addMember(workspace)}>
              <UserPlus aria-hidden />
              {_("add-member")}
            </Dashboard.Toolbar.Button>
          </Dashboard.Toolbar.Aside>
        </Dashboard.Toolbar.Root>

        <Dashboard.Collection>
          <Dashboard.Empty total={allMembers} results={totalMembers} t={_.prefixed("empty")} reset={resetFilters} isLoading={false}>
            <MembersTable members={filteredMembers} />
          </Dashboard.Empty>
        </Dashboard.Collection>
      </Ui.Card.Content>

      <MemberAdd {...addMemberProps} />
    </Ui.Card.Root>
  )
}

const useFilters = () => {
  const [filterable, filterBy] = useFilterable<Api.Admin.WorkspaceMember>(
    `admin-workspace-members-filters`,
    {
      owner: ({ workspaceRole }) => workspaceRole === "owner",
      admin: ({ workspaceRole }) => workspaceRole === "admin",
      member: ({ workspaceRole }) => workspaceRole === "member",
    },
    {}
  )
  const activeRole = A.find(D.toPairs(filterable.filters), ([_, value]) => value === true)?.[0]
  return [filterable, filterBy, activeRole] as const
}

const Filters: React.FC<ReturnType<typeof useFilters>[0]> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { isActive, toggleList, reset } = props
  const roles = ["owner", "admin", "member"]
  const hasActiveFilter = roles.some((role) => isActive(role))

  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button variant="outline" icon>
          <Filter aria-hidden />
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content>
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>{_("filter-role")}</Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            <Ui.DropdownMenu.Item active={!hasActiveFilter} onClick={reset}>
              {!hasActiveFilter ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
              {_("all-roles")}
            </Ui.DropdownMenu.Item>
            <Ui.DropdownMenu.Separator />
            {roles.map((role) => (
              <Ui.DropdownMenu.Item key={role} active={isActive(role)} onClick={() => toggleList(role, roles)}>
                {isActive(role) ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
                {_(`role-${role}`)}
              </Ui.DropdownMenu.Item>
            ))}
          </Ui.DropdownMenu.SubContent>
        </Ui.DropdownMenu.Sub>
        <Ui.DropdownMenu.Separator />
        <Ui.DropdownMenu.Item onClick={reset}>{_("reset-filters")}</Ui.DropdownMenu.Item>
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Membres de l'espace de travail",
    description: "{{count}} membres {{role}} sur {{total}} au total",
    "description-empty": "Aucun membre {{role}} sur {{total}} au total",
    "add-member": "Ajouter un membre",
    "search-placeholder": "Rechercher par nom ou email...",
    "filter-role": "Rôle",
    "all-roles": "tous rôles",
    "role-owner": "propriétaires",
    "role-admin": "administrateurs",
    "role-member": "membres",
    "reset-filters": "Réinitialiser les filtres",
    empty: {
      "no-item-title": "Aucun membre trouvé",
      "no-item-content-create": "Cet espace de travail n'a pas encore de membres",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content-reset": "Aucun membre ne correspond à vos critères",
    },
  },
  en: {
    title: "Workspace members",
    description: "{{count}} {{role}} members out of {{total}} total",
    "description-empty": "No {{role}} members out of {{total}} total",
    "add-member": "Add member",
    "search-placeholder": "Search by name or email...",
    "filter-role": "Role",
    "all-roles": "all roles",
    "role-owner": "owners",
    "role-admin": "admins",
    "role-member": "members",
    "reset-filters": "Reset filters",
    empty: {
      "no-item-title": "No members found",
      "no-item-content-create": "This workspace doesn't have any members yet",
      "no-result-title": "No result found",
      "no-result-content-reset": "No members match your criteria",
    },
  },
  de: {
    title: "Arbeitsbereich-Mitglieder",
    description: "{{count}} {{role}} Mitglieder von {{total}} insgesamt",
    "description-empty": "Keine {{role}} Mitglieder von {{total}} insgesamt",
    "add-member": "Mitglied hinzufügen",
    "search-placeholder": "Nach Name oder E-Mail suchen...",
    "filter-role": "Rolle",
    "all-roles": "alle Rollen",
    "role-owner": "Eigentümer",
    "role-admin": "Administratoren",
    "role-member": "Mitglieder",
    "reset-filters": "Filter zurücksetzen",
    empty: {
      "no-item-title": "Keine Mitglieder gefunden",
      "no-item-content-create": "Dieser Arbeitsbereich hat noch keine Mitglieder",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content-reset": "Keine Mitglieder entsprechen Ihren Kriterien",
    },
  },
}
