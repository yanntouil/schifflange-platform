import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { cx, cxm } from "@compo/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Ellipsis, FileText, Globe, GripHorizontal, Plus } from "lucide-react"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useMenu } from "../../menu.context"
import { CreateDialogProps } from "./item-create"
import { ItemMenu } from "./item-menu"

/**
 * display a first level item inside a collapsible card, allow to reorder children items and create new one
 */
export const Item: React.FC<{
  item: Api.MenuItemWithRelations
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => void
  index?: number
  isOverlay?: boolean
  children: (item: Api.MenuItemWithRelations) => React.ReactNode
  createItem: (value: CreateDialogProps) => void
}> = ({ item, onKeyDown, index = -1, isOverlay = false, children }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { editItem, createSubItem, toggleItemState } = useMenu()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const isGroup = item.type === "group"

  const translation = translate(item, servicePlaceholder.menuItem)

  return (
    <Ui.CollapsibleCard.Root
      id={item.id}
      ref={setNodeRef}
      style={style}
      disabled={!isGroup}
      hideOnDisabled={!isGroup}
      className={cx(
        "relative transition-all",
        isDragging ? "opacity-0" : "opacity-100",
        isOverlay && "z-20 opacity-75"
      )}
    >
      <Ui.CollapsibleCard.Header className='@lg/card:pl-2 pl-2'>
        <div className='flex items-center gap-2'>
          {/* drag and drop grip button */}
          <Ui.Button {...listeners} {...attributes} variant='ghost' size='sm' onKeyDown={(e) => onKeyDown(e, item.id)}>
            <GripHorizontal aria-hidden />
          </Ui.Button>
          <Title item={item}>{translation.name}</Title>
        </div>
        <Ui.CollapsibleCard.Aside hideToggleTrigger>
          {isGroup ? (
            <Ui.Tooltip.Quick tooltip={_("create-item-tooltip")} asChild>
              <Ui.Button variant='ghost' size='sm' onClick={() => createSubItem({ order: -1, parentId: item.id })}>
                <Plus aria-hidden />
                {_("create-item")}
              </Ui.Button>
            </Ui.Tooltip.Quick>
          ) : (
            <Ui.Button variant='outline' size='sm' className='text-[10px]'>
              {_(`type-${item.type}`)}
            </Ui.Button>
          )}

          {/* toggle state button */}
          <Ui.Tooltip.Quick tooltip={item.state === "published" ? _("state-published") : _("state-draft")} asChild>
            <Ui.Button variant='ghost' size='sm' onClick={() => toggleItemState(item)}>
              {item.state === "published" ? (
                <Globe className='text-green-600' aria-hidden />
              ) : (
                <FileText className='text-muted-foreground' aria-hidden />
              )}
            </Ui.Button>
          </Ui.Tooltip.Quick>

          {/* open menu button */}
          <Ui.DropdownMenu.Quick menu={<ItemMenu item={item} />}>
            <Ui.Button variant='ghost' size='sm'>
              <Ellipsis aria-hidden />
            </Ui.Button>
          </Ui.DropdownMenu.Quick>
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      {isGroup && (
        <Ui.CollapsibleCard.Content>
          <ErrorBoundary fallback={<div className='text-sm text-destructive'>{_("render-error")}</div>}>
            <div className={cx("pr-6 pl-2 pb-6")}>{children(item)}</div>
          </ErrorBoundary>
        </Ui.CollapsibleCard.Content>
      )}
    </Ui.CollapsibleCard.Root>
  )
}

const Title: React.FC<React.ComponentPropsWithoutRef<"div"> & { item: Api.MenuItemWithRelations }> = ({
  children,
  item,
  className,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  const { open, onOpenChange } = Ui.useCollapsibleCard()
  const { editItem } = useMenu()

  return (
    <Ui.CollapsibleCard.Title
      className={cxm("cursor-pointer group", className)}
      onClick={(e: React.MouseEvent) => {
        if (e.shiftKey) editItem(item)
        else onOpenChange(!open)
      }}
      {...props}
    >
      {children}
      <Ui.Kbd.Shortcut className='group-hover:opacity-100 opacity-0 transition-opacity duration-200 delay-100'>
        {_("edit-item")}
      </Ui.Kbd.Shortcut>
    </Ui.CollapsibleCard.Title>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "edit-item": "+ Shift pour modifier",
    "create-item": "Ajouter un élément",
    "create-item-tooltip": "Ajouter un élément enfant de ce groupe",
    "name-ph": "Élément sans nom",
    "render-error": "Erreur de rendu",
    "type-url": "URL externe",
    "type-link": "Lien interne",
    "type-group": "Groupe",
    "type-resource": "Ressource",
    "state-published": "Publié",
    "state-draft": "Brouillon",
  },
  de: {
    "edit-item": "+ Shift zum Bearbeiten",
    "create-item": "Element hinzufügen",
    "create-item-tooltip": "Ein neues Unterelement zu dieser Gruppe hinzufügen",
    "name-ph": "Element ohne Namen",
    "render-error": "Darstellungsfehler",
    "type-url": "Externe URL",
    "type-link": "Interner Link",
    "type-group": "Gruppe",
    "type-resource": "Ressource",
    "state-published": "Veröffentlicht",
    "state-draft": "Entwurf",
  },
  en: {
    "edit-item": "+ Shift to edit",
    "create-item": "Add item",
    "create-item-tooltip": "Add a new item child of this group",
    "name-ph": "Unnamed item",
    "render-error": "Render error",
    "type-url": "External URL",
    "type-link": "Internal link",
    "type-group": "Group",
    "type-resource": "Resource",
    "state-published": "Published",
    "state-draft": "Draft",
  },
}
