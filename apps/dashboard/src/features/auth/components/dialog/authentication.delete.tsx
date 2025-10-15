import signInRouteTo from "@/app/sign-in"
import { authStore, useAuth } from "@/features/auth"
import { service } from "@/services"
import { Form, FormRoot, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { useLocation } from "wouter"

/**
 * AuthDialogAuthenticationDelete
 * this component is used to manage account deletion in the auth dialog authentication tab
 */
export const AuthDialogAuthenticationDelete: React.FC<{}> = () => {
  const { _ } = useTranslation(dictionary)
  const [open, onOpenChange] = React.useState(false)
  return (
    <Ui.Dialog.Root {...{ open, onOpenChange }}>
      <div className="flex items-center justify-between gap-6" data-slot="auth-field">
        <div>
          <Ui.Hn level={3} className="text-destructive text-sm font-medium dark:text-red-500">
            {_("label")}
          </Ui.Hn>
          <p className="text-muted-foreground text-xs">{_("description")}</p>
        </div>
        <div>
          <Ui.Dialog.Trigger asChild>
            <Ui.Button variant="outline-destructive" size="sm">
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
  const form = useForm({
    values: {
      email: "",
    },
    onSubmit: async ({ values }) => {
      if (values.email.toLowerCase() === me.email.toLowerCase()) {
        await service.auth.delete()
        await authStore.actions.logout()
        navigate(signInRouteTo())
      }
      return onOpenChange(false)
    },
  })

  // display form if the email is not updated
  return (
    <FormRoot form={form} className="space-y-6">
      <Form.Input name="email" label={_("dialog.email-label")} placeholder={me.email} />
      <Ui.Dialog.Footer>
        <Ui.Button className="w-full" variant="destructive" type="submit">
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
    label: "Delete account",
    button: "Delete account",
    description: "You will delete your account and access to all your workspaces.",
    dialog: {
      title: "Delete your entire account?",
      description: "You will delete your account. You will be removed from all shared workspaces.",
      "email-label": "Enter your email to confirm",
      submit: "Delete account",
    },
  },
  fr: {
    label: "Supprimer le compte",
    button: "Supprimer le compte",
    description: "Vous supprimerez le compte ainsi que l’accès à tous les espaces de travail.",
    dialog: {
      title: "Supprimer l’intégralité de votre compte ?",
      description: "L’intégralité de votre compte sera supprimé. Vous serez également supprimé(e) de tous les espaces de travail partagés.",
      "email-label": "Tapez votre adresse e-mail pour confirmer",
      submit: "Supprimer le compte",
    },
  },
  de: {
    label: "Konto löschen",
    button: "Konto löschen",
    description: "Sie werden Ihr Konto und den Zugriff auf alle Ihre Arbeitsbereiche löschen.",
    dialog: {
      title: "Ihr gesamtes Konto löschen?",
      description: "Ihr gesamtes Konto wird gelöscht. Sie werden auch aus allen geteilten Arbeitsbereichen entfernt.",
      "email-label": "Geben Sie Ihre E-Mail-Adresse ein, um zu bestätigen",
      submit: "Konto löschen",
    },
  },
}
