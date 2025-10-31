import parentRoute from ".."
import routeToEventId from "./[eventId]"
import routeToCategories from "./categories"
import routeToStats from "./stats"
import routeToTemplates from "./templates"
import routeToTemplatesId from "./templates/[templateId]"
export * from "./route"
const routeToList = () => `${parentRoute()}/events`
export default routeToList
export const routesTo = {
  list: routeToList,
  byId: routeToEventId,
  stats: routeToStats,
  categories: {
    list: routeToCategories,
  },
  templates: {
    list: routeToTemplates,
    byId: routeToTemplatesId,
  },
}
