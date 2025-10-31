import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Circle, CircleCheckBig, Filter } from "lucide-react"
import React from "react"
import { useFilters } from "../hooks"

/**
 * PagesFilters
 */
export const PagesFilters: React.FC<ReturnType<typeof useFilters>[0]> = (props) => {
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
    "tooltip-all": "Displaying all pages",
    "state-label": "State: {{selectedState}}",
    "state-all": "All pages",
    "state-draft": "Only draft pages",
    "state-published": "Only published pages",
    "state-short-all": "All pages",
    "state-short-draft": "Draft pages",
    "state-short-published": "Published pages",
    "reset-filters": "Reset filters",
  },
  fr: {
    tooltip: "Affiche les pages {{selectedState}}",
    "tooltip-all": "Affiche toutes les pages",
    "state-label": "État: {{selectedState}}",
    "state-all": "Toutes les pages",
    "state-draft": "Seulement les pages brouillons",
    "state-published": "Seulement les pages publiées",
    "state-short-all": "Toutes les pages",
    "state-short-draft": "Pages brouillons",
    "state-short-published": "Pages publiées",
    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    tooltip: "Zeigt {{selectedState}} an",
    "tooltip-all": "Zeigt alle Seiten an",
    "state-label": "Status: {{selectedState}}",
    "state-all": "Alle Seiten",
    "state-draft": "Nur Entwurfsseiten",
    "state-published": "Nur veröffentlichte Seiten",
    "state-short-all": "Alle Seiten",
    "state-short-draft": "Entwurfsseiten",
    "state-short-published": "Veröffentlichte Seiten",
    "reset-filters": "Filter zurücksetzen",
  },
}
