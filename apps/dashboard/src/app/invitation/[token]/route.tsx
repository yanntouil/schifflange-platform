import { useDashboardRoute } from "@/app/dashboard"
import PublicLayout from "@/layouts/public"
import { Payload, service } from "@/services"
import { match } from "@compo/utils"
import React from "react"
import { Redirect, Route } from "wouter"
import { PageError } from "./error"
import { PageLoading } from "./loading"
import { PageLogin } from "./login"
import { PageRefuse } from "./refuse"
import { PageRegister } from "./register"

export const InvitationRoute: React.FC = () => {
  const [isAuthenticated, redirectRoute] = useDashboardRoute()
  if (isAuthenticated) {
    return <Redirect to={redirectRoute} />
  }
  return (
    <PublicLayout>
      <Route path="/accept/:token">{({ token }) => <TokenRouteWrapper token={token} />}</Route>
      <Route path="/refuse/:token">{({ token }) => <PageRefuse token={token} />}</Route>
    </PublicLayout>
  )
}
const TokenRouteWrapper: React.FC<{ token: string }> = ({ token }) => {
  const [status, setStatus] = React.useState<"loading" | "login" | "register" | "token-expired" | "token-invalid">("loading")
  const [invitation, setInvitation] = React.useState<Payload.Workspaces.PublicInvitation | null>(null)

  React.useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        const result = await service.workspaces.invitations.read({ token })
        if (result.ok) {
          setInvitation(result.data.invitation)
          if (result.data.invitation.userExist) return setStatus("login")
          else return setStatus("register")
        }
        if (result.except?.name === "E_TOKEN_EXPIRED") return setStatus("token-expired")
      }
      return setStatus("token-invalid")
    }

    verifyToken()
  }, [token])

  // Otherwise, show the appropriate accept page
  return match(status)
    .with("loading", () => <PageLoading />)
    .with("token-expired", "token-invalid", (status) => <PageError error={status} />)
    .with("login", () => <PageLogin invitation={invitation as Payload.Workspaces.PublicInvitation} token={token} />)
    .with("register", () => <PageRegister invitation={invitation as Payload.Workspaces.PublicInvitation} token={token} />)
    .exhaustive()
}
