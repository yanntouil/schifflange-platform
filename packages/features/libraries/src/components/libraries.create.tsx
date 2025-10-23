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
 * LibrariesCreateDialog
 */
export const LibrariesCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.Library>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-2xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.Library>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service, libraryId } = useLibrariesService()

  const initialValues = {
    translations: useFormTranslatable<Api.LibraryTranslation, Partial<Api.LibraryTranslation>>(
      [],
      servicePlaceholder.library
    ),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        parentLibraryId: libraryId ?? null,
      }
      return match(await service.create(payload))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("created"))
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
    title: "Create library",
    description: "Create a new library.",
    submit: "Create library",
    created: "Library created successfully",
    failed: "Failed to create library",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Créer une bibliothèque",
    description: "Créer une nouvelle bibliothèque.",
    submit: "Créer la bibliothèque",
    created: "Bibliothèque créée avec succès",
    failed: "Échec de la création de la bibliothèque",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Bibliothek erstellen",
    description: "Eine neue Bibliothek erstellen.",
    submit: "Bibliothek erstellen",
    created: "Bibliothek erfolgreich erstellt",
    failed: "Bibliothek konnte nicht erstellt werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
