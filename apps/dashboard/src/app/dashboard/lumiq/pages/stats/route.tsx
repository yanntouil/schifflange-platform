import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import Page from "./page"

export const LumiqPagesStatsRoute: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Page />
    </ContextualLanguageProvider>
  )
}
