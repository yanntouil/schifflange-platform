import { useTranslation } from "@compo/localize"
import React from "react"

/**
 * useTypeOptions
 * Returns options for template type select/radio fields
 */
export const useTypeOptions = () => {
  const { _ } = useTranslation(dictionary)
  const options = React.useMemo(() => {
    return [
      { value: "page", label: _("type-page") },
      { value: "article", label: _("type-article") },
      { value: "project", label: _("type-project") },
    ]
  }, [_])
  return options
}

/**
 * translations
 */
const dictionary = {
  en: {
    "type-page": "Page",
    "type-article": "Article",
    "type-project": "Project",
  },
  fr: {
    "type-page": "Page",
    "type-article": "Article",
    "type-project": "Project",
  },
  de: {
    "type-page": "Page",
    "type-article": "Article",
    "type-project": "Project",
  },
}
