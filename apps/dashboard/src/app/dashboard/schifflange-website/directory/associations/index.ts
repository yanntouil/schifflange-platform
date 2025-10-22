import parentRoute from ".."

export * from "./route"
const routeToList = () => `${parentRoute()}/associations`
export default routeToList
