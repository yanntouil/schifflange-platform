import { directory } from "."
import type { ExtraField, SingleImage, Translatable, User } from "../../types"

// contacts
export type Contact = {
  id: string
  workspaceId: string
  portraitImage: SingleImage
  squareImage: SingleImage
  phones: ExtraField[]
  emails: ExtraField[]
  extras: ExtraField[]
  firstName: string
  lastName: string
  politicalParty: string
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
} & Translatable<ContactTranslation>

export type ContactTranslation = {
  languageId: string
  description: string
  biography: string
}

export type ContactWithRelations = Contact & {
  contactOrganisations: (ContactOrganisation & { organisation: Organisation })[]
}

// contact organisations
export type ContactOrganisation = {
  id: string
  contactId: string
  organisationId: string
  organisation: Organisation
  contact: Contact
  phones: ExtraField[]
  emails: ExtraField[]
  extras: ExtraField[]
  isPrimary: boolean
  isResponsible: boolean
  order: number // order in organisation list
  startDate: string | null // iso date
  endDate: string | null // iso date
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
} & Translatable<ContactOrganisationTranslation>

export type ContactOrganisationTranslation = {
  languageId: string
  role: string
  roleDescription: string
}

export type WithContact = {
  contact: Contact
}

export type WithOrganisation = {
  organisation: Organisation
}

// organisations
export type Organisation = {
  id: string
  workspaceId: string
  type: OrganisationType
  parentOrganisationId: string | null
  contactCount: number
  logoImage: SingleImage
  cardImage: SingleImage
  phones: ExtraField[]
  emails: ExtraField[]
  extras: ExtraField[]
  addresses: OrganisationAddress[]
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
  categories: OrganisationCategory[]
} & Translatable<OrganisationTranslation>

export type OrganisationTranslation = {
  languageId: string
  name: string
  description: string
  shortDescription: string
}

export type WithOrganisationCategories = {
  categories: OrganisationCategory[]
}

export type WithParentOrganisation = {
  parentOrganisation: Organisation | null
}

export type WithChildOrganisations = {
  childOrganisations: Organisation[]
}

export type WithContactOrganisations = {
  contactOrganisations: ContactOrganisation[]
}

export type OrganisationWithRelations = Organisation &
  WithParentOrganisation &
  WithChildOrganisations &
  WithContactOrganisations

// organisation categories
export type OrganisationCategory = {
  id: string
  workspaceId: string
  type: OrganisationType
  order: number
  image: SingleImage
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
} & Translatable<OrganisationCategoryTranslation>

export type OrganisationCategoryTranslation = {
  languageId: string
  title: string
  description: string
}

//
export type WithOrganisations = {
  organisations: Organisation[]
}

export type OrganisationType = "municipality" | "service" | "association" | "commission" | "company" | "other"
export type OrganisationAddress = {
  label: string
  type: "physical" | "postal"
  street: string
  postalCode: string
  city: string
  country: string
}

export type DirectoryService = ReturnType<typeof directory>
