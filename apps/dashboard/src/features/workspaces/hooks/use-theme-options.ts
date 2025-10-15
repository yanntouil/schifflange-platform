import { service } from "@/services"
import { useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, pipe } from "@compo/utils"
import React from "react"

/**
 * This hook is used to get the theme options for the workspace theme select
 */
export const useThemeOptions = () => {
  const { _ } = useTranslation(dictionary)
  const { data: themesData } = useSWR(fetcher, { fallbackData: { themes: [] } })
  const themeOptions = React.useMemo(
    () =>
      pipe(
        themesData.themes,
        A.map((theme) => ({
          label: theme.name,
          value: theme.id,
        })),
        A.prepend({
          label: _("empty"),
          value: "empty",
        })
      ),
    [themesData.themes, _]
  )
  return themeOptions
}

const fetcher = {
  key: "workspace-themes",
  fetch: () => service.workspaces.themes(),
}

/**
 * translations
 */
const dictionary = {
  en: {
    empty: "No theme",
  },
  fr: {
    empty: "Aucun thème",
  },
  de: {
    empty: "Kein Theme",
  },
}
