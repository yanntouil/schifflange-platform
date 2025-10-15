import { workspaceStore } from "@/features/workspaces/store"
import { Api, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { F } from "@compo/utils"
import React from "react"
import { WorkspaceForm } from "./form.workspace"

const { updateWorkspaceInList } = workspaceStore.actions

/**
 * dialog use to edit a workspace account
 */
export const AccountEditDialog: React.FC<Ui.QuickDialogProps<Api.Admin.Workspace>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog {...props} title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-3xl" }} sticky>
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * form to edit a workspace account
 */
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.Workspace>> = ({ mutate = F.identity, item: workspace, close }) => {
  const { _ } = useTranslation(dictionary)

  const initialValues = {
    name: workspace.name,
    type: workspace.type,
    status: workspace.status,
    themeId: workspace.theme?.id ?? "",
    image: makeFormFileValue(workspace.image ? service.getImageUrl(workspace.image, "preview") : null),
  }

  const { minOrEqual } = validator
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    validate: validator({
      name: [minOrEqual(1, 255, _("name-length"))],
    }),
    onSubmit: async ({ values }) => {
      const payload = {
        name: values.name,
        type: values.type,
        status: values.status,
        themeId: values.themeId === "" || values.themeId === "empty" ? null : values.themeId,
        image: extractFormFilePayload(values.image),
      }
      return match(await service.admin.workspaces.id(workspace.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          mutate(data.workspace)
          updateWorkspaceInList(workspace.id, data.workspace)
          close()
          Ui.toast.success(_(`success`))
        })
        .otherwise(({ except }) =>
          match(except)
            .with({ name: "E_VALIDATION_FAILURE" }, () => _("error-validation-failure"))
            .otherwise(() => _("error-unknown"))
        )
    },
  })
  return (
    <Form.Root form={form}>
      <div className="@container space-y-8">
        <Form.Assertive />
        <WorkspaceForm />
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
    title: "Edit workspace",
    description: "Update the details of the selected workspace.",
    "name-length": "Name must be between 1 and 255 characters.",
    submit: "Save changes",
    success: "Workspace updated successfully",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
  },
  fr: {
    title: "Modifier un espace de travail",
    description: "Mettez à jour les informations de l'espace de travail sélectionné.",
    "name-length": "Le nom doit contenir entre 1 et 255 caractères.",
    submit: "Enregistrer les modifications",
    success: "L'espace de travail a été mis à jour avec succès ✅",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessus.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
  },
  de: {
    title: "Arbeitsbereich bearbeiten",
    description: "Aktualisieren Sie die Details des ausgewählten Arbeitsbereichs.",
    "name-length": "Name muss zwischen 1 und 255 Zeichen lang sein.",
    submit: "Änderungen speichern",
    success: "Arbeitsbereich erfolgreich aktualisiert",
    "error-validation-failure": "Bitte überprüfen Sie die Felder oben.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
}
