import { FormSelectOption } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { A } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useSwrCategories } from "../swr"

/**
 * useCategoryOptions
 * return a list of options for the project categories usable in a select input
 */
export const useCategoryOptions = (none: boolean = false) => {
  const { categories, isLoading } = useSwrCategories()
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const options: FormSelectOption[] = React.useMemo(() => {
    const categoryOptions = A.map(categories, (category) => {
      const translated = translate(category, servicePlaceholder.projectCategory)
      return {
        label: translated.title,
        sort: `${category.order}`.padStart(5, "0") + translated.title,
        value: category.id,
      }
    })
    const sorted = A.sort(categoryOptions, (a, b) => a.sort.localeCompare(b.sort))
    return none ? A.prepend(sorted, { label: _("none"), value: "none", sort: "" }) : sorted
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
    placeholder: "Unbenannte Kategorie",
    none: "Keine Kategorie",
  },
}
