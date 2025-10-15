import { useDashboardRoute } from "@/app/dashboard"
import PublicLayout from "@/layouts/public"
import React from "react"
import { Redirect } from "wouter"
import Page from "./page"

export const SignInRoute: React.FC = () => {
  const [isAuthenticated, redirectRoute] = useDashboardRoute()
  if (isAuthenticated) {
    return <Redirect to={redirectRoute} />
  }
  return (
    <PublicLayout>
      <Page />
    </PublicLayout>
  )
}
