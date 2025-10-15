import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { StepProvider, useSwrProjectStep } from "@compo/projects"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from ".."
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const LumiqProjectsIdStepIdRoute: React.FC<{ projectId: string; stepId: string }> = ({ projectId, stepId }) => {
  const { _ } = useTranslation(dictionary)
  const { step, isLoading, isError, ...swr } = useSwrProjectStep(projectId, stepId)
  const { service } = useWorkspace()

  const breadcrumbs = useBreadcrumbs(projectId, stepId)
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(step)) return <Redirect to={parentTo(projectId)} />
  return (
    <StepProvider swr={{ ...swr, step }} trackingService={service.trackings}>
      <Page step={step} {...swr} />
    </StepProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Details of the step {{type}}",
  },
  fr: {
    title: "Détails de l'étape {{type}}",
  },
  de: {
    title: "Projekt-Schritt-Details {{type}}",
  },
}
