import parentRoute from ".."
import routeToArticleId from "./[articleId]"
import routeToCategories from "./categories"
import routeToStats from "./stats"
import routeToTemplates from "./templates"
import routeToTemplatesId from "./templates/[templateId]"
export * from "./route"
const routeToList = () => `${parentRoute()}/articles`
export default routeToList
export const routesTo = {
  list: routeToList,
  byId: routeToArticleId,
  stats: routeToStats,
  categories: {
    list: routeToCategories,
  },
  templates: {
    list: routeToTemplates,
    byId: routeToTemplatesId,
  },
}
