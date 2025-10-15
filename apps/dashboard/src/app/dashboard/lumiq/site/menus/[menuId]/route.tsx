import { useWorkspace } from "@/features/workspaces"
import { MenuProvider, useSWRMenu } from "@compo/menus"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from "../"
import Page from "./page"

export const LumiqMenusIdRoute: React.FC<{ menuId: string }> = ({ menuId }) => {
  const { menu, isLoading, isError, ...swr } = useSWRMenu(menuId)
  const { workspace } = useWorkspace()

  if (isLoading) return <Loader />
  if (isError || G.isNullable(menu)) return <Redirect to={parentTo()} />

  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <MenuProvider swr={{ ...swr, menu }}>
        <Page menu={menu} {...swr} />
      </MenuProvider>
    </ContextualLanguageProvider>
  )
}

const Loader: React.FC = () => {
  return <div>Loading...</div>
}
