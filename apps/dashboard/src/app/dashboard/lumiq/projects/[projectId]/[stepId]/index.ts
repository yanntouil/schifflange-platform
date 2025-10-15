import parentRoute from ".."
export * from "./route"
export default (projectId: string, stepId: string) => `${parentRoute(projectId)}/${stepId}`
