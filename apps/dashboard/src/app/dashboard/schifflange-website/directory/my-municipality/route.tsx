import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useSwrOrganisation } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from "../"
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const RouteMyMunicipality: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  const organisationId = workspace.config.organisation.organisationId || undefined
  const breadcrumbs = useBreadcrumbs()
  const swr = useSwrOrganisation(organisationId || "nonexistent")
  const { organisation, isLoading, isError } = swr
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(organisation)) return <Redirect to={parentTo()} />
  const safeSwr = { ...swr, organisation }
  return <Page swr={safeSwr} />
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "My Municipality Details",
  },
  fr: {
    title: "Détails de la commune",
  },
  de: {
    title: "Gemeinde Details",
  },
}
