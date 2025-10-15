import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Circle, CircleCheckBig, Filter } from "lucide-react"
import React from "react"
import { useFiltersArticles } from "../hooks"

/**
 * ArticlesFilters
 */
export const ArticlesFilters: React.FC<ReturnType<typeof useFiltersArticles>[0]> = (props) => {
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
    "tooltip-all": "Displaying all articles",
    "state-label": "State: {{selectedState}}",
    "state-all": "All articles",
    "state-draft": "Only draft articles",
    "state-published": "Only published articles",
    "state-short-all": "All articles",
    "state-short-draft": "Draft articles",
    "state-short-published": "Published articles",
    "reset-filters": "Reset filters",
  },
  fr: {
    tooltip: "Affiche les articles {{selectedState}}",
    "tooltip-all": "Affiche tous les articles",
    "state-label": "État: {{selectedState}}",
    "state-all": "Tous les articles",
    "state-draft": "Seulement les articles brouillons",
    "state-published": "Seulement les articles publiés",
    "state-short-all": "Tous les articles",
    "state-short-draft": "Articles brouillons",
    "state-short-published": "Articles publiés",
    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    tooltip: "{{selectedState}} anzeigen",
    "tooltip-all": "Alle Artikel anzeigen",
    "state-label": "Status: {{selectedState}}",
    "state-all": "Alle Artikel",
    "state-draft": "Nur Entwurfs-Artikel",
    "state-published": "Nur veröffentlichte Artikel",
    "state-short-all": "Alle Artikel",
    "state-short-draft": "Entwurfs-Artikel",
    "state-short-published": "Veröffentlichte Artikel",
    "reset-filters": "Filter zurücksetzen",
  },
}
