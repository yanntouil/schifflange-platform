import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMediasService } from "../../service.context"
import { FormMediaFolder } from "../form/folder"

/**
 * MoveFolderDialog
 */
export const MoveFolderDialog: React.FC<Ui.QuickDialogProps<Api.MediaFolderWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-20", close: "z-20" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.MediaFolderWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMediasService()
  const serviceFolder = service.folders.id(item.id)

  const form = useForm<{ parentId: string | null }>({
    allowSubmitAttempt: true,
    values: { parentId: item.parentId },
    onSubmit: async ({ values }) =>
      match(await serviceFolder.update(values))
        .with({ failed: true }, () => Ui.toast.error(_("error")))
        .otherwise(async ({ data: { folder } }) => {
          Ui.toast.success(_("success"))
          await mutate?.(folder)
          close()
        }),
  })

  return (
    <Form.Root form={form}>
      <Form.Assertive />
      <FormMediaFolder name='parentId' hiddenIds={[item.id]} rootId={item.parentId} />
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
    title: "Move folder",
    description:
      "Choose the destination folder where you want to move this folder. All files and subfolders will be moved while preserving their organization and metadata.",
    "folder-label": "Destination folder",
    submit: "Move folder",
    success: "Folder moved successfully",
    error: "Failed to move folder",
  },
  fr: {
    title: "Déplacer le dossier",
    description:
      "Choisissez le dossier de destination où vous souhaitez déplacer ce dossier. Tous les fichiers et sous-dossiers seront déplacés en conservant leur organisation et métadonnées.",
    "folder-label": "Dossier de destination",
    submit: "Déplacer le dossier",
    success: "Dossier déplacé avec succès",
    error: "Échec du déplacement du dossier",
  },
  de: {
    title: "Ordner verschieben",
    description:
      "Wählen Sie den Zielordner aus, in den Sie diesen Ordner verschieben möchten. Alle Dateien und Unterordner werden unter Beibehaltung ihrer Organisation und Metadaten verschoben.",
    "folder-label": "Zielordner",
    submit: "Ordner verschieben",
    success: "Ordner erfolgreich verschoben",
    error: "Fehler beim Verschieben des Ordners",
  },
}
