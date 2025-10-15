import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Circle, CircleCheckBig, Filter } from "lucide-react"
import React from "react"
import { useSitemapFilters } from "./sitemap.hooks"

/**
 * Filters component
 */
export const SitemapFilters: React.FC<ReturnType<typeof useSitemapFilters>[0]> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { isActive, toggleList, reset, unsetList } = props

  // manage states
  const states = ["published", "draft"]
  const hasActiveFilter = states.some((state) => isActive(state))
  const selectedState = isActive("published")
    ? _("state-short-published")
    : isActive("draft")
      ? _("state-short-draft")
      : _("state-short-all")
  const tooltip = hasActiveFilter ? _("tooltip", { selectedState }) : _("tooltip-all", { selectedState })

  // manage models
  const models = ["page", "article"]
  const hasActiveFilterModel = models.some((model) => isActive(model))
  const selectedModel = isActive("page")
    ? _("model-short-page")
    : isActive("article")
      ? _("model-short-article")
      : _("model-short-all")

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
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>{_("model-label", { selectedModel })}</Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            <Ui.DropdownMenu.Item active={!hasActiveFilterModel} onClick={() => unsetList(models)}>
              {!hasActiveFilterModel ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
              {_("model-all")}
            </Ui.DropdownMenu.Item>
            <Ui.DropdownMenu.Separator />
            {models.map((model) => (
              <Ui.DropdownMenu.Item key={model} active={isActive(model)} onClick={() => toggleList(model, models)}>
                {isActive(model) ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
                {_(`model-${model}`)}
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
    tooltip: "Affiche les ressources {{selectedState}}",
    "tooltip-all": "Affiche toutes les ressources",

    "state-label": "État: {{selectedState}}",
    "state-all": "Toutes les ressources",
    "state-draft": "Seulement les ressources brouillons",
    "state-published": "Seulement les ressources publiées",
    "state-short-all": "Toutes les ressources",
    "state-short-draft": "Ressources brouillons",
    "state-short-published": "Ressources publiées",

    "model-label": "Type: {{selectedModel}}",
    "model-all": "Tous les types",
    "model-page": "Seulement les pages",
    "model-article": "Seulement les articles",
    "model-short-all": "Tous les types",
    "model-short-page": "Pages",
    "model-short-article": "Articles",

    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    tooltip: "Zeigt {{selectedState}} an",
    "tooltip-all": "Zeigt alle Seiten an",

    "state-label": "Status: {{selectedState}}",
    "state-all": "Alle Seiten",
    "state-draft": "Nur Entwurf-Seiten",
    "state-published": "Nur veröffentlichte Seiten",
    "state-short-all": "Alle Seiten",
    "state-short-draft": "Entwurf-Seiten",
    "state-short-published": "Veröffentlichte Seiten",

    "model-label": "Typ: {{selectedModel}}",
    "model-all": "Alle Typen",
    "model-page": "Nur Seiten",
    "model-article": "Nur Artikel",
    "model-short-all": "Alle Typen",
    "model-short-page": "Seiten",
    "model-short-article": "Artikel",

    "reset-filters": "Filter zurücksetzen",
  },
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

    "model-label": "Type: {{selectedModel}}",
    "model-all": "All types",
    "model-page": "Only pages",
    "model-article": "Only articles",
    "model-short-all": "Tous les types",
    "model-short-page": "Pages",
    "model-short-article": "Articles",

    "reset-filters": "Reset filters",
  },
}
