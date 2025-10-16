import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import * as Payload from "./payload"
import * as Query from "./payload"
import {
  Contact,
  ContactOrganisation,
  Organisation,
  OrganisationCategory,
  WithChildOrganisations,
  WithContact,
  WithOrganisation,
  WithOrganisationCategories,
  WithParentOrganisation,
} from "./types"

export const contacts = (api: CreateApi, secure: Secure, wid: string) => ({
  // Contacts CRUD
  all: secure((query: Query.Contacts = {}) =>
    api.get<{ contacts: Contact[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/contacts`, query))
  ),
  create: secure((payload: Payload.CreateContact) =>
    api.post<{ contact: Contact }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/contacts`, { data: payload })
  ),

  id: (cid: string) => ({
    read: secure(() =>
      api.get<{ contact: Contact }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/contacts/${cid}`)
    ),
    update: secure((payload: Payload.UpdateContact) =>
      api.put<{ contact: Contact }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/contacts/${cid}`,
        { data: payload }
      )
    ),
    delete: secure(() =>
      api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/contacts/${cid}`)
    ),
    organisations: {
      all: secure(() =>
        api.get<{ contactOrganisations: ContactOrganisation[] }, WorkspaceErrors>(
          `workspaces/${wid}/contacts/${cid}/organisations`
        )
      ),
      create: secure((payload: Payload.CreateContactOrganisation) =>
        api.post<{ contactOrganisation: ContactOrganisation }, WorkspaceErrors | ValidationErrors>(
          `workspaces/${wid}/contacts/${cid}/organisations`,
          { data: payload }
        )
      ),
      id: (coid: string) => ({
        read: secure(() =>
          api.get<
            { contactOrganisation: ContactOrganisation & WithContact & WithOrganisation },
            WorkspaceErrors | NotFoundErrors
          >(`workspaces/${wid}/contacts/${cid}/organisations/${coid}`)
        ),
        update: secure((payload: Payload.UpdateContactOrganisation) =>
          api.put<{ contactOrganisation: ContactOrganisation }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
            `workspaces/${wid}/contacts/${cid}/organisations/${coid}`,
            { data: payload }
          )
        ),
        delete: secure(() =>
          api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/contacts/${cid}/organisations/${coid}`
          )
        ),
      }),
    },
  }),

  // Organisations CRUD
  organisations: () => ({
    all: secure((query: Query.Organisations = {}) =>
      api.get<{ organisations: Organisation[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/organisations`, query))
    ),
    rootIndex: secure(() =>
      api.get<{ organisations: Organisation[] }, WorkspaceErrors>(`workspaces/${wid}/organisations/root`)
    ),
    create: secure((payload: Payload.CreateOrganisation) =>
      api.post<{ organisation: Organisation }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/organisations`, {
        data: payload,
      })
    ),
    id: (oid: string) => ({
      read: secure(() =>
        api.get<
          {
            organisation: Organisation &
              WithOrganisationCategories &
              WithParentOrganisation &
              WithChildOrganisations
          },
          WorkspaceErrors | NotFoundErrors
        >(`workspaces/${wid}/organisations/${oid}`)
      ),
      update: secure((payload: Payload.UpdateOrganisation) =>
        api.put<{ organisation: Organisation }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
          `workspaces/${wid}/organisations/${oid}`,
          { data: payload }
        )
      ),
      create: secure((payload: Payload.CreateOrganisation) =>
        api.post<{ organisation: Organisation }, WorkspaceErrors | ValidationErrors>(
          `workspaces/${wid}/organisations/${oid}/organisations`,
          {
            data: payload,
          }
        )
      ),
      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/organisations/${oid}`)
      ),
    }),

    // Organisations Categories CRUD
    categories: () => ({
      all: secure((query: Query.OrganisationsCategories = {}) =>
        api.get<{ categories: OrganisationCategory[] }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/organisations/categories`, query)
        )
      ),
      create: secure((payload: Payload.CreateOrganisationCategory) =>
        api.post<{ category: OrganisationCategory }, WorkspaceErrors | ValidationErrors>(
          `workspaces/${wid}/organisations/categories`,
          { data: payload }
        )
      ),
      id: (cid: string) => ({
        read: secure(() =>
          api.get<{ category: OrganisationCategory }, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/organisations/categories/${cid}`
          )
        ),
        update: secure((payload: Payload.UpdateOrganisationCategory) =>
          api.put<{ category: OrganisationCategory }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
            `workspaces/${wid}/organisations/categories/${cid}`,
            { data: payload }
          )
        ),
        delete: secure((cid: string) =>
          api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/organisations/categories/${cid}`)
        ),
      }),
    }),
  }),
})
