import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useSlugsService } from "../service.context"
import { getSlugResource } from "../utils"

/**
 * useRouteTo
 * return the route to the resource associated with the slug
 */
export const useRouteTo = (slug: Api.Slug & Api.WithModel): string => {
  const { routesTo } = useSlugsService()
  const ressource = getSlugResource(slug)
  const ressourcePath = React.useMemo(() => {
    return match(slug)
      .with({ model: "page" }, ({ page }) => routesTo.pages.byId(page.id))
      .with({ model: "article" }, ({ article }) => routesTo.articles.byId(article.id))
      .with({ model: "event" }, ({ event }) => routesTo.events.byId(event.id))
      .exhaustive()
  }, [slug, routesTo.pages.byId, routesTo.articles.byId])

  return ressourcePath
}
