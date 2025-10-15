import { Api, Payload, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { F, match } from "@compo/utils"
import React from "react"
import { ThemeForm } from "./form.theme"
import { makeThemeConfigPayload, makeThemeConfigValue } from "./utils"

/**
 * dialog use to create a theme
 */
export const CreateThemeDialog: React.FC<Ui.QuickDialogProps<void, Api.Admin.WorkspaceTheme>> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog {...props} title={_(`title`)} description={_(`description`)} classNames={{ content: "sm:max-w-xl" }} sticky>
      <Content {...props} />
    </Ui.QuickDialog>
  )
}

/**
 * form to create a theme
 */
const Content: React.FC<Ui.QuickDialogSafeProps<void, Api.Admin.WorkspaceTheme>> = ({ mutate = F.identity, close }) => {
  const { _ } = useTranslation(dictionary)

  const initialValues = {
    name: "",
    description: "",
    image: makeFormFileValue(),
    isDefault: false,
    config: makeThemeConfigValue(),
  }

  const { min } = validator
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    validate: validator({
      name: [min(1, _("name-required"))],
    }),
    onSubmit: async ({ values }) => {
      const payload: Payload.Admin.Workspaces.CreateTheme = {
        name: values.name,
        description: values.description || undefined,
        image: extractFormFilePayload(values.image),
        isDefault: values.isDefault,
        config: makeThemeConfigPayload(values.config),
      }
      return match(await service.admin.workspaces.themes.create(payload))
        .with({ ok: true }, ({ data }) => {
          mutate(data.theme)
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
      <div className="space-y-8">
        <Form.Assertive />
        <ThemeForm />
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
    title: "Create theme",
    description: "Create a new workspace theme with custom styling.",
    "name-required": "Theme name is required.",
    submit: "Create theme",
    success: "Theme created successfully",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
  },
  fr: {
    title: "Créer un thème",
    description: "Créez un nouveau thème d'espace de travail avec un style personnalisé.",
    "name-required": "Le nom du thème est requis.",
    submit: "Créer le thème",
    success: "Le thème a été créé avec succès",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessus.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
  },
  de: {
    title: "Thema erstellen",
    description: "Erstellen Sie ein neues Arbeitsbereich-Thema mit benutzerdefiniertem Styling.",
    "name-required": "Thema-Name ist erforderlich.",
    submit: "Thema erstellen",
    success: "Thema erfolgreich erstellt",
    "error-validation-failure": "Bitte überprüfen Sie die Felder oben.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
}
