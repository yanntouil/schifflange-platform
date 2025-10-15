import { Form, FormFileType, isFile, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMediasFolder } from "../../folder.context"
import { useMediasService } from "../../service.context"

/**
 * UploadFilesDialog
 */
export const UploadFilesDialog: React.FC<Ui.QuickDialogProps<void, Api.MediaFileWithRelations>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)

  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-xl" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.MediaFileWithRelations>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { folderId } = useMediasFolder()
  const { service } = useMediasService()

  const form = useForm<{ files: FormFileType[] }>({
    allowSubmitAttempt: true,
    values: { files: [] },
    onSubmit: async ({ values }) => {
      const files = A.filter(values.files, isFile)
      if (A.isEmpty(files)) return

      close()

      const total = files.length
      let successCount = 0
      let errorCount = 0
      const errors: string[] = []

      const toastId = Ui.toast.loading(_("progress", { counter: 0, total }))

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const counter = i + 1

        const result = await service.files.create({ file }, folderId || undefined)
        if (result.failed) {
          errorCount++
          errors.push(file.name)
        } else {
          successCount++
          await mutate?.(result.data.file)
        }

        // Update progress (but not on last item)
        if (counter < total) {
          Ui.toast.loading(_("progress", { counter, total }), { id: toastId })
        }
      }

      // Dismiss loading toast
      Ui.toast.dismiss(toastId)

      // Show final result
      if (errorCount === 0) {
        Ui.toast.success(_("success"))
      } else if (successCount === 0) {
        Ui.toast.error(_("error"))
      } else {
        // Partial success
        Ui.toast.success(_("partial-success", { success: successCount, total }))
        if (errors.length > 0) {
          Ui.toast.error(_("partial-error"), {
            description: errors.slice(0, 3).join(", ") + (errors.length > 3 ? ` +${errors.length - 3}` : ""),
          })
        }
      }
    },
  })

  return (
    <Form.Root form={form}>
      <Form.Files
        label={_("files-label")}
        name='files'
        classNames={{ wrapper: "relative", dropZone: "sticky top-12 z-10" }}
      />
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
    title: "Upload files",
    description:
      "Add new files to your media library. Remember to add alternative text and captions after upload for better accessibility.",
    "files-label": "Choose files to upload",
    "files-required": "You must select at least one file.",
    submit: "Upload files",
    success: "All files uploaded successfully",
    error: "Failed to upload files",
    progress: "Uploading {{counter}} / {{total}} files",
    "partial-success": "{{success}} of {{total}} files uploaded successfully",
    "partial-error": "Some files could not be uploaded",
  },
  fr: {
    title: "Importer des fichiers",
    description:
      "Ajoutez de nouveaux fichiers à votre médiathèque. N'oubliez pas d'ajouter du texte alternatif et des légendes après l'import pour une meilleure accessibilité.",
    "files-label": "Choisissez les fichiers à importer",
    "files-required": "Vous devez sélectionner au moins un fichier.",
    submit: "Importer les fichiers",
    success: "Tous les fichiers ont été importés avec succès",
    error: "Échec de l'import des fichiers",
    progress: "Import de {{counter}} / {{total}} fichiers",
    "partial-success": "{{success}} fichiers sur {{total}} importés avec succès",
    "partial-error": "Certains fichiers n'ont pas pu être importés",
  },
  de: {
    title: "Dateien hochladen",
    description:
      "Fügen Sie neue Dateien zu Ihrer Medienbibliothek hinzu. Denken Sie daran, nach dem Upload Alternativtext und Beschriftungen für bessere Barrierefreiheit hinzuzufügen.",
    "files-label": "Dateien zum Hochladen auswählen",
    "files-required": "Sie müssen mindestens eine Datei auswählen.",
    submit: "Dateien hochladen",
    success: "Alle Dateien erfolgreich hochgeladen",
    error: "Fehler beim Hochladen der Dateien",
    progress: "Lade {{counter}} / {{total}} Dateien hoch",
    "partial-success": "{{success}} von {{total}} Dateien erfolgreich hochgeladen",
    "partial-error": "Einige Dateien konnten nicht hochgeladen werden",
  },
}
