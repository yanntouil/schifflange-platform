import { Api, Payload, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { F } from "@compo/utils"
import React from "react"
import { ProfileForm } from "./form.profile"

/**
 * dialog use to edit a workspace profile
 */
export const ProfileEditDialog: React.FC<Ui.QuickDialogProps<Api.Admin.Workspace>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog {...props} title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-2xl" }} sticky>
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * form to edit a workspace profile
 */
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.Workspace>> = ({ mutate = F.identity, item: workspace, close }) => {
  const { _ } = useTranslation(dictionary)

  const initialValues = {
    logo: makeFormFileValue(service.getImageUrl(workspace.profile?.logo, "preview")),
  }

  const [isLoading, setIsLoading] = React.useState(false)
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload: Payload.Admin.Workspaces.UpdateProfile = {
        logo: extractFormFilePayload(values.logo),
      }
      setIsLoading(true)
      const result = await service.admin.workspaces.id(workspace.id).updateProfile(payload)
      setIsLoading(false)
      return match(result)
        .with({ ok: true }, ({ data }) => {
          close()
          mutate(data.workspace)
          Ui.toast.success(_(`success`))
        })
        .otherwise(({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("error-validation-failure"))
            .otherwise(() => _("error-unknown"))
        )
    },
  })
  return (
    <Form.Root form={form} className="@container">
      <div className="space-y-8">
        <Form.Assertive />
        <ProfileForm />
        <Form.Loading loading={isLoading} label={_("loading")} className="z-10" />
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
    title: "Edit workspace profile",
    description: "Update the details of the selected workspace profile.",
    submit: "Update profile",
    success: "Workspace profile updated successfully",
    loading: "Updating workspace profile",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
  },
  fr: {
    title: "Modifier le profil de l'espace de travail",
    description: "Mettez à jour les informations du profil de l'espace de travail sélectionné.",
    submit: "Mettre à jour le profil",
    success: "Le profil de l'espace de travail a été mis à jour avec succès",
    loading: "Mise à jour du profil de l'espace de travail",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessous.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
  },
  de: {
    title: "Arbeitsbereich-Profil bearbeiten",
    description: "Aktualisieren Sie die Details des ausgewählten Arbeitsbereich-Profils.",
    submit: "Profil aktualisieren",
    success: "Arbeitsbereich-Profil erfolgreich aktualisiert",
    loading: "Arbeitsbereich-Profil wird aktualisiert",
    "error-validation-failure": "Bitte überprüfen Sie die obigen Felder.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
}
