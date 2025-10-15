import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api, useDashboardService } from "@services/dashboard"
import saveAs from "file-saver"
import {
  Copy,
  Crop,
  Download,
  Edit,
  Ellipsis,
  Folders,
  Info,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash,
  TvMinimal,
} from "lucide-react"
import React from "react"
import { useMedias } from "../../medias.context"
import { makeFullName } from "../../utils"
import { CommonMenu } from "../menu"

/**
 * FileMenu
 * This component is used to display the file menu
 */
export const FileMenu: React.FC<{
  item: Api.MediaFileWithRelations
  onQuickSelect?: () => void
}> = ({ item, onQuickSelect }) => {
  const ctx = useMedias()
  const {
    service: { makePath },
  } = useDashboardService()
  const { _ } = useTranslation(dictionary)
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(item)
  const { previewFile, canPreview } = Ui.useLightboxPreview(item.id)
  return (
    <CommonMenu item={item}>
      {ctx.canSelectFile &&
        (onQuickSelect && !ctx.multiple ? (
          <Ui.Menu.Item onClick={() => onQuickSelect()}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ) : (
          isContextMenu &&
          (isSelected ? (
            <Ui.Menu.Item onClick={() => ctx.unselect(item)}>
              <SquareDashedMousePointer aria-hidden />
              {_("unselect")}
            </Ui.Menu.Item>
          ) : (
            <Ui.Menu.Item onClick={() => ctx.select(item)}>
              <SquareMousePointer aria-hidden />
              {_("select")}
            </Ui.Menu.Item>
          ))
        ))}

      {canPreview && (
        <Ui.Menu.Item onClick={() => previewFile()}>
          <TvMinimal aria-hidden />
          {_("preview")}
        </Ui.Menu.Item>
      )}

      <Ui.Menu.Item onClick={() => ctx.editFile(item)}>
        <Edit aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Item onClick={() => saveAs(makePath(item.url, true), makeFullName(item))}>
        <Download aria-hidden />
        {_("download")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.fileInfo(item)}>
            <Info aria-hidden />
            {_("info")}
          </Ui.Menu.Item>

          <Ui.Menu.Item onClick={() => ctx.copyFile(item)}>
            <Copy aria-hidden />
            {_("copy")}
          </Ui.Menu.Item>

          {Ui.isSharpExtension(item.extension) && (
            <Ui.Menu.Item onClick={() => ctx.cropFile(item)}>
              <Crop aria-hidden />
              {_("crop")}
            </Ui.Menu.Item>
          )}

          <Ui.Menu.Item onClick={() => ctx.moveFile(item)}>
            <Folders aria-hidden />
            {_("move")}
          </Ui.Menu.Item>

          <Ui.Menu.Separator />

          <Ui.Menu.Item onClick={() => ctx.confirmDeleteFile(item)}>
            <Trash aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>
    </CommonMenu>
  )
}
/**
 * FileLightboxMenu
 * This component is used to display the file menu in the lightbox
 */
export const FileLightboxMenu: React.FC<{
  item: Api.MediaFileWithRelations
  onQuickSelect?: () => void
}> = () => {
  return <></>
}
const dictionary = {
  fr: {
    select: "Sélectionner",
    unselect: "Désélectionner",
    preview: "Aperçu",
    download: "Télécharger",
    delete: "Supprimer",
    move: "Déplacer vers...",
    copy: "Dupliquer",
    crop: "Recadrer",
    info: "Informations",
    edit: "Modifier",
    more: "Plus d'actions",
  },
  de: {
    select: "Auswählen",
    unselect: "Abwählen",
    preview: "Vorschau",
    download: "Herunterladen",
    delete: "Löschen",
    move: "Verschieben nach...",
    copy: "Duplizieren",
    crop: "Zuschneiden",
    info: "Informationen",
    edit: "Bearbeiten",
    more: "Weitere Aktionen",
  },
  en: {
    select: "Select",
    unselect: "Unselect",
    preview: "Preview",
    download: "Download",
    delete: "Delete",
    move: "Move to...",
    copy: "Duplicate",
    crop: "Crop",
    info: "Information",
    edit: "Edit",
    more: "More actions",
  },
}
