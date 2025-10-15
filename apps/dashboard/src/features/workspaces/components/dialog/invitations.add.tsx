import { useAuth } from "@/features/auth"
import { useWorkspaces } from "@/features/workspaces"
import { Api, service } from "@/services"
import { Form, FormSelect, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguagesStore } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Mail } from "lucide-react"
import React from "react"

/**
 * WorkspacesDialogInvitationsAdd
 * dialog to send a new invitation to the workspace
 */
export const WorkspacesDialogInvitationsAdd: React.FC<Ui.QuickDialogProps<string, Api.WorkspaceInvitation>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog {...props} title={_("title")} description={_("description")} classNames={{ content: "sm:max-w-md" }} sticky>
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * Content
 * form content for sending an invitation
 */
const Content: React.FC<Ui.QuickDialogSafeProps<string, Api.WorkspaceInvitation>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { workspaces } = useWorkspaces()
  const { languages } = useLanguagesStore()
  const { me } = useAuth()
  // Find the workspace being managed (item = workspaceId)
  const managedWorkspace = workspaces.find((w) => w.id === item)
  const defaultLanguage = languages.find((l) => l.default)
  const initialValues = {
    email: "",
    role: "member" as Api.WorkspaceRole,
    language: me.languageId || defaultLanguage?.id || undefined,
  }

  const form = useForm({
    allowSubmitAttempt: true,
    allowErrorSubmit: true,
    values: initialValues,
    validate: validator({
      email: [
        (value) => (!value ? _("email-required") : undefined),
        (value) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? _("email-invalid") : undefined),
      ],
    }),
    onSubmit: async ({ values, isValid }) => {
      if (!isValid) return _("error-validation-failure")

      const payload = {
        email: values.email,
        role: values.role,
        language: values.language,
      }

      return match(await service.workspaces.id(item).createInvitation(payload))
        .with({ ok: true }, ({ data }) => {
          mutate?.(data.invitation)
          close()
          Ui.toast.success(_("invitation-sent", { email: values.email }))
        })
        .otherwise(({ except }) => {
          return match(except?.name)
            .with("E_ALREADY_MEMBER", () => _("error-already-member"))
            .with("E_LIMIT_EXCEEDED", () => _("error-already-invited"))
            .otherwise(() => Ui.toast.error(_("error-send-invitation")))
        })
    },
  })

  const languageOptions = languages.map((language) => ({ label: language.name, value: language.id }))

  // Available roles based on current user permissions
  const roleOptions =
    managedWorkspace?.memberRole === "owner"
      ? [
          { label: _("member"), value: "member" },
          { label: _("admin"), value: "admin" },
          { label: _("owner"), value: "owner" },
        ]
      : [
          { label: _("member"), value: "member" },
          { label: _("admin"), value: "admin" },
        ]

  return (
    <Form.Root form={form}>
      <div className="space-y-6">
        <Form.Assertive />

        <Form.Input
          name="email"
          type="email"
          label={_("email-label")}
          required
          placeholder={_("email-placeholder")}
          labelAside={<Form.Info title={_(`email-label`)} content={_(`email-info`)} />}
        />

        <FormSelect
          label={_("role-label")}
          name="role"
          options={roleOptions}
          labelAside={<Form.Info title={_(`role-label`)} content={_(`role-info`)} />}
        />

        <FormSelect
          label={_("language-label")}
          name="language"
          options={languageOptions}
          labelAside={<Form.Info title={_(`language-label`)} content={_(`language-info`)} />}
        />
      </div>
      <Ui.QuickDialogStickyFooter>
        <Form.Submit disabled={!form.values.email || form.isSubmitting} className="w-full">
          <Mail aria-hidden />
          {form.isSubmitting ? _("sending") : _("send-invitation")}
        </Form.Submit>
      </Ui.QuickDialogStickyFooter>

      <Form.Loading loading={form.isSubmitting} label={_("sending-invitation-progress")} className="z-10" />
    </Form.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Envoyer une invitation",
    description: "Invitez un utilisateur à rejoindre cet espace de travail.",
    "email-label": "Adresse email",
    "email-placeholder": "exemple@domaine.com",
    "email-info": "L'adresse email de la personne que vous souhaitez inviter à rejoindre cet espace de travail.",
    "role-label": "Rôle",
    "role-info":
      "Le niveau d'autorisation que cette personne aura dans l'espace. Les membres peuvent consulter et collaborer, les admins peuvent gérer les membres et les paramètres.",
    "language-label": "Langue",
    "language-info": "La langue dans laquelle l'email d'invitation sera envoyé. Par défaut, votre langue préférée est sélectionnée.",
    member: "Membre",
    admin: "Admin",
    owner: "Propriétaire",
    "send-invitation": "Envoyer l'invitation",
    sending: "Envoi...",
    "sending-invitation-progress": "Envoi de l'invitation en cours",
    "email-required": "Veuillez saisir une adresse email",
    "email-invalid": "Veuillez saisir une adresse email valide",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessous.",
    "error-already-invited": "Cette adresse email a déjà reçue une invitation récemment",
    "error-already-member": "Cette adresse email appartient déjà à un membre de l'espace de travail",
    "error-send-invitation": "Erreur lors de l'envoi de l'invitation",
    "invitation-sent": "Invitation envoyée à {{email}}",
  },
  en: {
    title: "Send invitation",
    description: "Invite a user to join this workspace.",
    "email-label": "Email address",
    "email-placeholder": "example@domain.com",
    "email-info": "The email address of the person you want to invite to join this workspace.",
    "role-label": "Role",
    "role-info":
      "The permission level this person will have in the workspace. Members can view and collaborate, admins can manage members and settings.",
    "language-label": "Language",
    "language-info": "The language in which the invitation email will be sent. Your preferred language is selected by default.",
    member: "Member",
    admin: "Admin",
    owner: "Owner",
    "send-invitation": "Send invitation",
    sending: "Sending...",
    "sending-invitation-progress": "Sending invitation in progress",
    "email-required": "Please enter an email address",
    "email-invalid": "Please enter a valid email address",
    "email-already-invited": "This email address has already been invited",
    "error-validation-failure": "Please check the fields above.",
    "error-already-invited": "This email address has already been invited recently",
    "error-already-member": "This email address is already a member of the workspace",
    "error-send-invitation": "Error sending invitation",
    "invitation-sent": "Invitation sent to {{email}}",
  },
  de: {
    title: "Einladung senden",
    description: "Laden Sie einen Benutzer ein, diesem Arbeitsbereich beizutreten.",
    "email-label": "E-Mail-Adresse",
    "email-placeholder": "beispiel@domain.com",
    "email-info": "Die E-Mail-Adresse der Person, die Sie zu diesem Arbeitsbereich einladen möchten.",
    "role-label": "Rolle",
    "role-info":
      "Die Berechtigungsstufe, die diese Person im Arbeitsbereich haben wird. Mitglieder können ansehen und zusammenarbeiten, Administratoren können Mitglieder und Einstellungen verwalten.",
    "language-label": "Sprache",
    "language-info": "Die Sprache, in der die Einladungs-E-Mail gesendet wird. Standardmäßig ist Ihre bevorzugte Sprache ausgewählt.",
    member: "Mitglied",
    admin: "Administrator",
    owner: "Eigentümer",
    "send-invitation": "Einladung senden",
    sending: "Wird gesendet...",
    "sending-invitation-progress": "Einladung wird gesendet",
    "email-required": "Bitte geben Sie eine E-Mail-Adresse ein",
    "email-invalid": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    "email-already-invited": "Diese E-Mail-Adresse wurde bereits eingeladen",
    "error-validation-failure": "Bitte überprüfen Sie die Felder oben.",
    "error-already-invited": "Diese E-Mail-Adresse wurde bereits eingeladen kürzlich",
    "error-already-member": "Diese E-Mail-Adresse ist bereits ein Mitglied des Arbeitsbereichs",
    "error-send-invitation": "Fehler beim Senden der Einladung",
    "invitation-sent": "Einladung gesendet an {{email}}",
  },
}
