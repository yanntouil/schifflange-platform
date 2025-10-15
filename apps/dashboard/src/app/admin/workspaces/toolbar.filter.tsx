import { workspaceStatuses, workspaceStatusGuard, workspaceTypeGuard, workspaceTypes } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, flow } from "@compo/utils"
import { FilterIcon, FunnelX, Layers2, ShieldIcon } from "lucide-react"
import React from "react"
import { useWorkspacesStore, workspacesStore } from "./store"

const { setFilterBy, resetFilterBy } = workspacesStore.actions

/**
 * Admin workspaces toolbar filter
 */
export const ToolbarFilter: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const filterBy = useWorkspacesStore(flow(D.prop("query"), D.prop("filterBy")))
  const { size: toolbarSize } = Dashboard.useToolbar()

  // type
  const onTypeChange = (type: string) => (checked: boolean) => {
    const typedType = workspaceTypeGuard(type) ? type : undefined
    const newType = checked ? typedType : undefined
    setFilterBy({ ...filterBy, type: newType })
  }
  const allTypes = !filterBy.type
  const selectedTypes = allTypes ? _("filter.type-all") : _(`filter.type-${filterBy.type}`)

  // status
  const onStatusChange = (status: string) => {
    const typedStatus = workspaceStatusGuard(status) ? status : "active"
    setFilterBy({ ...filterBy, status: typedStatus })
  }
  const selectedStatus = _(`filter.status-${filterBy.status}`)

  // tooltip
  const tooltip = allTypes ? _("filter.tooltip-all", { selectedStatus }) : _("filter.tooltip", { selectedTypes, selectedStatus })

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
            <Layers2 aria-hidden />
            {_("filter.type-label", { selectedTypes })}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            {workspaceTypes.map((type) => (
              <Ui.DropdownMenu.CheckboxItem key={type} checked={filterBy.type === type} onCheckedChange={onTypeChange(type)}>
                {_(`filter.type-${type}`)}
              </Ui.DropdownMenu.CheckboxItem>
            ))}
          </Ui.DropdownMenu.SubContent>
        </Ui.DropdownMenu.Sub>
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>
            <ShieldIcon aria-hidden />
            {_("filter.status-label", { selectedStatus })}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            <Ui.DropdownMenu.RadioGroup value={filterBy.status} onValueChange={onStatusChange}>
              {workspaceStatuses.map((status) => (
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
 * translations
 */
const dictionary = {
  en: {
    filter: {
      "type-label": "Types: {{selectedTypes}}",
      "type-all": "All",
      "type-schifflange-website": "Schifflange Website",
      "status-label": "Status: {{selectedStatus}}",
      "status-active": "Active workspaces",
      "status-suspended": "Suspended workspaces",
      "status-deleted": "Deleted workspaces",
      tooltip: "Displaying {{selectedStatus}} with {{selectedTypes}} types",
      "tooltip-all": "Displaying {{selectedStatus}} with all types",
      "reset-all": "Reset all filters",
    },
  },
  fr: {
    filter: {
      "type-label": "Types : {{selectedTypes}}",
      "type-all": "Tous",
      "type-schifflange-website": "Schifflange Website",
      "status-label": "Statut : {{selectedStatus}}",
      "status-active": "Espaces de travail actifs",
      "status-suspended": "Espaces de travail suspendus",
      "status-deleted": "Espaces de travail supprimés",
      tooltip: "Afficher les {{selectedStatus}} avec les types {{selectedTypes}}",
      "tooltip-all": "Afficher les {{selectedStatus}} quelque soit le type",
      "reset-all": "Réinitialiser tous les filtres",
    },
  },
  de: {
    filter: {
      "type-label": "Typen: {{selectedTypes}}",
      "type-all": "Alle",
      "type-schifflange-website": "Schifflange Website",
      "status-label": "Status: {{selectedStatus}}",
      "status-active": "Aktive Arbeitsbereiche",
      "status-suspended": "Suspendierte Arbeitsbereiche",
      "status-deleted": "Gelöschte Arbeitsbereiche",
      tooltip: "Anzeigen von {{selectedStatus}} mit {{selectedTypes}} Typen",
      "tooltip-all": "Anzeigen von {{selectedStatus}} mit allen Typen",
      "reset-all": "Alle Filter zurücksetzen",
    },
  },
}
