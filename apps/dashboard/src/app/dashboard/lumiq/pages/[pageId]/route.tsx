import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { PageProvider, useSwrPage } from "@compo/pages"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from "../"
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const LumiqPagesIdRoute: React.FC<{ pageId: string }> = ({ pageId }) => {
  const { _ } = useTranslation(dictionary)
  const { page, isLoading, isError, ...swr } = useSwrPage(pageId)
  const { workspace, service } = useWorkspace()

  const breadcrumbs = useBreadcrumbs(pageId)
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(page)) return <Redirect to={parentTo()} />

  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <PageProvider swr={{ ...swr, page }} trackingService={service.trackings}>
        <Page page={page} {...swr} />
      </PageProvider>
    </ContextualLanguageProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Page Details",
    description: "Manage page content, SEO, and settings",
    placeholder: "Untitled page in {{language}}",
  },
  fr: {
    title: "Détails de la page",
    description: "Gérer le contenu, SEO et paramètres de la page",
    placeholder: "Page sans titre en {{language}}",
  },
  de: {
    title: "Seiten-Details",
    description: "Seiteninhalte, SEO und Einstellungen verwalten",
    placeholder: "Unbenannte Seite auf {{language}}",
  },
}
