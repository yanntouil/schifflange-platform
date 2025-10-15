import { assert, createMakePathTo, G, type Option } from "@compo/utils"
import { admin } from "./admin"
import { createApi } from "./api"
import { auth } from "./auth"
import { languages } from "./languages"
import { notifications } from "./notifications"
import { placeholder } from "./placeholder"
import { makeStore } from "./store"
import { PaginationMeta, SingleImage } from "./types"
import { workspaces } from "./workspaces"

/**
 * create a service with the api
 */
type ApiPath = Option<string>
export const createService = (apiPath: ApiPath) => {
  const rootUrl = normalize(`${assert(apiPath, "Missing apiPath in @compo/services")}`)
  const root = createApi(rootUrl)

  const apiUrl = normalize(`${rootUrl}api`)
  const api = createApi(apiUrl)
  const store = makeStore(root)
  const { secure, check } = store.actions

  const makePath = createMakePathTo(rootUrl)
  const getImageUrl = (image: Option<SingleImage>, type: "thumbnail" | "preview" | "original" = "original") => {
    if (G.isNullable(image)) return null
    if (type === "original") return makePath(image.url)
    if (type === "preview") return makePath(image.previewUrl || image.url)
    if (type === "thumbnail") return makePath(image.thumbnailUrl || image.previewUrl || image.url)
    return makePath(image.url)
  }
  return {
    api,
    fallbackMetadata,
    languages: languages(api, secure),
    auth: auth(api, secure),
    admin: admin(api, secure),
    workspaces: workspaces(api, secure),
    notifications: notifications(api, secure),
    store,
    useStore: store.use,
    check,
    makePath,
    getImageUrl,
    placeholder,
  }
}
const normalize = (base: string) => base.replace(/\/+$/, "") + "/"
const fallbackMetadata: PaginationMeta = {
  total: 0,
  perPage: 10,
  currentPage: 1,
  lastPage: 1,
  firstPage: 1,
  firstPageUrl: "",
  lastPageUrl: "",
  nextPageUrl: null,
  previousPageUrl: null,
}
