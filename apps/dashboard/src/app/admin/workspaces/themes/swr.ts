import { Api, service } from "@/services"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { useThemesStore } from "./store"

/**
 * useSwrThemes
 */
export const useSwrThemes = () => {
  const query = useThemesStore((state) => state.query)
  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.admin.workspaces.themes.list(query),
      key: useMemoKey("admin-themes", { ...query }),
    },
    {
      fallbackData: {
        metadata: service.fallbackMetadata,
        themes: [],
      },
    }
  )

  const { themes, metadata } = data as any

  // mutation helper
  const mutateThemes = (fn: (items: Api.Admin.WorkspaceTheme[]) => Api.Admin.WorkspaceTheme[]) =>
    mutate((data: any) => data && { ...data, themes: fn(data.themes) }, { revalidate: true })

  const swr = {
    ...props,
    mutate,
    update: (theme: Api.Admin.WorkspaceTheme) => void mutateThemes(A.map((f) => (f.id === theme.id ? theme : f))),
    reject: (theme: Api.Admin.WorkspaceTheme) => void mutateThemes(A.filter((f) => f.id !== theme.id)),
    rejectById: (id: string) => void mutateThemes(A.filter((f) => f.id !== id)),
    append: (theme: Api.Admin.WorkspaceTheme) => void mutateThemes(A.append(theme)),
  }

  return { themes, metadata, swr }
}
