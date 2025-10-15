import { authDialogTabToSearchParams } from "@/features/auth"
import { login } from "@/features/auth/store/actions"
import { service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { Redirect, Route } from "wouter"
import dashboardRouteTo from "../../dashboard"
import Page from "./page"

export const RegisterTokenRoute: React.FC = () => {
  return <Route path="/:token">{({ token }) => <TokenRouteWrapper token={token} />}</Route>
}

const TokenRouteWrapper: React.FC<{ token: string }> = ({ token }) => {
  const { _ } = useTranslation(dictionary)
  const [status, setStatus] = React.useState<"loading" | "token-valid" | "token-expired" | "token-invalid">("loading")
  const [redirectReady, setRedirectReady] = React.useState(false)

  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token) return setStatus("token-invalid")

      const result = await service.auth.verifyToken({ token })
      if (result.ok) {
        // Login the user with the new data
        login(result.data)
        setStatus("token-valid")

        // Show success toast and redirect after a short delay
        Ui.toast.success(_("account-activated"), { duration: Infinity, closeButton: true })

        setTimeout(() => setRedirectReady(true), 2000)
      } else if (result.except?.name === "E_TOKEN_EXPIRED") {
        setStatus("token-expired")
      } else {
        setStatus("token-invalid")
      }
    }

    verifyToken()
  }, [token, _])

  // Redirect to dashboard with profile dialog open after successful verification
  if (redirectReady) {
    const params = authDialogTabToSearchParams({ type: "profile", params: {} })
    return <Redirect to={`${dashboardRouteTo()}?${params.toString()}`} />
  }

  return <Page status={status} />
}

/**
 * translations
 */
const dictionary = {
  en: {
    "account-activated": "Email verified! Welcome to your dashboard 🎉",
  },
  fr: {
    "account-activated": "Email vérifié ! Bienvenue sur votre tableau de bord 🎉",
  },
  de: {
    "account-activated": "E-Mail verifiziert! Willkommen in Ihrem Dashboard 🎉",
  },
}
