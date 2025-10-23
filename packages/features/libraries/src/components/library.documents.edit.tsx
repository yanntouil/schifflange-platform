import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, match } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import React from "react"
import { useLibrariesService } from "../service.context"
import { LibraryDocumentsForm } from "./library.documents.form"

/**
 * LibraryDocumentsEditDialog
 */
export const LibraryDocumentsEditDialog: React.FC<Ui.QuickDialogProps<Api.LibraryDocument>> = ({ item, ...props }) => {
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
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.LibraryDocument>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useLibrariesService()

  const initialValues = {
    reference: item.reference,
    files: A.map(item.files, (file) => D.set(D.deleteKey(file, "code"), "label", file.code)),
    translations: useFormTranslatable<Api.LibraryDocumentTranslation, Partial<Api.LibraryDocumentTranslation>>(
      item.translations,
      servicePlaceholder.libraryDocument
    ),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const { files, ...rest } = values
      const payload = {
        ...rest,
        files: A.map(files, ({ id, label }) => ({ fileId: id, code: label })),
      }
      return match(await service.id(item.libraryId).documents.id(item.id).update(payload))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(data.libraryDocument)
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
      <LibraryDocumentsForm />

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
    title: "Edit document",
    description: "Modify the document information.",
    submit: "Save changes",
    updated: "Document updated successfully",
    failed: "Failed to update document",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier le document",
    description: "Modifier les informations du document.",
    submit: "Enregistrer les modifications",
    updated: "Document mis à jour avec succès",
    failed: "Échec de la mise à jour du document",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Dokument bearbeiten",
    description: "Dokumentinformationen ändern.",
    submit: "Änderungen speichern",
    updated: "Dokument erfolgreich aktualisiert",
    failed: "Dokument konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
