import { Dashboard } from "@compo/dashboard"
import { useSwrOrganisation } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import { G } from "@compo/utils"
import React from "react"
import { Redirect, useParams } from "wouter"
import parentTo from "../"
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const RoutePinnedOrganisation: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { pinnedId } = useParams<{ pinnedId: string }>()
  const breadcrumbs = useBreadcrumbs()
  const swr = useSwrOrganisation(pinnedId)
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
    title: "Pinned Organisation Details",
  },
  fr: {
    title: "Détails de l'organisation épinglée",
  },
  de: {
    title: "Details der fixierten Organisation",
  },
}
