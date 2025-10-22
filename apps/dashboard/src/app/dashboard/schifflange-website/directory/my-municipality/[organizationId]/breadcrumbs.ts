import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { usePathToOrganisation } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, placeholder, truncateText } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (organizationId: string) => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  const organisationId = workspace.config.organisation.organisationId || undefined
  const parent = useParentBreadcrumbs()
  const { translate } = useLanguage()
  const path = usePathToOrganisation(organizationId, organisationId)
  const breadcrumbs: Ui.BreadcrumbType[] = React.useMemo(
    () =>
      A.map(path, (organisation) => {
        const translated = translate(organisation, servicePlaceholder.organisation)
        const name = placeholder(translated.name, _("placeholder"))
        const truncatedName = truncateText(name, 18)
        const route = routeTo(organisation.id)
        return [truncatedName, route] as const
      }),
    [path, translate, _]
  )

  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [...parent, ...breadcrumbs])
}
const dictionary = {
  en: { placeholder: "Unnamed organization" },
  fr: { placeholder: "Organisation sans nom" },
  de: { placeholder: "Organisation ohne Name" },
}
export default useBreadcrumbs
