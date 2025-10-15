import { useTranslation } from "@compo/localize"
import React from "react"

/**
 * useArticlesStateOptions
 * Returns options for article state select/radio fields
 */
export const useArticlesStateOptions = () => {
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
