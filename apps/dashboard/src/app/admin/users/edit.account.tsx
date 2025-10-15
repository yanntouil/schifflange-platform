import { authStore } from "@/features/auth"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Api, Payload, service } from "@/services"
import { Form, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, F } from "@compo/utils"
import React from "react"
import { AccountForm } from "./form.account"

const { mutateMe } = authStore.actions

/**
 * dialog use to edit a user account
 */
export const AccountEditDialog: React.FC<Ui.QuickDialogProps<Api.Admin.User>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog {...props} title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-xl" }} sticky>
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * form to edit a user account
 */
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.User>> = ({ mutate = F.identity, item: user, close }) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const isSuperadmin = me.role === "superadmin"
  const isMe = user.id === me.id
  const notEnoughRights = !isSuperadmin && user.role === "superadmin"

  const initialValues = {
    email: user.email,
    password: "",
    role: user.role,
    status: user.status,
  }
  const { isEmail, minOrEqual } = validator
  const [emails, setEmails] = React.useState<string[]>([])
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    disabled: notEnoughRights,
    validate: validator({
      email: [isEmail(_("email-format")), (value) => (A.includes(emails, value) ? _("email-unique") : null)],
      password: [minOrEqual(8, 0, _("password-length"))],
    }),
    onSubmit: async ({ values, setValues }) => {
      // ask for confirmation before changing user role in case user edit his own role
      if (isMe && values.role !== me.role) {
        const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm-change-role") })
        if (!isConfirm) return setValues({ ...values, role: me.role })
      }
      // ask for confirmation before changing user status in case user edit his own status
      if (isMe && values.status !== me.status) {
        const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm-change-status") })
        if (!isConfirm) return setValues({ ...values, status: me.status })
      }

      const payload: Payload.Admin.Users.Store = {
        email: values.email,
        password: values.password || undefined,
        role: values.role,
        status: values.status,
      }
      return match(await service.admin.users.id(user.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          mutate(data.user)
          if (isMe) mutateMe(data.user)
          close()
          Ui.toast.success(_(`success`))
        })
        .otherwise(({ except }) =>
          match(except)
            .with({ name: "E_VALIDATION_FAILURE" }, ({ errors }) => {
              // append email to list of emails already used in case of validation failure for email unique
              if (A.some(errors, ({ field, rule }) => field === "email" && rule === "unique")) {
                setEmails(A.append(emails, payload.email))
              }
              return _("error-validation-failure")
            })
            .otherwise(() => _("error-unknown"))
        )
    },
  })
  return (
    <Form.Root form={form}>
      <div className="space-y-8">
        <Form.Assertive />
        {notEnoughRights && (
          <Form.Alert variant="destructive">
            <p>{_("not-enough-rights")}</p>
          </Form.Alert>
        )}
        {isMe && (
          <Form.Alert variant="info">
            <p>{_("me-warning")}</p>
          </Form.Alert>
        )}
        <AccountForm />
      </div>
      <Ui.QuickDialogStickyFooter>
        <Form.Submit>{_(`submit`)}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Edit user",
    description: "Update the details of the selected user.",
    "not-enough-rights": "You do not have the necessary rights to modify this user",
    "me-warning": "Warning, you are modifying your own account",
    "email-format": "Please enter a valid email address (e.g., name@example.com).",
    "email-unique": "This email is already associated with another user.",
    "password-length": "Password must be at least 8 characters long.",
    submit: "Save changes",
    success: "User updated successfully",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
    "confirm-change-role": {
      title: "Confirmation of role change",
      description:
        "Are you sure you want to change your role? If you proceed, you may lose access and not be able to restore your role yourself.",
      cancel: "Cancel",
      confirm: "Confirm",
    },
    "confirm-change-status": {
      title: "Confirmation of status change",
      description: "Are you sure you want to change your status? Doing this could risk losing your access to your account.",
      cancel: "Cancel",
      confirm: "Confirm",
    },
  },
  fr: {
    title: "Modifier un utilisateur",
    description: "Mettez à jour les informations de l’utilisateur sélectionné.",
    "not-enough-rights": "Vous n'avez pas les droits nécessaires pour modifier cet utilisateur",
    "me-warning": "Attention, vous êtes en train de modifier votre propre compte",
    "email-format": "L’adresse email doit être valide (ex : nom@exemple.com).",
    "email-unique": "Cette adresse email est déjà utilisée par un autre utilisateur.",
    "password-length": "Le mot de passe doit contenir au moins 8 caractères.",
    submit: "Enregistrer les modifications",
    success: "L’utilisateur a été mis à jour avec succès ✅",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessus.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
    "confirm-change-role": {
      title: "Confirmation de changement de rôle",
      description:
        "Voulez-vous vraiment changer votre rôle? Si vous procédez, vous pourriez perdre votre accès et ne pouvoir restaurer votre rôle par vous-même.",
      cancel: "Annuler",
      confirm: "Confirmer",
    },
    "confirm-change-status": {
      title: "Confirmation de changement de statut",
      description: "Voulez-vous vraiment changer votre statut? Faire cela pourrait risquer de perdre votre accès à votre compte.",
      cancel: "Annuler",
      confirm: "Confirmer",
    },
  },
  de: {
    title: "Benutzer bearbeiten",
    description: "Aktualisieren Sie die Details des ausgewählten Benutzers.",
    "not-enough-rights": "Sie haben nicht die erforderlichen Rechte, um diesen Benutzer zu ändern",
    "me-warning": "Achtung, Sie bearbeiten Ihr eigenes Konto",
    "email-format": "Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. name@beispiel.com).",
    "email-unique": "Diese E-Mail-Adresse ist bereits einem anderen Benutzer zugeordnet.",
    "password-length": "Das Passwort muss mindestens 8 Zeichen lang sein.",
    submit: "Änderungen speichern",
    success: "Benutzer erfolgreich aktualisiert",
    "error-validation-failure": "Bitte überprüfen Sie die obigen Felder.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    "confirm-change-role": {
      title: "Bestätigung der Rollenänderung",
      description:
        "Sind Sie sicher, dass Sie Ihre Rolle ändern möchten? Wenn Sie fortfahren, könnten Sie den Zugang verlieren und Ihre Rolle nicht selbst wiederherstellen können.",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
    },
    "confirm-change-status": {
      title: "Bestätigung der Statusänderung",
      description:
        "Sind Sie sicher, dass Sie Ihren Status ändern möchten? Dies könnte dazu führen, dass Sie den Zugang zu Ihrem Konto verlieren.",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
    },
  },
}
