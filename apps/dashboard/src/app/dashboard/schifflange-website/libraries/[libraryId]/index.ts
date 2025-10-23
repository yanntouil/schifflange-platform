import parentRoute from ".."

export * from "./route"
const routeToId = (libraryId: string) => `${parentRoute()}/${libraryId}`
export default routeToId
