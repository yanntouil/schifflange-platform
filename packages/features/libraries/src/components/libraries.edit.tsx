import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import React from "react"
import { useLibrariesService } from "../service.context"
import { LibrariesForm } from "./libraries.form"

/**
 * LibrariesEditDialog
 */
export const LibrariesEditDialog: React.FC<Ui.QuickDialogProps<Api.Library>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-2xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.Library>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useLibrariesService()

  const initialValues = {
    translations: useFormTranslatable<Api.LibraryTranslation, Partial<Api.LibraryTranslation>>(
      item.translations,
      servicePlaceholder.library
    ),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      return match(await service.id(item.id).update(values))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(data.library)
          close()
        })
        .otherwise(async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
    },
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <LibrariesForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Edit library",
    description: "Modify the library information.",
    submit: "Save changes",
    updated: "Library updated successfully",
    failed: "Failed to update library",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier la bibliothèque",
    description: "Modifier les informations de la bibliothèque.",
    submit: "Enregistrer les modifications",
    updated: "Bibliothèque mise à jour avec succès",
    failed: "Échec de la mise à jour de la bibliothèque",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Bibliothek bearbeiten",
    description: "Bibliotheksinformationen ändern.",
    submit: "Änderungen speichern",
    updated: "Bibliothek erfolgreich aktualisiert",
    failed: "Bibliothek konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
