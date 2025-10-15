import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useFilterable, useMatchable, useSortable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, pipe, S } from "@compo/utils"
import { Circle, CircleCheckBig, Filter, Mail } from "lucide-react"
import React from "react"
import { useWorkspace } from "./context"
import { InvitationAdd } from "./invitations.add"
import { InvitationsTable } from "./invitations.table"

/**
 * WorkspaceInvitations
 * display and manage invitations of the workspace
 */
export const WorkspaceInvitations: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace, swr } = useWorkspace()

  const { invitations } = workspace

  const [filterable, filterBy, activeStatus] = useFilters()
  const [matchable, matchIn] = useMatchable<Api.Admin.WorkspaceInvitation>(`admin-workspace-invitations-search`, ["email"])
  const [, sortBy] = useSortable<Api.Admin.WorkspaceInvitation>(
    `admin-workspace-invitations-sort`,
    { createdAt: [({ createdAt }) => createdAt, "desc", "number"] },
    "createdAt"
  )
  // Filter, search and sort invitations
  const filteredInvitations = React.useMemo(() => {
    return pipe(invitations, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn)
  }, [invitations, matchable.search, sortBy, matchIn, filterBy])

  const totalInvitations = filteredInvitations.length
  const allInvitations = invitations.length

  const [addInvitation, addInvitationProps] = Ui.useQuickDialog<Api.Admin.Workspace, Api.Admin.WorkspaceInvitation>({
    mutate: async (invitation) => {
      swr.appendInvitation(invitation)
    },
  })

  // Reset function
  const resetFilters = () => {
    filterable.reset()
    matchable.setSearch("")
  }
  const description = totalInvitations === 0 ? "description-empty" : "description"
  return (
    <Ui.Card.Root>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>
          {_(description, {
            count: totalInvitations,
            total: allInvitations,
            status: activeStatus ? _(`status-${activeStatus}`) : "",
          })}
        </Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className="space-y-4">
        <Dashboard.Toolbar.Root>
          <Dashboard.Toolbar.Search {...matchable} placeholder={_("search-placeholder")} />
          <Dashboard.Toolbar.Aside>
            <Filters {...filterable} />
            <Dashboard.Toolbar.Button onClick={() => addInvitation(workspace)}>
              <Mail aria-hidden />
              {_("add-invitation")}
            </Dashboard.Toolbar.Button>
          </Dashboard.Toolbar.Aside>
        </Dashboard.Toolbar.Root>

        <Dashboard.Collection>
          <Dashboard.Empty total={allInvitations} results={totalInvitations} t={_.prefixed("empty")} reset={resetFilters} isLoading={false}>
            <InvitationsTable invitations={filteredInvitations} />
          </Dashboard.Empty>
        </Dashboard.Collection>
      </Ui.Card.Content>

      <InvitationAdd {...addInvitationProps} />
    </Ui.Card.Root>
  )
}

const useFilters = () => {
  const [filterable, filterBy] = useFilterable<Api.Admin.WorkspaceInvitation>(
    `admin-workspace-invitations-filters`,
    {
      pending: ({ status }) => status === "pending",
      accepted: ({ status }) => status === "accepted",
      refused: ({ status }) => status === "refused",
      deleted: ({ status }) => status === "deleted",
    },
    {
      pending: true,
    }
  )
  const activeStatus = A.find(D.toPairs(filterable.filters), ([_, value]) => value === true)?.[0]
  return [filterable, filterBy, activeStatus] as const
}

const Filters: React.FC<ReturnType<typeof useFilters>[0]> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { isActive, toggleList, reset } = props
  const statuses = ["pending", "accepted", "refused", "deleted"]
  const hasActiveFilter = statuses.some((status) => isActive(status))

  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button variant="outline" icon>
          <Filter aria-hidden />
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content>
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>{_("filter-status")}</Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            <Ui.DropdownMenu.Item active={!hasActiveFilter} onClick={reset}>
              {!hasActiveFilter ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
              {_("all-statuses")}
            </Ui.DropdownMenu.Item>
            <Ui.DropdownMenu.Separator />
            {statuses.map((status) => (
              <Ui.DropdownMenu.Item key={status} active={isActive(status)} onClick={() => toggleList(status, statuses)}>
                {isActive(status) ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
                {_(`status-${status}`)}
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
    title: "Invitations de l'espace de travail",
    description: "{{count}} invitations {{status}} sur {{total}} au total",
    "description-empty": "Aucune invitation {{status}} sur {{total}} au total",
    "add-invitation": "Envoyer une invitation",
    "search-placeholder": "Rechercher par email...",
    "filter-status": "Statut",
    "all-statuses": "tous statuts",
    "status-pending": "en attente",
    "status-accepted": "acceptées",
    "status-refused": "refusées",
    "status-deleted": "supprimées",
    "reset-filters": "Réinitialiser les filtres",
    empty: {
      "no-item-title": "Aucune invitation trouvée",
      "no-item-content-create": "Cet espace de travail n'a pas encore d'invitations",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content-reset": "Aucune invitation ne correspond à vos critères",
    },
  },
  en: {
    title: "Workspace invitations",
    description: "{{count}} {{status}} invitations out of {{total}} total",
    "description-empty": "No {{status}} invitations out of {{total}} total",
    "add-invitation": "Send invitation",
    "search-placeholder": "Search by email...",
    "filter-status": "Status",
    "all-statuses": "all statuses",
    "status-pending": "pending",
    "status-accepted": "accepted",
    "status-refused": "refused",
    "status-deleted": "deleted",
    "reset-filters": "Reset filters",
    empty: {
      "no-item-title": "No invitations found",
      "no-item-content-create": "This workspace doesn't have any invitations yet",
      "no-result-title": "No result found",
      "no-result-content-reset": "No invitations match your criteria",
    },
  },
  de: {
    title: "Arbeitsbereich-Einladungen",
    description: "{{count}} {{status}} Einladungen von {{total}} insgesamt",
    "description-empty": "Keine {{status}} Einladungen von {{total}} insgesamt",
    "add-invitation": "Einladung senden",
    "search-placeholder": "Nach E-Mail suchen...",
    "filter-status": "Status",
    "all-statuses": "alle Status",
    "status-pending": "ausstehend",
    "status-accepted": "akzeptiert",
    "status-refused": "abgelehnt",
    "status-deleted": "gelöscht",
    "reset-filters": "Filter zurücksetzen",
    empty: {
      "no-item-title": "Keine Einladungen gefunden",
      "no-item-content-create": "Dieser Arbeitsbereich hat noch keine Einladungen",
      "no-result-title": "Keine Ergebnisse gefunden",
      "no-result-content-reset": "Keine Einladungen entsprechen Ihren Kriterien",
    },
  },
}
