import parentRoute from "../.."
export * from "./route"
export default (token: string) => `${parentRoute()}/token/${token}`
