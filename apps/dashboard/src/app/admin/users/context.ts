import { Api } from "@/services"
import { Selectable } from "@compo/hooks"
import React from "react"
import { useSwrUsers } from "./swr"

/**
 * types
 */
export type UsersContext = Selectable<{ id: string }> & {
  create: () => void
  display: (value: Api.User) => void
  edit: (value: Api.Admin.User) => void
  editProfile: (value: Api.Admin.User) => void
  delete: (value: string) => void
  deleteSelection: () => void
} & ReturnType<typeof useSwrUsers>

/**
 * contexts
 */
export const UsersContext = React.createContext<UsersContext | null>(null)

/**
 * hooks
 */
export const useUsers = () => {
  const context = React.useContext(UsersContext)
  if (!context) throw new Error("useUsers must be used within a UsersProvider")
  return context
}
