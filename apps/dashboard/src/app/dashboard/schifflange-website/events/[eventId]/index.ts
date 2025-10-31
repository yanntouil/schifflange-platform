import parentRoute from ".."
export * from "./route"
export default (eventId: string) => `${parentRoute()}/${eventId}`
