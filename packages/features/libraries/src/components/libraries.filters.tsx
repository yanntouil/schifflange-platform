import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Filter } from "lucide-react"
import React from "react"
import { useFiltersLibraries } from "../hooks/use-filters-libraries"

/**
 * LibrariesFilters
 * Filter component for libraries - currently a placeholder
 * Add filter options as needed in use-filters-libraries.ts
 */
export const LibrariesFilters: React.FC<ReturnType<typeof useFiltersLibraries>[0]> = (props) => {
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
        {/* Add filter options here when needed */}
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
    tooltip: "Filter libraries",
    "reset-filters": "Reset filters",
  },
  fr: {
    tooltip: "Filtrer les bibliothèques",
    "reset-filters": "Réinitialiser les filtres",
  },
  de: {
    tooltip: "Bibliotheken filtern",
    "reset-filters": "Filter zurücksetzen",
  },
}

