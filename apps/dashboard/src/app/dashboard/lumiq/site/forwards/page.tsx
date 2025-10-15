import { Dashboard } from "@compo/dashboard"
import { Forwards, ForwardsProvider, useSWRForwards } from "@compo/forwards"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * AdminForwards
 * manage forwards
 */
export const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSWRForwards()

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <ForwardsProvider swr={swr}>
        <Forwards />
      </ForwardsProvider>
    </Dashboard.Container>
  )
}
export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "URL Redirects & Forwards",
    description:
      "Manage permanent (301) and temporary (302) redirects to handle moved content, maintain SEO rankings, and ensure visitors never encounter broken links",
  },
  fr: {
    title: "Redirections et transferts d'URL",
    description:
      "Gérez les redirections permanentes (301) et temporaires (302) pour gérer le contenu déplacé, maintenir le référencement SEO et garantir que les visiteurs ne rencontrent jamais de liens brisés",
  },
  de: {
    title: "URL-Weiterleitungen & Forwards",
    description:
      "Verwalten Sie permanente (301) und temporäre (302) Weiterleitungen, um verschobene Inhalte zu handhaben, SEO-Rankings zu erhalten und sicherzustellen, dass Besucher nie auf defekte Links stoßen",
  },
}
