import { Api, Payload } from "@/services"
import { Form, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { G, match } from "@compo/utils"
import { UserPlus } from "lucide-react"
import React from "react"
import { FormSelectUser } from "../../users/form.select-user"
import { FormMemberRole } from "../form.member-roles"
import { useWorkspace } from "./context"

/**
 * MemberAdd
 * dialog to add a new member to the workspace
 */
export const MemberAdd: React.FC<Ui.QuickDialogProps<Api.Admin.Workspace, Api.Admin.WorkspaceMember>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog {...props} title={_("title")} description={_("description")} classNames={{ content: "sm:max-w-md" }} sticky>
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * Content
 * form content for adding a member
 */
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.Workspace, Api.Admin.WorkspaceMember>> = ({ item, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useWorkspace()

  const initialValues = {
    userId: null as string | null,
    role: "member" as Api.WorkspaceRole,
  }

  const form = useForm({
    allowSubmitAttempt: true,
    allowErrorSubmit: true,
    values: initialValues,
    validate: validator({
      userId: [(value) => (G.isNullable(value) ? _("user-required") : undefined)],
    }),
    onSubmit: async ({ values, isValid }) => {
      if (!isValid || G.isNullable(values.userId)) return _("error-validation-failure")

      const payload: Payload.Admin.Workspaces.AttachMember = {
        role: values.role,
      }

      return match(await service.members.id(values.userId).attach(payload))
        .with({ ok: true }, ({ data }) => {
          mutate?.(data.member)
          form.reset()
          Ui.toast.success(_("member-added", { name: `${data.member.profile.firstname} ${data.member.profile.lastname}` }))
        })
        .otherwise(() => Ui.toast.error(_("error-add-member")))
    },
  })

  // Get existing member IDs to exclude from user selection
  const existingMemberIds = item.members.map((m) => m.id)

  return (
    <Form.Root form={form} className="space-y-6">
      <Form.Assertive />

      {/* User Selection */}
      <FormSelectUser name="userId" label={_("user-label")} placeholder={_("user-placeholder")} omitUsersId={existingMemberIds} required />

      {/* Role Selection */}
      <FormMemberRole name="role" label={_("role-label")} required />

      <Ui.QuickDialogStickyFooter>
        <Form.Submit disabled={!form.values.userId || form.isSubmitting}>
          <UserPlus className="size-4" />
          {form.isSubmitting ? _("adding") : _("add-member")}
        </Form.Submit>
      </Ui.QuickDialogStickyFooter>

      <Form.Loading loading={form.isSubmitting} label={_("adding-member-progress")} className="z-10" />
    </Form.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Ajouter un membre",
    description: "Recherchez et ajoutez un utilisateur à cet espace de travail.",
    "user-label": "Utilisateur",
    "user-placeholder": "Sélectionner un utilisateur...",
    "role-label": "Rôle",
    "add-member": "Ajouter le membre",
    adding: "Ajout...",
    "adding-member-progress": "Ajout du membre en cours",
    "user-required": "Veuillez sélectionner un utilisateur",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessous.",
    "error-add-member": "Erreur lors de l'ajout du membre",
    "member-added": "{{name}} a été ajouté à l'espace de travail",
  },
  en: {
    title: "Add member",
    description: "Search and add a user to this workspace.",
    "user-label": "User",
    "user-placeholder": "Select a user...",
    "role-label": "Role",
    "add-member": "Add member",
    adding: "Adding...",
    "adding-member-progress": "Adding member in progress",
    "user-required": "Please select a user",
    "error-validation-failure": "Please check the fields above.",
    "error-add-member": "Error adding member",
    "member-added": "{{name}} has been added to the workspace",
  },
  de: {
    title: "Mitglied hinzufügen",
    description: "Suchen Sie nach einem Benutzer und fügen Sie ihn zu diesem Arbeitsbereich hinzu.",
    "user-label": "Benutzer",
    "user-placeholder": "Benutzer auswählen...",
    "role-label": "Rolle",
    "add-member": "Mitglied hinzufügen",
    adding: "Wird hinzugefügt...",
    "adding-member-progress": "Mitglied wird hinzugefügt",
    "user-required": "Bitte wählen Sie einen Benutzer aus",
    "error-validation-failure": "Bitte überprüfen Sie die obigen Felder.",
    "error-add-member": "Fehler beim Hinzufügen des Mitglieds",
    "member-added": "{{name}} wurde zum Arbeitsbereich hinzugefügt",
  },
}
