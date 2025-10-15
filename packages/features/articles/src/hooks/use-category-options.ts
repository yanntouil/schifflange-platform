import { FormSelectOption } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { A } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useSwrCategories } from "../swr"

/**
 * useCategoryOptions
 * return a list of options for the article categories usable in a select input
 */
export const useCategoryOptions = (none: boolean = false) => {
  const { categories, isLoading } = useSwrCategories()
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const options: FormSelectOption[] = React.useMemo(() => {
    const categoryOptions = A.map(categories, (category) => {
      const translated = translate(category, servicePlaceholder.articleCategory)
      return {
        label: translated.title,
        value: category.id,
      }
    })
    return none ? A.prepend(categoryOptions, { label: _("none"), value: "none" }) : categoryOptions
  }, [categories, none, _])
  return [options, isLoading] as const
}

const dictionary = {
  fr: {
    placeholder: "Catégorie sans titre",
    none: "Sans catégorie",
  },
  en: {
    placeholder: "Untitled category",
    none: "No category",
  },
  de: {
    placeholder: "Kategorie ohne Titel",
    none: "Keine Kategorie",
  },
}
