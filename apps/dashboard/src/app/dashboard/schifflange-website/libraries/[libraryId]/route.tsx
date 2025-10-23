import { Dashboard } from "@compo/dashboard"
import { useSwrLibrary } from "@compo/libraries"
import { useTranslation } from "@compo/localize"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from "../"
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const RouteLibraryId: React.FC<{ libraryId: string }> = ({ libraryId }) => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs(libraryId)
  const swr = useSwrLibrary(libraryId)
  const { library, isLoading, isError } = swr
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(library)) return <Redirect to={parentTo()} />
  const safeSwr = { ...swr, library }
  return <Page swr={safeSwr} />
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Library Details",
  },
  fr: {
    title: "Détails de la bibliothèque",
  },
  de: {
    title: "Bibliothek Details",
  },
}
