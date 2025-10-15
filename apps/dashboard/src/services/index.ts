import globalConfig from "@/config/global"
import { createService } from "@services/dashboard"

const service = createService(globalConfig.api)

export { type Api, type Payload, type Payload as Query } from "@services/dashboard"
export { service }
