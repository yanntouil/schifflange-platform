import { Dashboard } from "@compo/dashboard"
import React from "react"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"
import { useSwrWorkspace } from "./swr"

export default function useBreadcrumbs(id: string) {
  const parent = useParentBreadcrumbs()
  const { workspace, swr } = useSwrWorkspace(id)
  React.useEffect(() => Dashboard.setIsLoading(swr.isLoading), [swr.isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, placeholder) => [
    ...parent,
    [placeholder(workspace?.name, _("placeholder")), routeTo(id)],
  ])
}

const dictionary = {
  en: { placeholder: "Unnamed workspace" },
  fr: { placeholder: "Espace de travail sans nom" },
  de: { placeholder: "Unbenannter Arbeitsbereich" },
}
