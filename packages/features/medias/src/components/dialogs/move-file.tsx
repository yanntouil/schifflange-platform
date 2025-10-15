import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMediasService } from "../../service.context"
import { FormMediaFolder } from "../form/folder"

/**
 * MoveFileDialog
 */
export const MoveFileDialog: React.FC<Ui.QuickDialogProps<Api.MediaFileWithRelations>> = ({ item, ...props }) => {
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
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.MediaFileWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMediasService()
  const serviceFile = service.files.id(item.id)

  const form = useForm<{ folderId: string | null }>({
    allowSubmitAttempt: true,
    values: { folderId: item.folderId },
    onSubmit: async ({ values }) =>
      match(await serviceFile.update(values))
        .with({ failed: true }, () => Ui.toast.error(_("error")))
        .otherwise(async ({ data: { file } }) => {
          Ui.toast.success(_("success"))
          await mutate?.(file)
          close()
        }),
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <FormMediaFolder name='folderId' rootId={item.folderId} />
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
    title: "Move file",
    description:
      "Choose the destination folder where you want to move this file. The file will be relocated while preserving its metadata and accessibility attributes.",
    submit: "Move file",
    success: "File moved successfully",
    error: "Failed to move file",
  },
  fr: {
    title: "Déplacer le fichier",
    description:
      "Choisissez le dossier de destination où vous souhaitez déplacer ce fichier. Le fichier sera déplacé en conservant ses métadonnées et attributs d'accessibilité.",
    submit: "Déplacer le fichier",
    success: "Fichier déplacé avec succès",
    error: "Échec du déplacement du fichier",
  },
  de: {
    title: "Datei verschieben",
    description:
      "Wählen Sie den Zielordner aus, in den Sie diese Datei verschieben möchten. Die Datei wird unter Beibehaltung ihrer Metadaten und Barrierefreiheitsattribute verschoben.",
    submit: "Datei verschieben",
    success: "Datei erfolgreich verschoben",
    error: "Fehler beim Verschieben der Datei",
  },
}
