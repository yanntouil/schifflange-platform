import { type CreateApi } from "../../api"
import { contents } from "../../contents"
import { publication } from "../../publications"
import { seo } from "../../seos"
import { Secure } from "../../store"
import { trackings } from "../../trackings/service"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import { Articles, Categories, Create, CreateCategory, Update, UpdateCategory } from "./payload"
import { ArticleCategory, ArticleWithRelations, WithArticles } from "./types"

export const articles = (api: CreateApi, secure: Secure, wid: string) => ({
  // Categories CRUD
  categories: {
    all: secure((query: Categories = {}) =>
      api.get<{ categories: ArticleCategory[] }, WorkspaceErrors>(
        appendQS(`workspaces/${wid}/articles/categories`, query)
      )
    ),

    create: secure((payload: CreateCategory) =>
      api.post<{ category: ArticleCategory }, WorkspaceErrors | ValidationErrors>(
        `workspaces/${wid}/articles/categories`,
        { data: payload }
      )
    ),

    id: (acid: string) => ({
      read: secure(() =>
        api.get<{ category: ArticleCategory & WithArticles }, WorkspaceErrors | NotFoundErrors>(
          `workspaces/${wid}/articles/categories/${acid}`
        )
      ),

      update: secure((payload: UpdateCategory) =>
        api.put<{ category: ArticleCategory }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
          `workspaces/${wid}/articles/categories/${acid}`,
          { data: payload }
        )
      ),

      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/articles/categories/${acid}`)
      ),
    }),
  },

  // Articles CRUD
  all: secure((query: Articles = {}) =>
    api.get<{ articles: ArticleWithRelations[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/articles`, query))
  ),

  create: secure((payload: Create) =>
    api.post<{ article: ArticleWithRelations }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/articles`, {
      data: payload,
    })
  ),

  id: (aid: string) => ({
    read: secure(() =>
      api.get<{ article: ArticleWithRelations }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/articles/${aid}`)
    ),
    trackings: trackings.workspace(wid)(api, secure),
    update: secure((payload: Update) =>
      api.put<{ article: ArticleWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/articles/${aid}`,
        {
          data: payload,
        }
      )
    ),

    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/articles/${aid}`)),

    seo: seo(api, secure, `workspaces/${wid}/articles/${aid}`),

    publication: publication(api, secure, `workspaces/${wid}/articles/${aid}`),

    content: contents(api, secure, `workspaces/${wid}/articles/${aid}`),
  }),
})
