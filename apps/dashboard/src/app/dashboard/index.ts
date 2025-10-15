import { useAuthStore } from "@/features/auth"
import { Api } from "@/services"
import { D } from "@compo/utils"
import parentRoute from ".."
import routeToSchifflangeWebsite from "./schifflange-website"

export default () => `${parentRoute()}/dashboard`
export * from "./route"

export const dashboardRoutesByType = (type: Api.Workspace["type"]) =>
  match(type)
    // list the routes by type
    .with("schifflange-website", routeToSchifflangeWebsite)
    .exhaustive()

export const dashboardRootRouteTo = (workspace?: Option<Api.Workspace>) =>
  workspace ? dashboardRoutesByType(workspace.type) : `${parentRoute()}/dashboard`

export const useDashboardRoute = () => {
  const me = useAuthStore(D.prop("me"))
  const isAuthenticated = !!me
  if (isAuthenticated) {
    return [true, dashboardRootRouteTo(me.workspace)] as const
  }
  return [false, ""] as const
}
