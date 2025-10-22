import { ById, byId, D, G } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useSwrAllOrganisations } from "../swr.organisations"

export const usePathToOrganisation = (organisationId: string, to?: string): Api.Organisation[] => {
  const { organisations } = useSwrAllOrganisations()
  const organisationByIds = byId(organisations)
  const path = React.useMemo(
    () => getPath(organisationId ?? null, organisationByIds, to).reverse(),
    [organisationId, organisationByIds]
  )
  return path
}

const getPath = (id: string | null, byIds: ById<Api.Organisation>, to: string | undefined): Api.Organisation[] => {
  if (G.isNull(id)) return []
  const current = D.get(byIds, id)
  if (G.isNullable(current)) return []
  if (G.isNullable(to) ? G.isNullable(current.parentOrganisationId) : to === current.id) return [current]
  return [current, ...getPath(current.parentOrganisationId, byIds, to)]
}
