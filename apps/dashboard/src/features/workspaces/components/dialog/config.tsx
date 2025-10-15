import { AuthDialogContent, AuthDialogFooter, AuthDialogHeader } from "@/features/auth/components"
import { workspaceStore } from "@/features/workspaces/store"
import { Api, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm, useFormDirty } from "@compo/form"
import { useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, match } from "@compo/utils"
import React from "react"
import { makeAuthorization } from "./config.authorization"
import { WorkspaceIdentitySection } from "./config.identity"
import { WorkspaceProfileSection } from "./config.profile"

const { updateWorkspaceInList } = workspaceStore.actions
export type AuthDialogTabWorkspacesConfig = {
  type: "workspaces-config"
  params: {
    workspaceId: string
  }
}

/**
 * dialog workspace configuration
 * this component is used to display the workspace config tab in the auth dialog
 */
export const WorkspacesDialogConfig: React.FC<{ tab: AuthDialogTabWorkspacesConfig }> = ({ tab }) => {
  const { _ } = useTranslation(dictionary)
  const { workspaceId } = tab.params

  const { data, isLoading, error, mutate } = useSWR({
    key: useMemoKey("workspace-details", { workspaceId }),
    fetch: () => service.workspaces.id(workspaceId).read(),
  })

  if (isLoading) {
    return (
      <>
        <AuthDialogHeader title={_("title")} description={_("description")} sticky />
        <AuthDialogContent className="space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="bg-muted h-4 w-1/4 rounded" />
            <div className="bg-muted h-10 rounded" />
            <div className="bg-muted h-10 rounded" />
          </div>
        </AuthDialogContent>
      </>
    )
  }
  if (error || !data)
    return (
      <>
        <AuthDialogHeader title={_("title")} description={_("description")} sticky />
        <AuthDialogContent>
          <Ui.Alert.Root>
            <Ui.Alert.Title>{_("error-title")}</Ui.Alert.Title>
            <Ui.Alert.Description>{_("error-description")}</Ui.Alert.Description>
          </Ui.Alert.Root>
        </AuthDialogContent>
      </>
    )
  return <WorkspaceConfigForm workspace={data.workspace} onUpdate={mutate} />
}

/**
 * Workspace configuration form
 */
const WorkspaceConfigForm: React.FC<{
  workspace: Api.Workspace & Api.WithMembers & Api.AsMemberOfWorkspace & Api.WithTheme & Api.WithProfile
  onUpdate: () => void
}> = ({ workspace, onUpdate }) => {
  const { _ } = useTranslation(dictionary)

  const initialValues = workspaceToValues(workspace)

  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        name: values.name,
        type: values.type,
        themeId: values.themeId,
        image: extractFormFilePayload(values.image),
        profileLogo: extractFormFilePayload(values.profile.logo),
        profile: {
          // logo: extractFormFilePayload(values.profile.logo),
          translations: D.map(values.profile.translations, (translation) => ({
            ...translation,
          })),
        },
      }

      match(await service.workspaces.id(workspace.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          updateWorkspaceInList(workspace.id, data.workspace)
          onUpdate()
          // reset the form values
          form.setValues(workspaceToValues(data.workspace))
        })
        .otherwise((error) => {
          console.error("Failed to update workspace:", error)
        })
    },
  })

  const [isDirty] = useFormDirty(form, initialValues)

  // Permissions
  const can = makeAuthorization(workspace.memberRole)

  return (
    <>
      <AuthDialogHeader title={_("title")} description={_("description")} sticky />
      <Form.Root form={form}>
        <AuthDialogContent className="@container space-y-6 pb-6">
          <Form.Alert variant="info">
            <p>{_("info")}</p>
          </Form.Alert>
          <FormTranslatableTabs>
            <div className="space-y-6">
              <WorkspaceIdentitySection can={can} />
              <WorkspaceProfileSection can={can} />
            </div>
          </FormTranslatableTabs>
        </AuthDialogContent>
        {isDirty && (
          <AuthDialogFooter sticky>
            <Ui.Button type="submit">{_("save-changes")}</Ui.Button>
            <Ui.Button variant="ghost" type="button" onClick={() => form.reset()}>
              {_("cancel")}
            </Ui.Button>
          </AuthDialogFooter>
        )}
      </Form.Root>
    </>
  )
}

/**
 * convert a workspace to form values
 */
const workspaceToValues = (workspace: Api.Workspace & Api.WithMembers & Api.AsMemberOfWorkspace & Api.WithTheme & Api.WithProfile) => {
  const initialValues = {
    name: workspace.name,
    type: workspace.type,
    themeId: workspace.theme?.id ?? "",
    image: makeFormFileValue(workspace.image ? service.getImageUrl(workspace.image, "preview") : null),
    profile: {
      logo: makeFormFileValue(workspace.profile.logo ? service.getImageUrl(workspace.profile.logo, "preview") : null),
      translations: D.fromPairs(A.map(workspace.profile.translations, ({ languageId, ...rest }) => [languageId, rest])),
    },
  }
  return initialValues
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Workspace Settings",
    description: "Manage your workspace settings and preferences.",
    info: "Update your workspace information and settings. Changes will be visible to all workspace members.",
    "error-title": "Error",
    "error-description": "Failed to load workspace details. Please try again.",
    "save-changes": "Save changes",
    member: "member",
    members: "members",
    owner: "Owner",
    admin: "Admin",
    member_role: "Member",
  },
  fr: {
    title: "Paramètres de l'espace",
    description: "Gérer les paramètres et préférences de votre espace de travail.",
    info: "Mettez à jour les informations et paramètres de votre espace. Les modifications seront visibles par tous les membres.",
    "error-title": "Erreur",
    "error-description": "Impossible de charger les détails de l'espace. Veuillez réessayer.",
    "save-changes": "Enregistrer les modifications",
    member: "membre",
    members: "membres",
    owner: "Propriétaire",
    admin: "Admin",
    member_role: "Membre",
  },
  de: {
    title: "Arbeitsbereich-Einstellungen",
    description: "Verwalten Sie Ihre Arbeitsbereich-Einstellungen und -Präferenzen.",
    info: "Aktualisieren Sie Ihre Arbeitsbereich-Informationen und -Einstellungen. Änderungen sind für alle Arbeitsbereich-Mitglieder sichtbar.",
    "error-title": "Fehler",
    "error-description": "Die Arbeitsbereich-Details konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
    "save-changes": "Änderungen speichern",
    cancel: "Abbrechen",
    member: "Mitglied",
    members: "Mitglieder",
    owner: "Eigentümer",
    admin: "Administrator",
    member_role: "Mitglied",
  },
}
