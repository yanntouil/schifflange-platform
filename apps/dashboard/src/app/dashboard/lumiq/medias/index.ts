import parentRoute from ".."
export default (folderId: string | null = null) => (folderId ? `${parentRoute()}/medias/${folderId}` : `${parentRoute()}/medias`)
export * from "./route"
