import { Dashboard } from "@compo/dashboard"
import { useSwrOrganisation } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import { G } from "@compo/utils"
import React from "react"
import { Redirect, useParams } from "wouter"
import parentTo from "../"
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const RouteOrganizationId: React.FC<{ organizationId: string }> = ({ organizationId }) => {
  const { _ } = useTranslation(dictionary)
  const { pinnedId } = useParams<{ pinnedId: string }>()
  const breadcrumbs = useBreadcrumbs(organizationId)
  const swr = useSwrOrganisation(organizationId)
  const { organisation, isLoading, isError } = swr
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(organisation)) return <Redirect to={parentTo(pinnedId)} />
  const safeSwr = { ...swr, organisation }
  return <Page swr={safeSwr} />
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Pinned organisation service details",
  },
  fr: {
    title: "Détails du service de l'organisation épinglée",
  },
  de: {
    title: "Details des fixierten Organisationsdienstes",
  },
}
