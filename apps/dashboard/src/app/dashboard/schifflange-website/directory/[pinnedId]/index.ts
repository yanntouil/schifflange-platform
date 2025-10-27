import parentRoute from ".."

export * from "./route"
const routeTo = (pinnedId: string) => `${parentRoute()}/${pinnedId}`
export default routeTo
