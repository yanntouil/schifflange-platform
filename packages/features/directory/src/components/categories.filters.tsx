import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Circle, CircleCheckBig, Filter } from "lucide-react"
import React from "react"
import { useFiltersCategories } from "../hooks/use-filters-categories"

/**
 * CategoriesFilters
 */
export const CategoriesFilters: React.FC<ReturnType<typeof useFiltersCategories>[0]> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { reset, isActive, toggleList, unsetList } = props
  const types = ["municipality", "service", "association", "commission", "company", "other"]
  const hasActiveFilter = types.some((type) => isActive(type))
  const selectedType = isActive("municipality")
    ? _("type-short-municipality")
    : isActive("service")
      ? _("type-short-service")
      : isActive("association")
        ? _("type-short-association")
        : isActive("commission")
          ? _("type-short-commission")
          : isActive("company")
            ? _("type-short-company")
            : isActive("other")
              ? _("type-short-other")
              : _("type-short-all")
  const tooltip = hasActiveFilter ? _("tooltip", { selectedType }) : _("tooltip-all", { selectedType })
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
          <Ui.DropdownMenu.SubTrigger>{_("type-label", { selectedType })}</Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent>
            <Ui.DropdownMenu.Item active={!hasActiveFilter} onClick={() => unsetList(types)}>
              {!hasActiveFilter ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
              {_("type-all")}
            </Ui.DropdownMenu.Item>
            <Ui.DropdownMenu.Separator />
            {types.map((type) => (
              <Ui.DropdownMenu.Item key={type} active={isActive(type)} onClick={() => toggleList(type, types)}>
                {isActive(type) ? <CircleCheckBig aria-hidden /> : <Circle aria-hidden />}
                {_(`type-${type}`)}
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
    "tooltip-all": "Filter categories by organisation type",
    tooltip: "Filter categories by organisation type: {{selectedType}}",
    "type-label": "Type: {{selectedType}}",
    "type-all": "All types",
    "type-municipality": "Municipality",
    "type-service": "Service",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Company",
    "type-other": "Other",
    "type-short-all": "All types",
    "type-short-municipality": "Municipality",
    "type-short-service": "Service",
    "type-short-association": "Association",
    "type-short-commission": "Commission",
    "type-short-company": "Company",
    "type-short-other": "Other",
    "reset-filters": "Reset filters",
  },
  fr: {
    "tooltip-all": "Filtrer les catégories par type d'organisation",
    tooltip: "Filtrer les catégories par type d'organisation: {{selectedType}}",
    "type-label": "Type: {{selectedType}}",
    "type-all": "Tous les types",
    "type-municipality": "Commune",
    "type-service": "Service communal",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Entreprise",
    "type-other": "Autre",
    "type-short-all": "Tous les types",
    "type-short-municipality": "Commune",
    "type-short-service": "Service communal",
    "type-short-association": "Association",
    "type-short-commission": "Commission",
    "type-short-company": "Entreprise",
    "type-short-other": "Autre",
    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    "tooltip-all": "Kategorien filtern nach Organisationstyp",
    tooltip: "Kategorien filtern nach Organisationstyp: {{selectedType}}",
    "type-label": "Typ: {{selectedType}}",
    "type-all": "Alle Typen",
    "type-municipality": "Gemeinde",
    "type-service": "Dienst",
    "type-association": "Verein",
    "type-commission": "Kommission",
    "type-company": "Unternehmen",
    "type-other": "Andere",
    "type-short-all": "Alle Typen",
    "type-short-municipality": "Gemeinde",
    "type-short-service": "Dienst",
    "type-short-association": "Verein",
    "type-short-commission": "Kommission",
    "type-short-company": "Unternehmen",
    "type-short-other": "Andere",
    "reset-filters": "Filter zurücksetzen",
  },
}
