import { useTranslation } from "@compo/localize"
import { StatsDialog } from "@compo/trackings"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { StepContext, useStep } from "./step.context"
import { useManageStep } from "./step.context.actions"
import { SWRSafeProjectStep } from "./swr"

/**
 * StepProvider
 */
type StepProviderProps = {
  swr: SWRSafeProjectStep
  trackingService: Api.TrackingService
  children: React.ReactNode
}

export const StepProvider: React.FC<StepProviderProps> = ({ swr, trackingService, children }) => {
  const contextId = React.useId()
  const [manageStep, manageStepProps] = useManageStep(swr, trackingService)
  const contextProps = React.useMemo(() => ({ contextId, swr }), [contextId, swr])
  const value = React.useMemo(() => ({ ...contextProps, ...manageStep, swr }), [contextProps, manageStep, swr])

  return (
    <StepContext.Provider key={contextId} value={value}>
      {children}
      <ManageStep {...manageStepProps} key={`${contextId}-manageStep`} />
    </StepContext.Provider>
  )
}

/**
 * ManageStep
 */
type ManageStepProps = ReturnType<typeof useManageStep>[1]
const ManageStep: React.FC<ManageStepProps> = ({ displayStatsProps, confirmDeleteProps, trackingService }) => {
  const { _ } = useTranslation(dictionary)

  const { swr } = useStep()
  return (
    <>
      <StatsDialog
        {...displayStatsProps}
        trackingId={swr.step.tracking.id}
        service={trackingService}
        title={_("stats-title")}
        description={_("stats-description")}
        display='views'
        defaultStats='visit'
        defaultDisplayBy='months'
      />
      <Ui.Confirm {...confirmDeleteProps} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "stats-title": "Statistiques de l'étape du projet",
    "stats-description": "Choisissez le type de statistiques à afficher, la période et la manière de les visualiser",
  },
  en: {
    "stats-title": "Project step stats",
    "stats-description": "Select the type of stats to display, range of time and how to display them",
  },
  de: {
    "stats-title": "Projekt-Schritt-Statistiken",
    "stats-description": "Wählen Sie den Typ der Statistiken, den Zeitraum und die Art der Anzeige aus",
  },
}
