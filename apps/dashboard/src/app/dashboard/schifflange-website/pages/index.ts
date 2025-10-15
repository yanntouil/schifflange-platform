import parentRoute from ".."
import routeToPageId from "./[pageId]"
import routeToStats from "./stats"
import routeToTemplates from "./templates"
import routeToTemplatesId from "./templates/[templateId]"

export * from "./route"
const routeToList = () => `${parentRoute()}/pages`
export default routeToList
export const routesTo = {
  list: routeToList,
  byId: routeToPageId,
  stats: routeToStats,
  templates: {
    list: routeToTemplates,
    byId: routeToTemplatesId,
  },
}
