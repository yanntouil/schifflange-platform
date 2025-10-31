import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Circle, CircleCheckBig, Filter } from "lucide-react"
import React from "react"
import { useFiltersEvents } from "../hooks/use-filter-events"

/**
 * EventsFilters
 */
export const EventsFilters: React.FC<ReturnType<typeof useFiltersEvents>[0]> = (props) => {
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
    "tooltip-all": "Displaying all events",
    "state-label": "State: {{selectedState}}",
    "state-all": "All events",
    "state-draft": "Only draft events",
    "state-published": "Only published events",
    "state-short-all": "All events",
    "state-short-draft": "Draft events",
    "state-short-published": "Published events",
    "reset-filters": "Reset filters",
  },
  fr: {
    tooltip: "Affiche les événements {{selectedState}}",
    "tooltip-all": "Affiche tous les événements",
    "state-label": "État: {{selectedState}}",
    "state-all": "Tous les événements",
    "state-draft": "Seulement les événements brouillons",
    "state-published": "Seulement les événements publiés",
    "state-short-all": "Tous les événements",
    "state-short-draft": "Événements brouillons",
    "state-short-published": "Événements publiés",
    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    tooltip: "{{selectedState}} anzeigen",
    "tooltip-all": "Alle Veranstaltungen anzeigen",
    "state-label": "Status: {{selectedState}}",
    "state-all": "Alle Veranstaltungen",
    "state-draft": "Nur Entwurfs-Veranstaltungen",
    "state-published": "Nur veröffentlichte Veranstaltungen",
    "state-short-all": "Alle Veranstaltungen",
    "state-short-draft": "Entwurfs-Veranstaltungen",
    "state-short-published": "Veröffentlichte Veranstaltungen",
    "reset-filters": "Filter zurücksetzen",
  },
}
