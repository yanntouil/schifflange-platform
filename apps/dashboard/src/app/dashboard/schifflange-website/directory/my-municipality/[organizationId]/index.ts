import parentRoute from ".."

export * from "./route"
const routeToId = (organizationId: string) => `${parentRoute()}/${organizationId}`
export default routeToId
