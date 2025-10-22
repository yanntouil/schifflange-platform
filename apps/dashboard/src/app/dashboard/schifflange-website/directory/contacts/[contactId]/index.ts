import parentRoute from ".."

export * from "./route"
const routeToId = (contactId: string) => `${parentRoute()}/${contactId}`
export default routeToId
