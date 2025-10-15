import signInRouteTo from "@/app/sign-in"
import { authStore, useAuth } from "@/features/auth"
import { service } from "@/services"
import { Form, FormRoot, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { useLocation } from "wouter"

/**
 * AuthDialogAuthenticationEmail
 * this component is used to manage email update in the auth dialog authentication tab
 */
export const AuthDialogAuthenticationEmail: React.FC<{}> = () => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const [open, onOpenChange] = React.useState(false)
  return (
    <Ui.Dialog.Root {...{ open, onOpenChange }}>
      <div className="flex items-center justify-between gap-6" data-slot="auth-field">
        <div>
          <Ui.Hn level={3} className="text-sm font-medium">
            {_("label")}
          </Ui.Hn>
          <p className="text-muted-foreground text-xs">{me.email}</p>
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
  const [error, setError] = React.useState<string | undefined>(undefined)
  const { min, isEmail } = validator
  const form = useForm({
    values: {
      email: me.email,
    },
    validate: validator({
      email: [min(1, _("dialog.email-required")), isEmail(_("dialog.email-invalid"))],
    }),
    onSubmit: async ({ values }) => {
      if (values.email.toLowerCase() === me.email.toLowerCase()) {
        return onOpenChange(false)
      }
      return match(await service.auth.update({ email: values.email }))
        .with({ ok: true }, () => setUpdated(true))
        .otherwise(({ except }) =>
          match(except)
            // this error can only be handle if the email is already in use by another account
            .with({ name: "E_VALIDATION_FAILURE" }, () => {
              setError(_("dialog.email-already-used"))
            })
            // all other errors can be handle if the user account is invalid or not authenticated
            .otherwise(async () => {
              await authStore.actions.logout()
              navigate(signInRouteTo())
            })
        )
    },
  })

  // display success message if the email is updated
  if (updated) {
    return (
      <>
        <p className="py-2 text-sm/relaxed">{_("dialog.email-updated")}</p>
        <Ui.Dialog.Footer>
          <Ui.Button className="w-full" onClick={() => onOpenChange(false)}>
            {_("dialog.close")}
          </Ui.Button>
        </Ui.Dialog.Footer>
      </>
    )
  }

  // display error message if the email is already in use by another account
  if (error) {
    return (
      <>
        <p className="py-2 text-sm/relaxed">{error}</p>
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
      <Form.Input name="email" label={_("dialog.email-label")} />
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
    label: "Email",
    button: "Change email",
    dialog: {
      title: "Change email",
      description: "Change email used to connect your account.",
      "email-label": "Enter your new email",
      "email-required": "You must enter an email to continue",
      "email-invalid": "This email is invalid",
      "email-already-used":
        "This email is already in use by another account. Please use a different email address or delete other account before updating your email.",
      "email-updated": "You will receive an email to confirm your new email address. the change will be effective after confirmation.",
      submit: "Continue",
      close: "Close",
    },
  },
  fr: {
    label: "Email",
    button: "Modifier l'email",
    dialog: {
      title: "Modifier l'email",
      description: "Modifier l'email utilisé pour se connecter à votre compte.",
      "email-label": "Entrez votre nouvel email",
      "email-required": "Vous devez entrer un email pour continuer",
      "email-invalid": "Cet email est invalide",
      "email-already-used":
        "Cet email est déjà utilisé par un autre compte. Veuillez utiliser un autre email ou supprimer un autre compte avant de mettre à jour votre email.",
      "email-updated": "Vous recevrez un email pour confirmer votre nouvel email. Le changement sera effective après confirmation.",
      submit: "Continuer",
      close: "Fermer",
    },
  },
  de: {
    label: "Email",
    button: "Email ändern",
    dialog: {
      title: "Email ändern",
      description: "Email ändern",
    },
    "email-label": "Email eingeben",
    "email-required": "Sie müssen eine Email eingeben, um fortzufahren",
    "email-invalid": "Diese Email ist ungültig",
    "email-already-used":
      "Diese Email ist bereits in Verwendung. Bitte verwenden Sie eine andere Email oder löschen Sie ein anderes Konto, bevor Sie Ihre Email aktualisieren.",
    "email-updated": "Sie erhalten eine Email, um Ihre neue Email zu bestätigen. Der Wechsel wird erst nach Bestätigung wirksam.",
    submit: "Fortfahren",
    close: "Schließen",
  },
}
