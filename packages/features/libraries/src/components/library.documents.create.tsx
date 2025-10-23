import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, G, match } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import React from "react"
import { useLibrariesService } from "../service.context"
import { LibraryDocumentsForm } from "./library.documents.form"

/**
 * LibraryDocumentsCreateDialog
 */
export const LibraryDocumentsCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.LibraryDocument>> = ({
  item,
  ...props
}) => {
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
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.LibraryDocument>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useLibrariesService()
  const { libraryId } = useLibrariesService()

  const initialValues = {
    reference: "",
    files: [] as Api.MediaFileWithRelations[],
    translations: useFormTranslatable<Api.LibraryDocumentTranslation, Partial<Api.LibraryDocumentTranslation>>(
      [],
      servicePlaceholder.libraryDocument
    ),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      if (G.isNullable(libraryId)) return Ui.toast.error(_("failed"))

      const { files, ...rest } = values
      const payload = {
        ...rest,
        files: A.map(files, (file) => ({
          fileId: file.id,
          code: "",
        })),
      }
      return match(await service.id(libraryId).documents.create(payload))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("created"))
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
    title: "Create document",
    description: "Create a new document.",
    submit: "Create document",
    created: "Document created successfully",
    failed: "Failed to create document",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Créer un document",
    description: "Créer un nouveau document.",
    submit: "Créer le document",
    created: "Document créé avec succès",
    failed: "Échec de la création du document",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Dokument erstellen",
    description: "Ein neues Dokument erstellen.",
    submit: "Dokument erstellen",
    created: "Dokument erfolgreich erstellt",
    failed: "Dokument konnte nicht erstellt werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
