import { Address, ExtraField } from "../types"

export type Login = {
  email: string
  password: string
  remember?: boolean
}
export type Register = {
  email: string
  password: string
}
export type VerifyToken = {
  token: string
}
export type Update = {
  email?: string
  password?: string
}
export type ForgotPassword = {
  email: string
}
export type UpdateProfile = {
  image?: File | null
  address?: Address
  dob?: string | null
  firstname?: string
  lastname?: string
  position?: string
  company?: string
  emails?: ExtraField[]
  phones?: ExtraField[]
  extras?: ExtraField[]
}
