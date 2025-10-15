import { type CreateApi } from "../api"
import { Secure } from "../store"
import { ValidationErrors, WorkspaceErrors } from "../types"
import { CreateItem, FromTemplate, ReorderItem, Update, UpdateItem } from "./payload"
import { Content, ContentItem } from "./types"

/**
 * service contents
 */
export const contents = (api: CreateApi, secure: Secure, basePath: string) => ({
  update: secure((payload: Update) =>
    api.put<{ content: Content }, WorkspaceErrors | ValidationErrors>(`${basePath}/content`, {
      data: payload,
    })
  ),
  items: {
    create: secure((payload: CreateItem) =>
      api.post<{ item: ContentItem; sortedIds: string[] }, WorkspaceErrors | ValidationErrors>(
        `${basePath}/content/items`,
        {
          data: payload,
        }
      )
    ),
    reorder: secure((payload: ReorderItem) =>
      api.put<{ sortedIds: string[] }, WorkspaceErrors | ValidationErrors>(`${basePath}/content/items`, {
        data: payload,
      })
    ),
    fromTemplate: secure(({ templateId, ...payload }: FromTemplate) =>
      api.post<{ items: ContentItem[]; sortedIds: string[] }, WorkspaceErrors | ValidationErrors>(
        `${basePath}/content/items/from-template/${templateId}`,
        {
          data: payload,
        }
      )
    ),
    id: (ciid: string) => ({
      update: secure((payload: UpdateItem) =>
        api.put<{ item: ContentItem }, WorkspaceErrors | ValidationErrors>(`${basePath}/content/items/${ciid}`, {
          data: payload,
        })
      ),
      delete: secure(() =>
        api.delete<{ item: ContentItem; sortedIds: string[] }, WorkspaceErrors | ValidationErrors>(
          `${basePath}/content/items/${ciid}`
        )
      ),
    }),
  },
})
