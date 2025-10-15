import { Api, Payload, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { F, match } from "@compo/utils"
import React from "react"
import { ThemeForm } from "./form.theme"
import { makeThemeConfigPayload, makeThemeConfigValue } from "./utils"

/**
 * dialog use to edit a theme
 */
export const EditThemeDialog: React.FC<Ui.QuickDialogProps<Api.Admin.WorkspaceTheme>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      {...props}
      title={_(`title`)}
      description={_(`description`)}
      classNames={{ content: "sm:max-w-3xl", header: "z-10" }}
      sticky
    >
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * form to edit a theme
 */
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.WorkspaceTheme>> = ({ mutate = F.identity, item: theme, close }) => {
  const { _ } = useTranslation(dictionary)

  const initialValues = {
    name: theme.name,
    description: theme.description,
    image: makeFormFileValue(service.getImageUrl(theme.image, "preview")),
    isDefault: theme.isDefault,
    config: makeThemeConfigValue(theme.config),
  }

  const { min } = validator
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    validate: validator({
      name: [min(1, _("name-required"))],
    }),
    onSubmit: async ({ values }) => {
      const payload: Payload.Admin.Workspaces.UpdateTheme = {
        name: values.name,
        description: values.description || undefined,
        image: extractFormFilePayload(values.image),
        isDefault: values.isDefault,
        config: makeThemeConfigPayload(values.config),
      }
      return match(await service.admin.workspaces.themes.id(theme.id).update(payload))
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
    title: "Edit theme",
    description: "Update the theme details and styling.",
    "name-required": "Theme name is required.",
    submit: "Save changes",
    success: "Theme updated successfully",
    "error-validation-failure": "Please check the fields above.",
    "error-unknown": "An unexpected error occurred. Please try again.",
  },
  fr: {
    title: "Modifier le thème",
    description: "Mettez à jour les détails et le style du thème.",
    "name-required": "Le nom du thème est requis.",
    submit: "Enregistrer les modifications",
    success: "Le thème a été mis à jour avec succès",
    "error-validation-failure": "Merci de corriger les erreurs ci-dessus.",
    "error-unknown": "Une erreur inattendue est survenue. Veuillez réessayer.",
  },
  de: {
    title: "Theme bearbeiten",
    description: "Aktualisieren Sie die Theme-Details und das Styling.",
    "name-required": "Theme-Name ist erforderlich.",
    submit: "Änderungen speichern",
    success: "Theme erfolgreich aktualisiert",
    "error-validation-failure": "Bitte überprüfen Sie die Felder oben.",
    "error-unknown": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
}
