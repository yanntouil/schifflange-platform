import { type CreateApi } from "../api"
import { type Secure } from "../store"
import { CommonErrors, Language } from "../types"

/**
 * service
 */
export const languages = (api: CreateApi, secure: Secure) => ({
  all: secure(() => api.get<{ languages: Language[] }, CommonErrors>("languages")),
})
