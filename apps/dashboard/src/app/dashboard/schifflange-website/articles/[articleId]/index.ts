import parentRoute from ".."
export * from "./route"
export default (articleId: string) => `${parentRoute()}/${articleId}`
