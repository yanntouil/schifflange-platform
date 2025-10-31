import { type CreateApi } from "../../api"
import { pins } from "../../pins"
import { publication } from "../../publications"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import * as Payload from "./payload"
import * as Query from "./payload"
import { Library, LibraryDocument, LibraryDocumentWithRelations, LibraryWithRelations } from "./types"

export const libraries = (api: CreateApi, secure: Secure, wid: string) => ({
  // Libraries CRUD
  all: secure((query: Query.Libraries = {}) =>
    api.get<{ libraries: Library[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/libraries`, query))
  ),
  rootIndex: secure((query: Query.Libraries = {}) =>
    api.get<{ libraries: Library[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/libraries/root`, query))
  ),
  create: secure((payload: Payload.CreateLibrary) =>
    api.post<{ library: LibraryWithRelations }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/libraries`, {
      data: payload,
    })
  ),
  pins: pins(api, secure, `workspaces/${wid}/pins/libraries`),

  id: (lid: string) => ({
    read: secure(() =>
      api.get<{ library: LibraryWithRelations }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/libraries/${lid}`)
    ),
    update: secure((payload: Payload.UpdateLibrary) =>
      api.put<{ library: LibraryWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/libraries/${lid}`,
        { data: payload }
      )
    ),
    create: secure((payload: Payload.CreateLibrary) =>
      api.post<{ library: LibraryWithRelations }, WorkspaceErrors | ValidationErrors>(
        `workspaces/${wid}/libraries/${lid}/libraries`,
        {
          data: payload,
        }
      )
    ),
    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/libraries/${lid}`)),

    // Library Documents CRUD
    documents: {
      all: secure((query: Query.LibraryDocuments = {}) =>
        api.get<{ libraryDocuments: LibraryDocument[] }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/libraries/${lid}/documents`, query)
        )
      ),
      create: secure((payload: Payload.CreateLibraryDocument) =>
        api.post<{ libraryDocument: LibraryDocumentWithRelations }, WorkspaceErrors | ValidationErrors>(
          `workspaces/${wid}/libraries/${lid}/documents`,
          { data: payload }
        )
      ),
      id: (did: string) => ({
        read: secure(() =>
          api.get<{ libraryDocument: LibraryDocumentWithRelations }, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/libraries/${lid}/documents/${did}`
          )
        ),
        update: secure((payload: Payload.UpdateLibraryDocument) =>
          api.put<
            { libraryDocument: LibraryDocumentWithRelations },
            WorkspaceErrors | NotFoundErrors | ValidationErrors
          >(`workspaces/${wid}/libraries/${lid}/documents/${did}`, { data: payload })
        ),
        delete: secure(() =>
          api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/libraries/${lid}/documents/${did}`)
        ),
        publication: publication(api, secure, `workspaces/${wid}/libraries/${lid}/documents/${did}`),
      }),
    },
  }),
})
