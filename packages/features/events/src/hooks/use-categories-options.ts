import { FormSelectOption } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { A, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useSwrCategories } from "../swr.categories"

/**
 * useCategoriesOptions
 * return a list of options for the event categories usable in a select input
 */
export const useCategoriesOptions = () => {
  const { _ } = useTranslation(dictionary)
  const { categories, isLoading } = useSwrCategories()
  const { translate } = useLanguage()
  const options: FormSelectOption[] = React.useMemo(
    () =>
      A.map(categories, (category) => {
        const translated = translate(category, servicePlaceholder.articleCategory)
        return {
          label: placeholder(translated.title, _("placeholder")),
          value: category.id,
        }
      }),
    [categories, _]
  )
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
