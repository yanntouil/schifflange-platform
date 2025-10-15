import parentRoute from ".."
export * from "./route"
export default (userId: string) => `${parentRoute()}/${userId}`
