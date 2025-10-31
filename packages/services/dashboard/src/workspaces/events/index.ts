import { type CreateApi } from "../../api"
import { contents } from "../../contents"
import { publication } from "../../publications"
import { schedule } from "../../schedules"
import { seo } from "../../seos"
import { Secure } from "../../store"
import { trackings } from "../../trackings/service"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import { Categories, Create, CreateCategory, Events, Update, UpdateCategory } from "./payload"
import { EventCategory, EventWithRelations, WithEvents } from "./types"

export const events = (api: CreateApi, secure: Secure, wid: string) => ({
  // Categories CRUD
  categories: {
    all: secure((query: Categories = {}) =>
      api.get<{ categories: EventCategory[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/events/categories`, query))
    ),

    create: secure((payload: CreateCategory) =>
      api.post<{ category: EventCategory }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/events/categories`, {
        data: payload,
      })
    ),

    id: (acid: string) => ({
      read: secure(() =>
        api.get<{ category: EventCategory & WithEvents }, WorkspaceErrors | NotFoundErrors>(
          `workspaces/${wid}/events/categories/${acid}`
        )
      ),

      update: secure((payload: UpdateCategory) =>
        api.put<{ category: EventCategory }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
          `workspaces/${wid}/events/categories/${acid}`,
          { data: payload }
        )
      ),

      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/events/categories/${acid}`)
      ),
    }),
  },

  // Events CRUD
  all: secure((query: Events = {}) =>
    api.get<{ events: EventWithRelations[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/events`, query))
  ),

  create: secure((payload: Create) =>
    api.post<{ event: EventWithRelations }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/events`, {
      data: payload,
    })
  ),

  id: (aid: string) => ({
    read: secure(() =>
      api.get<{ event: EventWithRelations }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/events/${aid}`)
    ),
    trackings: trackings.workspace(wid)(api, secure),
    update: secure((payload: Update) =>
      api.put<{ event: EventWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/events/${aid}`,
        {
          data: payload,
        }
      )
    ),

    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/events/${aid}`)),

    seo: seo(api, secure, `workspaces/${wid}/events/${aid}`),

    publication: publication(api, secure, `workspaces/${wid}/events/${aid}`),

    content: contents(api, secure, `workspaces/${wid}/events/${aid}`),
    schedule: schedule(api, secure, `workspaces/${wid}`),
  }),
})
