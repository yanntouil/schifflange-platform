import parentRoute from ".."
import routeToLibraryId from "./[libraryId]"

export * from "./route"
const routeToList = () => `${parentRoute()}/libraries`
export default routeToList

export const routesTo = {
  list: routeToList,
  byId: routeToLibraryId,
}
