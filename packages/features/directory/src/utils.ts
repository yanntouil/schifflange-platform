import { trimSpaces } from "@compo/utils"
import { OrganisationAddress } from "@services/dashboard/src/types"

/**
 * makeAddress
 * make a string address from an OrganisationAddress
 */
export const makeAddress = (address: OrganisationAddress) =>
  trimSpaces(`${address.street} ${address.postalCode} ${address.city} ${address.country}`)
