import { useTranslation } from "@compo/localize"
import React from "react"

/**
 * useProjectsStateOptions
 * Returns options for project state select/radio fields
 */
export const useProjectsStateOptions = () => {
  const { _ } = useTranslation(dictionary)
  const options = React.useMemo(() => {
    return [
      { value: "draft", label: _("state-draft") },
      { value: "published", label: _("state-published") },
    ]
  }, [_])
  return options
}

/**
 * translations
 */
const dictionary = {
  en: {
    "state-draft": "Draft",
    "state-published": "Published",
  },
  fr: {
    "state-draft": "Brouillon",
    "state-published": "Publié",
  },
  de: {
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
  },
}
