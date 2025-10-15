import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, O } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useMediasFolder } from "../../folder.context"
import { useMediasService } from "../../service.context"
import { isMediaFile, isMediaFolder } from "../../utils"
import { FormMediaFolder } from "../form/folder"

/**
 * MoveFileDialog
 */
export const MoveSelectionDialog: React.FC<
  Ui.QuickDialogProps<
    (Api.MediaFileWithRelations | Api.MediaFolderWithRelations)[],
    Api.MediaFileWithRelations | Api.MediaFolderWithRelations
  >
> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<
  Ui.QuickDialogSafeProps<
    (Api.MediaFileWithRelations | Api.MediaFolderWithRelations)[],
    Api.MediaFileWithRelations | Api.MediaFolderWithRelations
  >
> = ({ close, mutate, item: items }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const { service } = useMediasService()
  const { folderId } = useMediasFolder()
  const disabledIds = React.useMemo(() => {
    return A.filterMap(items, (item) => {
      if (isMediaFolder(item)) return O.Some(item.id)
      return O.None
    })
  }, [items])

  const initialValues = {
    folderId,
  }

  const form = useForm<{ folderId: string | null }>({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const total = items.length
      let successCount = 0
      let errorCount = 0
      const errors: string[] = []

      const toastId = Ui.toast.loading(_("progress", { counter: 0, total }))

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const counter = i + 1

        if (isMediaFile(item)) {
          const result = await service.files.id(item.id).update(values)
          if (result.failed) {
            errorCount++
            errors.push(translate(item, servicePlaceholder.mediaFile).name)
          } else {
            successCount++
            await mutate?.(result.data.file)
          }
        } else {
          const result = await service.folders.id(item.id).update({ parentId: values.folderId })
          if (result.failed) {
            errorCount++
            errors.push(item.name)
          } else {
            successCount++
            await mutate?.(result.data.folder)
          }
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

      close()
    },
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <FormMediaFolder name='folderId' rootId={folderId} disabledIds={disabledIds as string[]} />
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
    title: "Move selection",
    description:
      "Choose the destination folder where you want to move the selected files and folders. All items will be relocated while preserving their metadata and organization.",
    submit: "Move selection",
    success: "Selection moved successfully",
    error: "Failed to move some items",
    progress: "Moving {{counter}} / {{total}} items",
    "partial-success": "{{success}} of {{total}} items moved successfully",
    "partial-error": "Some items could not be moved",
  },
  fr: {
    title: "Déplacer la sélection",
    description:
      "Choisissez le dossier de destination où vous souhaitez déplacer les fichiers et dossiers sélectionnés. Tous les éléments seront déplacés en conservant leurs métadonnées et organisation.",
    submit: "Déplacer la sélection",
    success: "Sélection déplacée avec succès",
    error: "Échec du déplacement de certains éléments",
    progress: "Déplacement de {{counter}} / {{total}} éléments",
    "partial-success": "{{success}} éléments sur {{total}} déplacés avec succès",
    "partial-error": "Certains éléments n'ont pas pu être déplacés",
  },
  de: {
    title: "Auswahl verschieben",
    description:
      "Wählen Sie den Zielordner aus, in den Sie die ausgewählten Dateien und Ordner verschieben möchten. Alle Elemente werden unter Beibehaltung ihrer Metadaten und Organisation verschoben.",
    submit: "Auswahl verschieben",
    success: "Auswahl erfolgreich verschoben",
    error: "Fehler beim Verschieben einiger Elemente",
    progress: "Verschiebe {{counter}} / {{total}} Elemente",
    "partial-success": "{{success}} von {{total}} Elementen erfolgreich verschoben",
    "partial-error": "Einige Elemente konnten nicht verschoben werden",
  },
}
