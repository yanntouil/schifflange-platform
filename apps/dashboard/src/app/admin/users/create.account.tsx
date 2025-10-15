import { Api, Payload, service } from "@/services"
import { Form, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D } from "@compo/utils"
import { UserPlus2 } from "lucide-react"
import React from "react"
import { AccountForm } from "./form.account"

const { isEmail, minOrEqual, regex } = validator

/**
 * Admin users create account form
 */
export const Account: React.FC<{ onCreate: (user: Api.Admin.User) => void }> = ({ onCreate }) => {
  const { _ } = useTranslation(dictionary)
  const initialValues = {
    email: "",
    password: "",
    role: "member" as Api.UserRole,
    status: "active" as Api.UserStatus,
  }

  const [emails, setEmails] = React.useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm({
    allowSubmitAttempt: true,
    allowErrorSubmit: true,
    values: initialValues,
    validate: validator({
      email: [isEmail(_("email-format")), (value) => (D.get(emails, value) ? _("email-unique") : null)],
      password: [minOrEqual(8, 0, _("password-length"))],
    }),
    onSubmit: async ({ values, isValid }) => {
      if (!isValid) return _("error-validation-failure")
      const payload: Payload.Admin.Users.Store = {
        email: values.email,
        password: values.password || undefined,
        role: values.role,
        status: values.status,
      }

      setIsLoading(true)
      const result = await service.admin.users.store(payload)
      setIsLoading(false)

      return match(result)
        .with({ ok: true }, ({ data }) => {
          onCreate(data.user)
          Ui.toast.success(_("created"))
        })
        .otherwise(({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("error-validation-failure"))
            .otherwise(() => _("error-unknown"))
        )
    },
  })

  // check if email is unique
  React.useEffect(() => {
    if (regex.mail.test(form.values.email) && !D.get(emails, form.values.email)) {
      service.admin.users
        .emailExists(form.values.email)
        .then(({ ok, data }) => ok && setEmails((prev) => D.set(prev, form.values.email, data.exists)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.email])

  return (
    <Ui.QuickDialogContent title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-screen-sm" }} sticky>
      <Form.Root form={form} className="space-y-6">
        <Form.Assertive />
        <AccountForm />
        <Ui.QuickDialogStickyFooter>
          <Ui.Button type="submit">
            <UserPlus2 aria-hidden />
            {_("create")}
          </Ui.Button>
        </Ui.QuickDialogStickyFooter>
        <Form.Loading loading={isLoading} label={_("loading")} className="z-10" />
      </Form.Root>
    </Ui.QuickDialogContent>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Compte",
    description: "Configurez les informations de connexion de l'utilisateur.",
    "email-unique": "Cet email est déjà utilisé.",
    "email-format": "L'email doit être dans un format valide.",
    "password-length": "Le mot de passe doit contenir au moins 8 caractères.",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessous.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
    create: "Créer l'utilisateur",
    loading: "Création du compte est en cours",
    created: "Compte créé avec succès",
  },
  en: {
    title: "Create a new account",
    description: "Set up the user's access and permissions to get started quickly.",
    "email-unique": "This email is already used.",
    "email-format": "The email must be in a valid format.",
    "password-length": "The password must contain at least 8 characters.",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
    create: "Create user",
    loading: "Account creation is in progress",
    created: "Account created successfully",
  },
  de: {
    title: "Neues Konto erstellen",
    description: "Richten Sie Zugang und Berechtigungen des Benutzers ein, um schnell zu starten.",
    "email-unique": "Diese E-Mail-Adresse wird bereits verwendet.",
    "email-format": "Die E-Mail-Adresse muss in einem gültigen Format vorliegen.",
    "password-length": "Das Passwort muss mindestens 8 Zeichen enthalten.",
    "error-validation-failure": "Bitte überprüfen Sie die obigen Felder.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    create: "Benutzer erstellen",
    loading: "Kontoerstellung ist in Bearbeitung",
    created: "Konto erfolgreich erstellt",
  },
}
