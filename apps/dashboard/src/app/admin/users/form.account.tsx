import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import React from "react"
import { FormRole } from "./form.roles"
import { FormStatus } from "./form.status"

/**
 * display user account form to update user account or create a new one
 */
export const AccountForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <Form.Input
        name="email"
        label={_(`email-label`)}
        placeholder={_(`email-placeholder`)}
        labelAside={<Form.Info title={_(`email-label`)} content={_(`email-info`)} />}
      />
      <Form.Password
        name="password"
        label={_(`password-label`)}
        placeholder={_(`password-placeholder`)}
        labelAside={<Form.Info title={_(`password-label`)} content={_(`password-info`)} />}
      />
      <FormRole name="role" label={_(`role-label`)} labelAside={<Form.Info title={_(`role-label`)} content={_(`role-info`)} />} />
      <FormStatus name="status" label={_(`status-label`)} labelAside={<Form.Info title={_(`status-label`)} content={_(`status-info`)} />} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "email-label": "Email address",
    "email-info": "Used for login and receiving important notifications.",
    "email-placeholder": "name@example.com",
    "password-label": "Password",
    "password-placeholder": "••••••••••••",
    "password-info": "Must be at least 8 characters to ensure account security.",
    "role-label": "User role",
    "role-info": "Determines what the user can access and manage.",
    "status-label": "Account status",
    "status-info": "Enable or disable this user’s access to the platform.",
  },
  fr: {
    "email-label": "Adresse email",
    "email-info": "Utilisée pour se connecter et recevoir les notifications importantes.",
    "password-label": "Mot de passe",
    "password-info": "Doit contenir au moins 8 caractères pour garantir la sécurité du compte.",
    "role-label": "Rôle de l’utilisateur",
    "role-info": "Définit les accès et permissions dans l’application.",
    "status-label": "Statut du compte",
    "status-info": "Activez ou désactivez l’accès de cet utilisateur à la plateforme.",
  },
  de: {
    "email-label": "E-Mail-Adresse",
    "email-info": "Wird für die Anmeldung und wichtige Benachrichtigungen verwendet.",
    "email-placeholder": "name@beispiel.de",
    "password-label": "Passwort",
    "password-info": "Muss mindestens 8 Zeichen lang sein, um die Kontensicherheit zu gewährleisten.",
    "role-label": "Benutzerrolle",
    "role-info": "Legt die Zugriffsrechte und Berechtigungen in der Anwendung fest.",
  },
}
