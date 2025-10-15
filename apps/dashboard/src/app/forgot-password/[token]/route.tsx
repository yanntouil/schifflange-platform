import { login } from "@/features/auth/store/actions"
import PublicLayout from "@/layouts/public"
import { service } from "@/services"
import { useTranslation } from "@compo/localize"
import React from "react"
import { match } from "ts-pattern"
import { Redirect, Route } from "wouter"
import dashboardRouteTo from "../../dashboard"
import Page from "./page"

export const ForgotPasswordTokenRoute: React.FC = () => {
  return (
    <PublicLayout>
      <Route path="/:token">{({ token }) => <TokenRouteWrapper token={token} />}</Route>
    </PublicLayout>
  )
}

const TokenRouteWrapper: React.FC<{ token: string }> = ({ token }) => {
  const { _ } = useTranslation(dictionary)
  const [status, setStatus] = React.useState<"loading" | "token-valid" | "token-expired" | "token-invalid">("loading")
  const [tokenType, setTokenType] = React.useState<string | null>(null)
  const [redirectReady, setRedirectReady] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)

  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token || isVerifying) return

      setIsVerifying(true)
      try {
        const result = await service.auth.verifyToken({ token })
        if (result.ok) {
          // login the user with the new data (maybe user was already logged in with another account|session)
          login(result.data)
          setTokenType(result.data.type)
          setStatus("token-valid")

          // Show appropriate toast based on token type
          match(result.data.type)
            // .with("password-reset", "invitation-password-reset", () =>
            //   Ui.toast.success(_("password-reset-success"), { duration: Infinity, closeButton: true })
            // )
            .otherwise(() => {})

          // For password reset, don't auto-redirect - let user set new password first
          if (!result.data.type.includes("password-reset")) {
            setTimeout(() => setRedirectReady(true), 2000)
          }
        } else if (result.except?.name === "E_TOKEN_EXPIRED") {
          setStatus("token-expired")
        } else {
          setStatus("token-invalid")
        }
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Redirect to dashboard after successful verification (except for password reset)
  if (redirectReady && tokenType && !tokenType.includes("password-reset")) {
    return <Redirect to={dashboardRouteTo()} />
  }

  return <Page status={status as "loading" | "token-valid" | "token-expired" | "token-invalid"} tokenType={tokenType} />
}

/**
 * translations
 */
const dictionary = {
  en: {
    "password-reset-success": "You're now signed in. Please set a new password below.",
  },
  fr: {
    "password-reset-success": "Vous êtes maintenant connecté. Veuillez définir un nouveau mot de passe ci-dessous.",
  },
  de: {
    "password-reset-success": "Sie sind jetzt angemeldet. Bitte legen Sie unten ein neues Passwort fest.",
  },
}
