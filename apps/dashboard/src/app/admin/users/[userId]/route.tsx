import React from "react"
import Page from "./page"

export const AdminUsersIdRoute: React.FC<{ userId: string }> = ({ userId }) => {
  return <Page userId={userId} />
}
