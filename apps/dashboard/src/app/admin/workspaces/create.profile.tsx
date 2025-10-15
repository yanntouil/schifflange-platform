import { Api, Payload, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D } from "@compo/utils"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import adminWorkspacesIdRoute from "./[workspaceId]"
import { ProfileForm } from "./form.profile"

/**
 * Admin workspaces update profile form
 */
export const Profile: React.FC<{ workspace: Api.Admin.Workspace }> = ({ workspace }) => {
  const { _ } = useTranslation(dictionary)

  const { close } = Ui.useQuickDialogContext()
  const [, navigate] = useLocation()

  const initialValues = {
    logo: makeFormFileValue(service.getImageUrl(workspace.profile.logo, "preview")),
  }

  const [isLoading, setIsLoading] = React.useState(false)

  const onSkip = () => {
    close()
    navigate(adminWorkspacesIdRoute(workspace.id))
  }

  const form = useForm({
    allowSubmitAttempt: true,
    allowErrorSubmit: true,
    values: initialValues,

    onSubmit: async ({ values, isValid }) => {
      if (!isValid) return _("error-validation-failure")

      const payload: Payload.Admin.Workspaces.UpdateProfile = {
        logo: extractFormFilePayload(values.logo),
        ...D.deleteKeys(values, ["logo"]),
      }
      setIsLoading(true)
      const result = await service.admin.workspaces.id(workspace.id).updateProfile(payload)
      setIsLoading(false)
      return match(result)
        .with({ ok: true }, () => {
          close()
          // navigate({ to: adminWorkspacesIdRoute.to, params: { id: workspace.id } })
        })
        .otherwise(({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => _("error-validation-failure"))
            .otherwise(() => _("error-unknown"))
        )
    },
  })

  return (
    <Ui.QuickDialogContent title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-screen-md" }} sticky>
      <Form.Root form={form} className="@container space-y-6">
        <Form.Assertive />
        <ProfileForm />
        <Ui.QuickDialogStickyFooter>
          <Ui.Button type="submit">
            <SaveAll aria-hidden />
            {_("update")}
          </Ui.Button>
          <Ui.Button variant="outline" onClick={onSkip}>
            {_("skip")}
            <ArrowRight aria-hidden />
          </Ui.Button>
        </Ui.QuickDialogStickyFooter>
        <Form.Loading loading={isLoading} label={_("loading")} />
      </Form.Root>
    </Ui.QuickDialogContent>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Profil de l'espace de travail",
    description: "Configurez les informations du profil de l'espace de travail.",
    update: "Ajouter le profil",
    skip: "Passer cette étape",
    loading: "Mise à jour du profil en cours",
    "error-validation-failure": "Erreur de validation",
    "error-unknown": "Erreur inconnue",
  },
  en: {
    title: "Workspace profile",
    description: "Configure the workspace profile.",
    update: "Save changes",
    skip: "Skip this step",
    loading: "Updating the profile is in progress",
    "error-validation-failure": "Validation error",
    "error-unknown": "Unknown error",
  },
  de: {
    title: "Arbeitsbereich-Profil",
    description: "Konfigurieren Sie das Arbeitsbereich-Profil.",
    update: "Änderungen speichern",
    skip: "Diesen Schritt überspringen",
    loading: "Profil wird aktualisiert",
    "error-validation-failure": "Validierungsfehler",
    "error-unknown": "Unbekannter Fehler",
  },
}
