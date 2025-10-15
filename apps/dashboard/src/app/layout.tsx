import { authStore } from "@/features/auth"
import GlobalLayout from "@/layouts/global"
import { useSWR } from "@compo/hooks"
import React from "react"

const { revalidateSession } = authStore.actions
/**
 * App Layout
 * this layout provides high level providers use in the app
 */
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  useSWR({
    fetch: revalidateSession,
    key: "auth-session",
  })
  return <GlobalLayout key="global-layout">{children}</GlobalLayout>
}

export default Layout
