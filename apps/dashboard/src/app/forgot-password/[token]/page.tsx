import { useAuthStore } from "@/features/auth"
import { service } from "@/services"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { Check, X } from "lucide-react"
import React from "react"
import { useTitle } from "react-use"
import { Link, useLocation } from "wouter"
import dashboardRouteTo from "../../dashboard"
import signInRouteTo from "../../sign-in"
import { FormPassword } from "./password"

type PageProps = {
  status: "loading" | "token-valid" | "token-expired" | "token-invalid"
  tokenType: string | null
}

/**
 * Forgot Password Token page
 */
const Page: React.FC<PageProps> = ({ status, tokenType }) => {
  const { _ } = useTranslation(dictionary)
  useTitle(_("page-title"))
  const isAuthenticated = useAuthStore(D.prop("isAuthenticated"))
  const isPasswordReset = tokenType?.includes("password-reset") ?? false

  return (
    <Ui.Card.Root className="w-full max-w-md">
      <Ui.Card.Header className="text-center">
        {match(status)
          .with("loading", () => (
            <>
              <div className="mb-4 flex justify-center">
                <Ui.SpinIcon className="text-primary size-8" />
              </div>
              <Ui.Card.Title>{_("loading-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_("loading-description")}</Ui.Card.Description>
            </>
          ))
          .with("token-valid", () => (
            <>
              <div className="mb-4 flex justify-center">
                <div className="bg-success/10 flex size-12 items-center justify-center rounded-full">
                  <Check className="text-success size-6" />
                </div>
              </div>
              <Ui.Card.Title className="text-success">{isPasswordReset ? _("password-reset-title") : _("success-title")}</Ui.Card.Title>
              <Ui.Card.Description>{isPasswordReset ? <PasswordResetForm /> : _("success-description")}</Ui.Card.Description>
            </>
          ))
          .with("token-expired", "token-invalid", () => (
            <>
              <div className="mb-4 flex justify-center">
                <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
                  <X className="text-destructive size-6" />
                </div>
              </div>
              <Ui.Card.Title className="text-destructive">{_("error-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_(status)}</Ui.Card.Description>
            </>
          ))
          .exhaustive()}
      </Ui.Card.Header>

      {match(status)
        .with("token-valid", () => {
          if (isPasswordReset) {
            return null // Password reset form handles the footer
          }
          return (
            <Ui.Card.Footer>
              <Link className={Ui.buttonVariants({ className: "w-full" })} to={dashboardRouteTo()}>
                {_("go-to-dashboard")}
              </Link>
            </Ui.Card.Footer>
          )
        })
        .with("token-expired", "token-invalid", () => (
          <Ui.Card.Footer>
            {isAuthenticated ? (
              <Link className={Ui.buttonVariants({ className: "w-full" })} to={dashboardRouteTo()}>
                {_("go-to-dashboard")}
              </Link>
            ) : (
              <Link className={Ui.buttonVariants({ className: "w-full" })} to={signInRouteTo()}>
                {_("sign-in")}
              </Link>
            )}
          </Ui.Card.Footer>
        ))
        .with("loading", () => null)
        .exhaustive()}
    </Ui.Card.Root>
  )
}

export default Page

/**
 * PasswordResetForm
 */
const PasswordResetForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const form = useForm({
    values: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ values }) => {
      if (values.password !== values.confirmPassword) return _("passwords-dont-match")
      match(await service.auth.update({ password: values.password }))
        .with({ ok: true }, () => {
          Ui.toast.success(_("password-updated"))
          navigate(dashboardRouteTo())
        })
        .otherwise(() => {
          Ui.toast.error(_("password-update-failed"))
        })
    },
  })
  const isDisabled = !form.values.password || !form.values.confirmPassword || form.values.password !== form.values.confirmPassword

  return (
    <Form.Root form={form} className="mt-4 space-y-8">
      <FormPassword />
      <Form.Submit className="w-full" disabled={isDisabled}>
        {_("update-password")}
      </Form.Submit>
    </Form.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "page-title": "Schifflange Dashboard - Reset Password",
    "loading-title": "Processing Your Reset Link",
    "loading-description": "Please wait while we verify your password reset request...",
    "success-title": "Success!",
    "success-description": "Authentication complete. Redirecting to your dashboard...",
    "password-reset-title": "Set New Password",
    "error-title": "Link Processing Failed",
    "token-invalid":
      "This password reset link is invalid or has already been used. Password reset links are single-use only. Please request a new password reset if needed.",
    "token-expired":
      "This password reset link has expired. For security reasons, links are only valid for a limited time. Please request a new password reset.",
    "sign-in": "Go to Sign In",
    "go-to-dashboard": "Continue to Dashboard",
    "update-password": "Update Password",
    "passwords-dont-match": "Passwords don't match",
    "password-updated": "Password updated successfully!",
    "password-update-failed": "Failed to update password. Please try again.",
  },
  fr: {
    "page-title": "Schifflange Dashboard - Réinitialisation de mot de passe Token",
    "loading-title": "Traitement de votre lien de réinitialisation",
    "loading-description": "Veuillez patienter pendant la vérification de votre demande de réinitialisation...",
    "success-title": "Succès !",
    "success-description": "Authentification réussie. Redirection vers votre tableau de bord...",
    "password-reset-title": "Définir un nouveau mot de passe",
    "error-title": "Échec du traitement du lien",
    "token-invalid":
      "Ce lien de réinitialisation est invalide ou a déjà été utilisé. Les liens de réinitialisation sont à usage unique. Veuillez demander une nouvelle réinitialisation si nécessaire.",
    "token-expired":
      "Ce lien de réinitialisation a expiré. Pour des raisons de sécurité, les liens ne sont valides que pour une durée limitée. Veuillez demander une nouvelle réinitialisation.",
    "sign-in": "Aller à la connexion",
    "go-to-dashboard": "Continuer vers le tableau de bord",
    "update-password": "Mettre à jour le mot de passe",
    "passwords-dont-match": "Les mots de passe ne correspondent pas",
    "password-updated": "Mot de passe mis à jour avec succès !",
    "password-update-failed": "Échec de la mise à jour du mot de passe. Veuillez réessayer.",
  },
  de: {
    "page-title": "Schifflange Dashboard - Passwort-Reset",
    "loading-title": "Ihr Reset-Link wird verarbeitet",
    "loading-description": "Bitte warten Sie, während wir Ihre Passwort-Reset-Anfrage verifizieren...",
    "success-title": "Erfolg!",
    "success-description": "Authentifizierung abgeschlossen. Weiterleitung zu Ihrem Dashboard...",
    "password-reset-title": "Neues Passwort festlegen",
    "error-title": "Link-Verarbeitung fehlgeschlagen",
    "token-invalid":
      "Dieser Passwort-Reset-Link ist ungültig oder wurde bereits verwendet. Passwort-Reset-Links können nur einmal verwendet werden. Bitte fordern Sie bei Bedarf einen neuen Passwort-Reset an.",
    "token-expired":
      "Dieser Passwort-Reset-Link ist abgelaufen. Aus Sicherheitsgründen sind Links nur für begrenzte Zeit gültig. Bitte fordern Sie einen neuen Passwort-Reset an.",
    "sign-in": "Zur Anmeldung",
    "go-to-dashboard": "Weiter zum Dashboard",
    "update-password": "Passwort aktualisieren",
    "passwords-dont-match": "Passwörter stimmen nicht überein",
    "password-updated": "Passwort erfolgreich aktualisiert!",
    "password-update-failed": "Passwort-Update fehlgeschlagen. Bitte versuchen Sie es erneut.",
  },
}
