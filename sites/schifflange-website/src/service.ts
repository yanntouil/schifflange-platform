import { config } from "@/config"
import { createService } from "@services/site"

const service = createService(fetch, config.api, config.workspaceId, config.apiResource)
export { type Api } from "@services/site"
export { service }
