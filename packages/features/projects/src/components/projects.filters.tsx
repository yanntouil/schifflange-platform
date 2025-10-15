import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Circle, CircleCheckBig, Filter } from "lucide-react"
import React from "react"
import { useFiltersProjects } from "../hooks"

/**
 * ProjectsFilters
 */
export const ProjectsFilters: React.FC<ReturnType<typeof useFiltersProjects>[0]> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { isActive, toggleList, reset, unsetList } = props
  const states = ["published", "draft"]
  const hasActiveFilter = states.some((state) => isActive(state))
  const selectedState = isActive("published")
    ? _("state-short-published")
    : isActive("draft")
      ? _("state-short-draft")
      : _("state-short-all")
  const tooltip = hasActiveFilter ? _("tooltip", { selectedState }) : _("tooltip-all", { selectedState })
  return (
    <Ui.DropdownMenu.Root>
      <Ui.Tooltip.Quick asChild tooltip={tooltip} side='top' align='center'>
        <Ui.DropdownMenu.Trigger asChild>
          <Dashboard.Toolbar.Button variant='outline' icon>
            <Filter aria-hidden />
          </Dashboard.Toolbar.Button>
        </Ui.DropdownMenu.Trigger>
      </Ui.Tooltip.Quick>
      <Ui.DropdownMenu.Content align='end' side='bottom'>
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>{_("state-label", { selectedState })}</Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            <Ui.DropdownMenu.Item active={!hasActiveFilter} onClick={() => unsetList(states)}>
              {!hasActiveFilter ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
              {_("state-all")}
            </Ui.DropdownMenu.Item>
            <Ui.DropdownMenu.Separator />
            {states.map((state) => (
              <Ui.DropdownMenu.Item key={state} active={isActive(state)} onClick={() => toggleList(state, states)}>
                {isActive(state) ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
                {_(`state-${state}`)}
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
  en: {
    tooltip: "Displaying {{selectedState}}",
    "tooltip-all": "Displaying all projects",
    "state-label": "State: {{selectedState}}",
    "state-all": "All projects",
    "state-draft": "Only draft projects",
    "state-published": "Only published projects",
    "state-short-all": "All projects",
    "state-short-draft": "Draft projects",
    "state-short-published": "Published projects",
    "reset-filters": "Reset filters",
  },
  fr: {
    tooltip: "Affiche les projets {{selectedState}}",
    "tooltip-all": "Affiche tous les projets",
    "state-label": "État: {{selectedState}}",
    "state-all": "Tous les projets",
    "state-draft": "Seulement les projets brouillons",
    "state-published": "Seulement les projets publiés",
    "state-short-all": "Tous les projets",
    "state-short-draft": "Projets brouillons",
    "state-short-published": "Projets publiés",
    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    tooltip: "Zeige {{selectedState}}",
    "tooltip-all": "Zeige alle Projekte",
    "state-label": "Status: {{selectedState}}",
    "state-all": "Alle Projekte",
    "state-draft": "Nur Entwurf Projekte",
    "state-published": "Nur veröffentlichte Projekte",
    "state-short-all": "Alle Projekte",
    "state-short-draft": "Entwurf Projekte",
    "state-short-published": "Veröffentlichte Projekte",
    "reset-filters": "Filter zurücksetzen",
  },
}
