import { Dashboard } from "@compo/dashboard"
import { useSwrContact } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from "../"
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const RouteContactId: React.FC<{ contactId: string }> = ({ contactId }) => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs(contactId)
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrContact(contactId)
  const { contact, isLoading, isError } = swr
  if (isLoading) return <></>
  if (isError || G.isNullable(contact)) return <Redirect to={parentTo()} />
  const safeSwr = { ...swr, contact }
  return <Page swr={safeSwr} />
}

/**
 * translations
 */
const dictionary = {
  en: { title: "Contact Details" },
  fr: { title: "Détails du contact" },
  de: { title: "Kontakt Details" },
}
