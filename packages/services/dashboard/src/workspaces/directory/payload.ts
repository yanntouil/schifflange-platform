import { ExtraField, MakeRequestOptions } from "../../types"
import { OrganisationAddress, OrganisationType } from "./types"

/**
 * queries
 */
export type Contacts = MakeRequestOptions<
  "createdAt" | "updatedAt",
  {
    organisations?: string[]
  }
>
export type Organisations = MakeRequestOptions<
  "createdAt" | "updatedAt",
  {
    categories?: string[]
    types?: OrganisationType[]
  }
>
export type OrganisationsCategories = MakeRequestOptions<
  "createdAt" | "updatedAt" | "order",
  {
    //
  }
>

/**
 * payloads
 */
export type CreateContact = {
  firstName?: string
  lastName?: string
  politicalParty?: string
  portraitImage?: File | null
  squareImage?: File | null
  phones?: ExtraField[]
  emails?: ExtraField[]
  extras?: ExtraField[]
  translations?: Record<string, { biography?: string; description?: string }>
}

export type UpdateContact = CreateContact

export type CreateOrganisation = {
  type?: OrganisationType
  parentOrganisationId?: string | null
  logoImage?: File | null
  cardImage?: File | null
  phones?: ExtraField[]
  emails?: ExtraField[]
  extras?: ExtraField[]
  addresses?: OrganisationAddress[]
  categoryIds?: string[]
  translations?: Record<string, { name?: string; description?: string; shortDescription?: string }>
}

export type UpdateOrganisation = CreateOrganisation

export type CreateOrganisationCategory = {
  type?: OrganisationType
  order?: number
  image?: File | null
  translations?: Record<string, { title?: string; description?: string }>
}

export type UpdateOrganisationCategory = CreateOrganisationCategory

export type CreateContactOrganisation = {
  organisationId: string
  phones?: Array<{ name: string; value: string; type?: string }>
  emails?: Array<{ name: string; value: string; type?: string }>
  extras?: Array<{ name: string; value: string; type?: string }>
  isPrimary?: boolean
  isResponsible?: boolean
  order?: number
  startDate?: string | null // ISO date or "YYYY-MM-DD"
  endDate?: string | null // ISO date or "YYYY-MM-DD"
  translations?: Record<string, { role?: string; roleDescription?: string }>
}

export type UpdateContactOrganisation = Omit<CreateContactOrganisation, "organisationId">
