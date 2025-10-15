import parentRoute from ".."
export * from "./route"
export default (pageId: string) => `${parentRoute()}/${pageId}`