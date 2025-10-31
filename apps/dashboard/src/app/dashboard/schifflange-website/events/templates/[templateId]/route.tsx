import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { TemplateProvider, useSwrTemplate } from "@compo/templates"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from ".."
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const RouteTemplateId: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { _ } = useTranslation(dictionary)
  const { template, isLoading, isError, ...swr } = useSwrTemplate(templateId)
  const { workspace } = useWorkspace()

  const breadcrumbs = useBreadcrumbs(templateId)
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(template)) return <Redirect to={parentTo()} />

  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <TemplateProvider swr={{ ...swr, template }}>
        <Page template={template} {...swr} />
      </TemplateProvider>
    </ContextualLanguageProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Event Template Details",
  },
  fr: {
    title: "Détails du modèle d'événement",
  },
  de: {
    title: "Vorlagen-Details der Veranstaltung",
  },
}
