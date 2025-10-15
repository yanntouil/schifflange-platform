import signInRouteTo from "@/app/sign-in"
import { authStore, useAuth } from "@/features/auth"
import { service } from "@/services"
import { Form, FormRoot, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match, S } from "@compo/utils"
import React from "react"
import { useLocation } from "wouter"

/**
 * AuthDialogAuthenticationPassword
 * this component is used to manage password update in the auth dialog authentication tab
 */
export const AuthDialogAuthenticationPassword: React.FC<{}> = () => {
  const { _ } = useTranslation(dictionary)
  const [open, onOpenChange] = React.useState(false)
  return (
    <Ui.Dialog.Root {...{ open, onOpenChange }}>
      <div className="flex items-center justify-between gap-6" data-slot="auth-field">
        <div>
          <Ui.Hn level={3} className="text-sm font-medium">
            {_("label")}
          </Ui.Hn>
          <p className="text-muted-foreground text-xs">{_("description")}</p>
        </div>
        <div>
          <Ui.Dialog.Trigger asChild>
            <Ui.Button variant="outline" size="sm">
              {_("button")}
            </Ui.Button>
          </Ui.Dialog.Trigger>
        </div>
      </div>
      <Ui.Dialog.Content className="sm:max-w-lg">
        <Ui.Dialog.Header>
          <Ui.Dialog.Title>{_("dialog.title")}</Ui.Dialog.Title>
          <Ui.Dialog.Description>{_("dialog.description")}</Ui.Dialog.Description>
        </Ui.Dialog.Header>
        <Dialog onOpenChange={onOpenChange} />
      </Ui.Dialog.Content>
    </Ui.Dialog.Root>
  )
}

const Dialog: React.FC<{ onOpenChange: (open: boolean) => void }> = ({ onOpenChange }) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const [, navigate] = useLocation()
  const [updated, setUpdated] = React.useState(false)
  const form = useForm({
    values: {
      password: "",
    },
    onSubmit: async ({ values }) => {
      if (S.isEmpty(values.password)) return onOpenChange(false)
      return (
        match(await service.auth.update({ password: values.password }))
          .with({ ok: true }, () => setUpdated(true))
          // all errors can only be handle if the user account is invalid or not authenticated
          .otherwise(async () => {
            await authStore.actions.logout()
            navigate(signInRouteTo())
          })
      )
    },
  })

  // display success message if the password is updated
  if (updated) {
    return (
      <>
        <p className="py-2 text-sm/relaxed">{_("dialog.password-updated")}</p>
        <Ui.Dialog.Footer>
          <Ui.Button className="w-full" onClick={() => onOpenChange(false)}>
            {_("dialog.close")}
          </Ui.Button>
        </Ui.Dialog.Footer>
      </>
    )
  }

  // display form if the email is not updated
  return (
    <FormRoot form={form} className="space-y-6 pt-2">
      <Form.Password name="password" label={_("dialog.password-label")} />
      <Ui.Dialog.Footer>
        <Ui.Button className="w-full" type="submit">
          {_("dialog.submit")}
        </Ui.Button>
      </Ui.Dialog.Footer>
    </FormRoot>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    label: "Password",
    button: "Change password",
    description: "Change password used to connect to your account.",
    dialog: {
      title: "Change password",
      description: "Change password used to connect to your account.",
      "password-label": "Enter a new password",
      "password-updated": "Your password has been updated, don't forget to use it to connect to your account on your next login.",
      submit: "Continue",
      close: "Close",
    },
  },
  fr: {
    label: "Mot de passe",
    button: "Modifier le mot de passe",
    description: "Modifier le mot de passe utilisé pour se connecter à votre compte.",
    dialog: {
      title: "Modifier le mot de passe",
      description: "Modifier le mot de passe utilisé pour se connecter à votre compte.",
      "password-label": "Entrez un nouveau mot de passe",
      "password-updated": "Votre mot de passe a été mis à jour, n'oubliez pas de l'utiliser lors de votre prochaine connexion.",
      submit: "Continuer",
      close: "Fermer",
    },
  },
  de: {
    label: "Passwort",
    button: "Passwort ändern",
    description: "Das Passwort für die Anmeldung bei Ihrem Konto ändern.",
    dialog: {
      title: "Passwort ändern",
      description: "Das Passwort für die Anmeldung bei Ihrem Konto ändern.",
      "password-label": "Neues Passwort eingeben",
      "password-updated": "Ihr Passwort wurde aktualisiert. Vergessen Sie nicht, es bei Ihrer nächsten Anmeldung zu verwenden.",
      submit: "Fortfahren",
      close: "Schließen",
    },
  },
}
