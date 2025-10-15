import { useSWR } from "@compo/hooks"
import { type Api } from "@services/dashboard"

import React from "react"
import { useLanguagesService } from "./service.context"

/**
 * useSWRLanguages
 * This hook is used to fetch all languages
 */
export const useSWRLanguages = () => {
  const { service } = useLanguagesService()
  const { data, isLoading, mutate } = useSWR(
    {
      fetch: service.all,
      key: `languages`,
    },
    {
      fallbackData: { languages: [] },
      keepPreviousData: false,
    }
  )

  const languages = React.useMemo(() => data.languages, [data])
  const mutateLanguage = (language: Partial<Api.Language>) =>
    mutate(
      (data) =>
        data && { ...data, languages: data.languages.map((l) => (l.id === language.id ? { ...l, ...language } : l)) }
    )

  return {
    service,
    isLoading,
    isError: !isLoading && !data,
    languages,
    mutate,
    mutateLanguage,
    rejectLanguage: (language: Api.Language) =>
      mutate((data) => data && { ...data, languages: data.languages.filter((l) => l.id !== language.id) }),
    rejectLanguageById: (id: string) =>
      mutate((data) => data && { ...data, languages: data.languages.filter((l) => l.id !== id) }),
  }
}

/**
 * SWRLanguages type
 */
export type SWRLanguages = ReturnType<typeof useSWRLanguages>
