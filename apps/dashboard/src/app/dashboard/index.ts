import { useAuthStore } from "@/features/auth"
import { Api } from "@/services"
import { D } from "@compo/utils"
import parentRoute from ".."
import dashboardLumiqRouteTo from "./lumiq"
import dashboardTypeARouteTo from "./type-a"
import dashboardTypeBRouteTo from "./type-b"
import dashboardTypeCRouteTo from "./type-c"

export default () => `${parentRoute()}/dashboard`
export * from "./route"
// export the admin route with its children
export const dashboardRoutesByType = (type: Api.Workspace["type"]) =>
  match(type)
    .with("type-a", dashboardTypeARouteTo)
    .with("type-b", dashboardTypeBRouteTo)
    .with("type-c", dashboardTypeCRouteTo)
    .with("lumiq", dashboardLumiqRouteTo)
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
