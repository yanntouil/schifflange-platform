import { Address, ExtraField, SingleImage } from "../types"

/**
 * users
 */
export type User = {
  id: string
  profile: UserProfile
}
export type UserProfile = {
  firstname: string
  lastname: string
  image: SingleImage | null
  dob: string | null
  position: string
  company: string
  phones: ExtraField[]
  emails: ExtraField[]
  address: Address
  extras: ExtraField[]
}
