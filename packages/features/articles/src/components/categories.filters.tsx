import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Filter } from "lucide-react"
import React from "react"
import { useFiltersCategories } from "../hooks"

/**
 * CategoriesFilters
 */
export const CategoriesFilters: React.FC<ReturnType<typeof useFiltersCategories>[0]> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { reset } = props

  return (
    <Ui.DropdownMenu.Root>
      <Ui.Tooltip.Quick asChild tooltip={_("tooltip")} side='top' align='center'>
        <Ui.DropdownMenu.Trigger asChild>
          <Dashboard.Toolbar.Button variant='outline' icon>
            <Filter aria-hidden />
          </Dashboard.Toolbar.Button>
        </Ui.DropdownMenu.Trigger>
      </Ui.Tooltip.Quick>
      <Ui.DropdownMenu.Content align='end' side='bottom'>
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
    tooltip: "Filter categories",
    "reset-filters": "Reset filters",
  },
  fr: {
    tooltip: "Filtrer les catégories",
    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    tooltip: "Kategorien filtern",
    "reset-filters": "Filter zurücksetzen",
  },
}
