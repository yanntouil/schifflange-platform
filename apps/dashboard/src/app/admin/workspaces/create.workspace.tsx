import { Api, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Layers } from "lucide-react"
import React from "react"
import { WorkspaceForm } from "./form.workspace"

const { min } = validator

/**
 * Admin workspaces create workspace form
 */
export const Workspace: React.FC<{ onCreate: (workspace: Api.Admin.Workspace) => void }> = ({ onCreate }) => {
  const { _ } = useTranslation(dictionary)
  const initialValues = {
    name: "",
    type: "lumiq" as const,
    status: "active" as const,
    themeId: "",
    image: makeFormFileValue(),
  }

  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm({
    allowSubmitAttempt: true,
    allowErrorSubmit: true,
    values: initialValues,
    validate: validator({
      name: [min(1, _("name-required"))],
    }),
    onSubmit: async ({ values, isValid }) => {
      if (!isValid) return _("error-validation-failure")
      const payload = {
        name: values.name,
        type: values.type,
        status: values.status,
        themeId: values.themeId === "" || values.themeId === "empty" ? null : values.themeId,
        image: extractFormFilePayload(values.image),
      }

      setIsLoading(true)
      const result = await service.admin.workspaces.create(payload)
      setIsLoading(false)

      if (result.ok) {
        onCreate(result.data.workspace)
        Ui.toast.success(_("created"))
      } else {
        Ui.toast.error(_("error-unknown"))
      }
    },
  })

  return (
    <Ui.QuickDialogContent title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-screen-sm" }} sticky>
      <Form.Root form={form} className="@container space-y-6">
        <Form.Assertive />
        <WorkspaceForm />
        <Ui.QuickDialogStickyFooter>
          <Ui.Button type="submit">
            <Layers aria-hidden />
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
    title: "Espace de travail",
    description: "Configurez les informations de l'espace de travail.",
    "name-required": "Le nom est requis.",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessous.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
    create: "Créer l'espace de travail",
    loading: "Création de l'espace de travail en cours",
    created: "Espace de travail créé avec succès",
  },
  en: {
    title: "Workspace",
    description: "Configure the workspace information.",
    "name-required": "Name is required.",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
    create: "Create workspace",
    loading: "Workspace creation is in progress",
    created: "Workspace created successfully",
  },
  de: {
    title: "Arbeitsbereich",
    description: "Konfigurieren Sie die Arbeitsbereich-Informationen.",
    "name-required": "Name ist erforderlich.",
    "error-validation-failure": "Bitte überprüfen Sie die Felder oben.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    create: "Arbeitsbereich erstellen",
    loading: "Arbeitsbereich wird erstellt",
    created: "Arbeitsbereich erfolgreich erstellt",
  },
}
