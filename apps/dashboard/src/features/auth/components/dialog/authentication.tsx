import { useTranslation } from "@compo/localize"
import React from "react"
import { AuthDialogAuthenticationDelete } from "./authentication.delete"
import { AuthDialogAuthenticationEmail } from "./authentication.email"
import { AuthDialogAuthenticationPassword } from "./authentication.password"
import { AuthDialogAuthenticationSessions } from "./authentication.sessions"
import { AuthDialogContent } from "./content"
import { AuthDialogHeader } from "./header"

export type AuthDialogTabAuthentication = {
  type: "authentication"
  params: {}
}

/**
 * dialog authentication
 * this component is used to display the authentication tab in the auth dialog
 */
export const AuthDialogAuthentication: React.FC<{ tab: AuthDialogTabAuthentication }> = ({ tab }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <AuthDialogHeader title={_("title")} description={_("description")} sticky />
      <AuthDialogContent>
        <div className="space-y-6">
          <AuthDialogAuthenticationEmail />
          <AuthDialogAuthenticationPassword />
          <AuthDialogAuthenticationDelete />
          <AuthDialogAuthenticationSessions />
        </div>
      </AuthDialogContent>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Account Security",
    description: "Manage your account security settings and preferences.",
  },
  fr: {
    title: "Sécurité du compte",
    description: "Gérer les options de sécurité de votre compte.",
  },
  de: {
    title: "Konto-Sicherheit",
    description: "Verwalten Sie Ihre Konto-Sicherheitseinstellungen und -präferenzen.",
  },
}
