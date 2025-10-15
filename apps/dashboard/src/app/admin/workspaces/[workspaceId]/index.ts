import parentRoute from ".."
export * from "./route"
export default (id: string) => `${parentRoute()}/${id}`
