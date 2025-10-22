import parentRoute from ".."
import { routesTo as routesToArticles } from "./articles"
import { routesTo as routesToDirectory } from "./directory"
import { default as routesToMedias } from "./medias"
import { routesTo as routesToPages } from "./pages"
import { routesTo as routesToSite } from "./site"

export * from "./route"
const routeToDashboard = () => `${parentRoute()}/schifflange-website`
export default routeToDashboard
export const routesTo = {
  dashboard: routeToDashboard,
  pages: routesToPages,
  articles: routesToArticles,
  medias: routesToMedias,
  directory: routesToDirectory,
  ...routesToSite,
}
