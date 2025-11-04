import parentRoute from ".."

export * from "./route"
const routeToList = () => `${parentRoute()}/councils`
export default routeToList

export const routesTo = {
  list: routeToList,
}
