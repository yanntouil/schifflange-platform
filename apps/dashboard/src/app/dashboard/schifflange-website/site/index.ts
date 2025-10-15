import parentRoute from ".."
import routeToConfig from "./config"
import routeToForwards from "./forwards"
import routeToMenus from "./menus"
import routeToMenuId from "./menus/[menuId]"
import routeToSitemap from "./sitemap"
export * from "./route"
export default () => `${parentRoute()}/site`
export const routesTo = {
  sitemap: routeToSitemap,
  menus: {
    list: routeToMenus,
    byId: routeToMenuId,
  },
  forwards: routeToForwards,
  config: routeToConfig,
}
