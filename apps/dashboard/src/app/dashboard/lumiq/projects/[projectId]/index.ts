import parentRoute from ".."
export * from "./route"
export default (projectId: string) => `${parentRoute()}/${projectId}`
