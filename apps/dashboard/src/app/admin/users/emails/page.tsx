import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { EmailsProvider } from "./context.provider"
import { Emails } from "./emails"

/**
 * Admin users emails page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  return (
    <EmailsProvider>
      <Emails />
    </EmailsProvider>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Emails",
  },
  fr: {
    title: "Emails",
  },
  de: {
    title: "E-Mails",
  },
}
