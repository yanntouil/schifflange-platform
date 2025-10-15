import { Api, Payload } from "@/services"
import { Form, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Mail } from "lucide-react"
import React from "react"
import { FormMemberRole } from "../form.member-roles"
import { useWorkspace } from "./context"

/**
 * InvitationAdd
 * dialog to send a new invitation to the workspace
 */
export const InvitationAdd: React.FC<Ui.QuickDialogProps<Api.Admin.Workspace, Api.Admin.WorkspaceInvitation>> = ({ item, ...props }) => {
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
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.Workspace, Api.Admin.WorkspaceInvitation>> = ({ item, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useWorkspace()

  const initialValues = {
    email: "",
    role: "member" as Api.WorkspaceRole,
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

      const payload: Payload.Admin.Workspaces.CreateInvitation = {
        email: values.email,
        role: values.role,
      }

      return match(await service.invitations.create(payload))
        .with({ ok: true }, ({ data }) => {
          mutate?.(data.invitation)
          form.reset()
          Ui.toast.success(_("invitation-sent", { email: values.email }))
        })
        .otherwise(() => Ui.toast.error(_("error-send-invitation")))
    },
  })

  // Get existing invitation emails to warn about duplicates
  const existingEmails = item.invitations.map((inv) => inv.email)
  const emailExists = existingEmails.includes(form.values.email)

  return (
    <Form.Root form={form} className="space-y-6">
      <Form.Assertive />

      {/* Email Input */}
      <Form.Input name="email" label={_("email-label")} required>
        <Form.Input type="email" placeholder={_("email-placeholder")} />
        {/* {emailExists && (
          <Form.Message type="warning" className="mt-2">
            {_("email-already-invited")}
          </Form.Message>
        )} */}
      </Form.Input>

      {/* Role Selection */}
      <FormMemberRole name="role" label={_("role-label")} required />

      <Ui.QuickDialogStickyFooter>
        <Form.Submit disabled={!form.values.email || form.isSubmitting}>
          <Mail className="size-4" />
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
    "role-label": "Rôle",
    "send-invitation": "Envoyer l'invitation",
    sending: "Envoi...",
    "sending-invitation-progress": "Envoi de l'invitation en cours",
    "email-required": "Veuillez saisir une adresse email",
    "email-invalid": "Veuillez saisir une adresse email valide",
    "email-already-invited": "Cette adresse email a déjà été invitée",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessous.",
    "error-send-invitation": "Erreur lors de l'envoi de l'invitation",
    "invitation-sent": "Invitation envoyée à {{email}}",
  },
  en: {
    title: "Send invitation",
    description: "Invite a user to join this workspace.",
    "email-label": "Email address",
    "email-placeholder": "example@domain.com",
    "role-label": "Role",
    "send-invitation": "Send invitation",
    sending: "Sending...",
    "sending-invitation-progress": "Sending invitation in progress",
    "email-required": "Please enter an email address",
    "email-invalid": "Please enter a valid email address",
    "email-already-invited": "This email address has already been invited",
    "error-validation-failure": "Please check the fields above.",
    "error-send-invitation": "Error sending invitation",
    "invitation-sent": "Invitation sent to {{email}}",
  },
  de: {
    title: "Einladung senden",
    description: "Laden Sie einen Benutzer ein, diesem Arbeitsbereich beizutreten.",
    "email-label": "E-Mail-Adresse",
    "email-placeholder": "beispiel@domain.com",
    "role-label": "Rolle",
    "send-invitation": "Einladung senden",
    sending: "Wird gesendet...",
    "sending-invitation-progress": "Einladung wird gesendet",
    "email-required": "Bitte geben Sie eine E-Mail-Adresse ein",
    "email-invalid": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    "email-already-invited": "Diese E-Mail-Adresse wurde bereits eingeladen",
    "error-validation-failure": "Bitte überprüfen Sie die obigen Felder.",
    "error-send-invitation": "Fehler beim Senden der Einladung",
    "invitation-sent": "Einladung an {{email}} gesendet",
  },
}
