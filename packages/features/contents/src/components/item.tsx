import { Dashboard } from "@compo/dashboard"
import { Translation, useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, cxm, G } from "@compo/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Api } from "@services/dashboard"
import {
  ArrowDownToLine,
  ArrowUpToLine,
  CopyPlus,
  Edit,
  Ellipsis,
  FileText,
  Globe,
  GripHorizontal,
  Trash2,
} from "lucide-react"
import React from "react"
import { useContent } from "../context"
import { flattenClientItems } from "../utils.ssr"
import { IframePreview } from "./iframe-preview"

/**
 * Item
 * display the item
 */
export const Item: React.FC<{
  item: Api.ContentItem
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => void
  index?: number
  isOverlay?: boolean
}> = ({ item, index = -1, onKeyDown, isOverlay = false }) => {
  const { _ } = useTranslation(dictionary)
  const { toggleItemState } = useContent()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const { editItem } = useContent()

  return (
    <Ui.CollapsibleCard.Root
      id={item.id}
      ref={setNodeRef}
      style={style}
      className={cxm(
        "relative transition-all",
        isDragging ? "opacity-0" : "opacity-100",
        isOverlay && "z-20 opacity-75"
      )}
    >
      <Ui.CollapsibleCard.Header>
        <ItemTitle item={item} />
        <Ui.CollapsibleCard.Aside>
          {/* drag and drop grip button */}
          <Ui.Button
            {...listeners}
            {...attributes}
            variant='ghost'
            size='xs'
            icon
            onKeyDown={(e) => onKeyDown(e, item.id)}
          >
            <Ui.SrOnly>{_("drag-item")}</Ui.SrOnly>
            <GripHorizontal aria-hidden />
          </Ui.Button>

          {/* toggle state button */}
          <Ui.Tooltip.Quick
            tooltip={item.state === "published" ? _("state-published") : _("state-draft")}
            side='left'
            asChild
          >
            <Ui.Button variant='ghost' icon size='xs' onClick={() => toggleItemState(item)}>
              {item.state === "published" ? <Globe aria-hidden /> : <FileText aria-hidden />}
              <Ui.SrOnly>{item.state === "published" ? _("toggle-draft") : _("toggle-published")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>

          {/* edit button */}
          <Ui.Tooltip.Quick tooltip={_("edit")} side='left' asChild>
            <Ui.Button variant='ghost' size='xs' icon onClick={() => editItem(item)}>
              <Edit aria-hidden />
              <Ui.SrOnly>{_("edit")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>

          {/* open menu button */}
          <Ui.DropdownMenu.Quick menu={<ItemMenu item={item} index={index} />}>
            <Ui.Tooltip.Quick tooltip={_("open-menu")} side='left' asChild>
              <Ui.Button variant='ghost' icon size='xs'>
                <Ellipsis aria-hidden />
                <Ui.SrOnly>{_("open-menu")}</Ui.SrOnly>
              </Ui.Button>
            </Ui.Tooltip.Quick>
          </Ui.DropdownMenu.Quick>
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content>
        <Dashboard.Error
          fallbackRender={(props) => (
            <Dashboard.Trace {...props} title={_("render-error-title")} description={_("render-error-description")} />
          )}
        >
          <div
            data-theme='lcb'
            className={cxm("@container/preview isolate overflow-hidden", item.state === "draft" && "opacity-50")}
          >
            <ItemRender item={item} />
          </div>
        </Dashboard.Error>
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

/**
 * ItemMenu
 * display the item menu
 */
const ItemMenu: React.FC<{ item: Api.ContentItem; index: number }> = ({ item, index }) => {
  const { _ } = useTranslation(dictionary)
  const { confirmDelete, moveItemTo, content, duplicateItem } = useContent()
  const isFirst = index <= 0
  const isLast = index >= content.items.length - 1

  return (
    <>
      <Ui.Menu.Item onClick={() => moveItemTo(item, "top")} disabled={isFirst}>
        <ArrowUpToLine aria-hidden />
        {_("menu.move-top")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => moveItemTo(item, "bottom")} disabled={isLast}>
        <ArrowDownToLine aria-hidden />
        {_("menu.move-bottom")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => duplicateItem(item)}>
        <CopyPlus aria-hidden />
        {_("menu.duplicate")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => confirmDelete(item)}>
        <Trash2 aria-hidden />
        {_("menu.delete")}
      </Ui.Menu.Item>
    </>
  )
}

/**
 * ItemTitle
 * display the item title form item dictionary
 */
const ItemTitle: React.FC<{ item: Api.ContentItem }> = ({ item }) => {
  const { _ } = useTranslation(dictionary)
  const { items } = useContent()
  const itemsArray = flattenClientItems(items)
  const current = A.find(itemsArray, (i) => i.export.type === item.type)
  return (
    <Ui.CollapsibleCard.Title>
      {current ? <ItemTitleDisplayName dictionary={current.export.dictionary} /> : _("depreciated-item")}
    </Ui.CollapsibleCard.Title>
  )
}
const ItemTitleDisplayName: React.FC<{ dictionary: Translation }> = ({ dictionary }) => {
  const { _ } = useTranslation(dictionary)
  return <>{_("display-name")}</>
}

/**
 * ItemRender
 * display the item renderer
 */
export const ItemRender: React.FC<{ item: Api.ContentItem }> = ({ item }) => {
  const { _ } = useTranslation(dictionary)
  const { items, makePreviewItemUrl } = useContent()
  const locale = useContextualLanguage().current.code
  const itemsArray = flattenClientItems(items)
  const current = A.find(itemsArray, (i) => i.export.type === item.type)
  if (G.isNullable(current)) return <div className='text-muted-foreground p-6'>{_("depreciated-item")}</div>
  return <IframePreview item={item} locale={locale} makePreviewUrl={makePreviewItemUrl} />
}

/**
 * translation
 */
const dictionary = {
  fr: {
    edit: "Editer le block de contenu",
    "drag-item": "Déplacer le block de contenu",
    "open-menu": "Ouvrir le menu",
    "state-draft": "Brouillon (cliquer pour publier)",
    "state-published": "Publié (cliquer pour mettre en brouillon)",
    "depreciated-item": "Ce block de contenu n'existe plus",
    "render-error-title": "Erreur lors du rendu du block de contenu",
    "render-error-description":
      "Une erreur est survenue lors du rendu de ce block de contenu. Vous pouvez voir le message d'erreur ci-dessous, essayer de le réparer ou contacter l'assistance.",
    menu: {
      "move-top": "Déplacer en haut",
      "move-bottom": "Déplacer en bas",
      duplicate: "Dupliquer",
      delete: "Supprimer",
    },
  },
  de: {
    edit: "Inhalts-Block bearbeiten",
    "drag-item": "Inhalts-Block verschieben",
    "open-menu": "Menü öffnen",
    "state-draft": "Entwurf (klicken zum Veröffentlichen)",
    "state-published": "Veröffentlicht (klicken für Entwurf)",
    "depreciated-item": "Dieser Inhalts-Block existiert nicht mehr",
    "render-error-title": "Fehler beim Rendern des Inhalts-Blocks",
    "render-error-description":
      "Ein Fehler ist beim Rendern dieses Inhalts aufgetreten. Sie können die Fehlermeldung unten sehen, versuchen Sie, sie zu beheben oder wenden Sie sich an den Support.",
    menu: {
      "move-top": "Nach oben verschieben",
      "move-bottom": "Nach unten verschieben",
      duplicate: "Duplizieren",
      delete: "Löschen",
    },
  },
  en: {
    edit: "Edit content block",
    "drag-item": "Drag content block",
    "open-menu": "Open menu",
    "state-draft": "Draft (click to publish)",
    "state-published": "Published (click to set to draft)",
    "depreciated-item": "This content block no longer exists",
    "render-error-title": "Error rendering content block",
    "render-error-description":
      "An error occurred while rendering this content. You can see the error message below, try to fix it or report it to support.",
    menu: {
      "move-top": "Move to top",
      "move-bottom": "Move to bottom",
      duplicate: "Duplicate",
      delete: "Delete",
    },
  },
} satisfies Translation
