import { useTranslation } from "@compo/localize"
import React from "react"

/**
 * CouncilsFilters
 */
export const CouncilsFilters: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return <>{/* TODO: Add filters here (e.g., date range filter) */}</>
}

/**
 * translations
 */
const dictionary = {
  en: {
    label: "Filters",
  },
  fr: {
    label: "Filtres",
  },
  de: {
    label: "Filter",
  },
}
