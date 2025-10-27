import { type CreateApi } from "../../api"
import { pins } from "../../pins"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import * as Payload from "./payload"
import * as Query from "./payload"
import {
  Contact,
  ContactOrganisation,
  ContactWithRelations,
  Organisation,
  OrganisationCategory,
  OrganisationWithRelations,
} from "./types"

export const directory = (api: CreateApi, secure: Secure, wid: string) => ({
  // Contacts CRUD
  all: secure((query: Query.Contacts = {}) =>
    api.get<{ contacts: Contact[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/contacts`, query))
  ),
  create: secure((payload: Payload.CreateContact) =>
    api.transaction<{ contact: ContactWithRelations }, WorkspaceErrors | ValidationErrors>(
      `workspaces/${wid}/contacts`,
      {
        data: payload,
        method: "POST",
      }
    )
  ),

  id: (cid: string) => ({
    read: secure(() =>
      api.get<{ contact: ContactWithRelations }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/contacts/${cid}`)
    ),
    update: secure((payload: Payload.UpdateContact) =>
      api.transaction<{ contact: ContactWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/contacts/${cid}`,
        { data: payload, method: "PUT" }
      )
    ),
    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/contacts/${cid}`)),
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
          api.get<{ contactOrganisation: ContactOrganisation }, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/contacts/${cid}/organisations/${coid}`
          )
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
  organisations: {
    all: secure((query: Query.Organisations = {}) =>
      api.get<{ organisations: Organisation[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/organisations`, query))
    ),
    rootIndex: secure((query: Query.Organisations = {}) =>
      api.get<{ organisations: Organisation[] }, WorkspaceErrors>(
        appendQS(`workspaces/${wid}/organisations/root`, query)
      )
    ),
    create: secure((payload: Payload.CreateOrganisation) =>
      api.transaction<{ organisation: OrganisationWithRelations }, WorkspaceErrors | ValidationErrors>(
        `workspaces/${wid}/organisations`,
        {
          data: payload,
          method: "POST",
        }
      )
    ),
    pins: pins(api, secure, `workspaces/${wid}/pins/organisations`),
    id: (oid: string) => ({
      read: secure(() =>
        api.get<
          {
            organisation: OrganisationWithRelations
          },
          WorkspaceErrors | NotFoundErrors
        >(`workspaces/${wid}/organisations/${oid}`)
      ),
      update: secure((payload: Payload.UpdateOrganisation) =>
        api.transaction<
          { organisation: OrganisationWithRelations },
          WorkspaceErrors | NotFoundErrors | ValidationErrors
        >(`workspaces/${wid}/organisations/${oid}`, { data: payload, method: "PUT" })
      ),
      create: secure((payload: Payload.CreateOrganisation) =>
        api.transaction<{ organisation: OrganisationWithRelations }, WorkspaceErrors | ValidationErrors>(
          `workspaces/${wid}/organisations/${oid}/organisations`,
          {
            data: payload,
            method: "POST",
          }
        )
      ),
      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/organisations/${oid}`)
      ),
    }),

    // Organisations Categories CRUD
    categories: {
      all: secure((query: Query.OrganisationsCategories = {}) =>
        api.get<{ categories: OrganisationCategory[] }, WorkspaceErrors>(
          appendQS(`workspaces/${wid}/organisations/categories`, query)
        )
      ),
      create: secure((payload: Payload.CreateOrganisationCategory) =>
        api.transaction<{ category: OrganisationCategory }, WorkspaceErrors | ValidationErrors>(
          `workspaces/${wid}/organisations/categories`,
          { data: payload, method: "POST" }
        )
      ),
      id: (cid: string) => ({
        read: secure(() =>
          api.get<{ category: OrganisationCategory }, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/organisations/categories/${cid}`
          )
        ),
        update: secure((payload: Payload.UpdateOrganisationCategory) =>
          api.transaction<{ category: OrganisationCategory }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
            `workspaces/${wid}/organisations/categories/${cid}`,
            { data: payload, method: "PUT" }
          )
        ),
        delete: secure((cid: string) =>
          api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/organisations/categories/${cid}`)
        ),
      }),
    },
  },
})
