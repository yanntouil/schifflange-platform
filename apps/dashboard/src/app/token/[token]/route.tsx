import { authDialogTabToSearchParams } from "@/features/auth"
import { login } from "@/features/auth/store/actions"
import PublicLayout from "@/layouts/public"
import { service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { match } from "ts-pattern"
import { Redirect, Route } from "wouter"
import dashboardRouteTo from "../../dashboard"
import Page from "./page"

export const TokenRoute: React.FC = () => {
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

  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token) return

      const result = await service.auth.verifyToken({ token })
      if (result.ok) {
        // login the user with the new data (maybe user was already logged in with another account|session)
        login(result.data)
        setTokenType(result.data.type)
        setStatus("token-valid")

        // Show appropriate toast based on token type
        match(result.data.type)
          .with("register", "invitation-register", () => Ui.toast.success(_("account-activated")))
          .with("email-change", "invitation-email-change", () => Ui.toast.success(_("email-changed")))
          .with("password-reset", "invitation-password-reset", () =>
            Ui.toast.success(_("password-reset"), { duration: Infinity, closeButton: true })
          )
          .otherwise(() => {})

        // Trigger redirect after a short delay
        setTimeout(() => setRedirectReady(true), 2000)
      } else if (result.except?.name === "E_TOKEN_EXPIRED") {
        setStatus("token-expired")
      } else {
        setStatus("token-invalid")
      }
    }

    verifyToken()
  }, [token, _])

  // Redirect to dashboard with appropriate dialog after successful verification
  if (redirectReady && tokenType) {
    const linkTo = match(tokenType)
      .with("password-reset", "invitation-password-reset", () => {
        const params = authDialogTabToSearchParams({ type: "authentication", params: {} })
        return `${dashboardRouteTo()}?${params.toString()}`
      })
      .otherwise(() => dashboardRouteTo())
    return <Redirect to={linkTo} />
  }

  return <Page status={status} />
}

/**
 * translations
 */
const dictionary = {
  en: {
    "account-activated": "Email verified! Welcome to your dashboard 🎉",
    "email-changed": "Your email address has been successfully updated.",
    "password-reset": "You're now signed in. Please set a new password in your account settings.",
  },
  fr: {
    "account-activated": "Email vérifié ! Bienvenue sur votre tableau de bord 🎉",
    "email-changed": "Votre adresse email a été mise à jour avec succès.",
    "password-reset": "Vous êtes maintenant connecté. Veuillez définir un nouveau mot de passe dans vos paramètres.",
  },
  de: {
    "account-activated": "E-Mail verifiziert! Willkommen in Ihrem Dashboard 🎉",
    "email-changed": "Ihre E-Mail-Adresse wurde erfolgreich aktualisiert.",
    "password-reset": "Sie sind jetzt angemeldet. Bitte legen Sie ein neues Passwort in Ihren Kontoeinstellungen fest.",
  },
}
