import { FormSelectOption } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { A, D } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import React from "react"
import { useSwrTags } from "../swr"

/**
 * useTagOptions
 * return a list of options for the project tags usable in a select input
 */
export const useTagOptions = (none: boolean = false) => {
  const { tags, isLoading } = useSwrTags()
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const options: FormSelectOption[] = React.useMemo(() => {
    const tagOptions = A.map(tags, (tag) => {
      const translated = translate(tag, servicePlaceholder.projectTag)
      return {
        label: translated.name,
        value: tag.id,
      }
    })
    return none ? A.prepend(tagOptions, { label: _("none"), value: "none" }) : tagOptions
  }, [tags, none, _])
  return [options, isLoading] as const
}
export const useTagOptionsByType = (none: boolean = false) => {
  const { tags, isLoading } = useSwrTags()
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const noneOption = React.useMemo(() => ({ label: _("none"), value: "none" }), [_])
  const optionsByType = React.useMemo(() => {
    const optionsByType = A.reduce(
      tags,
      {} as Record<Api.ProjectTagType, { label: string; sort: string; value: string }[]>,
      (acc, tag) => {
        const translated = translate(tag, servicePlaceholder.projectTag)
        const option = {
          label: translated.name,
          sort: `${tag.order}`.padStart(5, "0") + translated.name,
          value: tag.id,
        }
        return D.set(acc, tag.type, A.append(D.get(acc, tag.type) ?? [], option))
      }
    )
    // sort options by name and order
    const sorted = D.map(optionsByType, (options) => A.sort(options, (a, b) => a.sort.localeCompare(b.sort)))
    return sorted
  }, [tags, translate])
  return [optionsByType, noneOption, isLoading] as const
}

const dictionary = {
  fr: {
    placeholder: "Tag sans titre",
    none: "Sans tag",
  },
  en: {
    placeholder: "Untitled tag",
    none: "No tag",
  },
  de: {
    placeholder: "Unbenanntes Tag",
    none: "Kein Tag",
  },
}
