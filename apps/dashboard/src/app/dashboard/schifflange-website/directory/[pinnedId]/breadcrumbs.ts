import { Dashboard } from "@compo/dashboard"
import { useSwrOrganisation } from "@compo/directory"
import { useLanguage } from "@compo/translations"
import { placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { useParams } from "wouter"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = () => {
  const parent = useParentBreadcrumbs()
  const { pinnedId } = useParams<{ pinnedId: string }>()
  const { translate } = useLanguage()
  const { organisation } = useSwrOrganisation(pinnedId)

  const name = organisation
    ? placeholder(translate(organisation, servicePlaceholder.organisation).name, "...")
    : "..."

  return Dashboard.useBreadcrumbs(dictionary, () => [...parent, [name, routeTo(pinnedId)]])
}

const dictionary = {
  en: {},
  fr: {},
  de: {},
}

export default useBreadcrumbs
