import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { cx, cxm, placeholder } from "@compo/utils"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Ellipsis, FileText, Globe, GripHorizontal, Plus } from "lucide-react"
import React from "react"
import { match } from "ts-pattern"
import { useMenu } from "../../menu.context"
import { CreateDialogProps } from "./item-create"
import { Preview } from "./preview"

/**
 * Reorderable
 * allow to reorder items and create new ones
 */
export const Reorderable: React.FC<{
  item: Api.MenuItemWithRelations
  createItem?: (value: CreateDialogProps) => void
  editItem?: (item: Api.MenuItemWithRelations) => void
  children?: (item: Api.MenuItemWithRelations, index: number) => React.ReactNode
  menu: (item: Api.MenuItemWithRelations, index: number) => React.ReactNode
  depth?: number
}> = ({ item, children, menu, createItem, editItem, depth = 0 }) => {
  const { _ } = useTranslation(dictionary)
  const { swr, reorderMenuItems } = useMenu()

  const items = React.useMemo(
    () => swr.menu.items.filter(({ parentId }) => parentId === item.id).sort((a, b) => a.order - b.order),
    [swr.menu.items, item.id]
  )

  // drag and drop reordering
  const [active, setActive] = React.useState<Api.MenuItemWithRelations | null>(null)
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      setActive(null)
      const { active, over } = event
      if (active.id !== over?.id) {
        const list = items.map((item) => item.id)
        const oldIndex = list.indexOf(active.id as string)
        const newIndex = list.indexOf(over!.id as string)
        reorderMenuItems(arrayMove(list, oldIndex, newIndex), item.id)
      }
    },
    [items, reorderMenuItems, item.id]
  )
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string
    const item = items.find((item) => item.id === id)
    setActive(item ?? null)
  }
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  // keyboard accessibility reordering
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      const keyCode = e.key
      if (!["ArrowUp", "ArrowDown"].includes(keyCode)) return
      e.preventDefault()
      const list = items.map((item) => item.id)
      const oldIndex = list.indexOf(id as string)
      switch (keyCode) {
        case "ArrowUp": {
          const newIndex = oldIndex - 1
          if (newIndex < 0) return
          reorderMenuItems(arrayMove(list, oldIndex, newIndex), item.id)
          break
        }
        case "ArrowDown": {
          const newIndex = oldIndex + 1
          if (newIndex >= list.length) return
          reorderMenuItems(arrayMove(list, oldIndex, newIndex), item.id)
          break
        }
      }
    },
    [items, reorderMenuItems, item.id]
  )
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={cx("grid grid-cols-1")}>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ReorderableItem
                key={item.id}
                item={item}
                onKeyDown={onKeyDown}
                index={index}
                children={children}
                menu={menu}
                createItem={createItem}
                editItem={editItem}
              />
            </React.Fragment>
          ))}
        </div>
        <DragOverlay adjustScale={false}>
          {active && (
            <ReorderableItem
              item={active}
              onKeyDown={onKeyDown}
              isOverlay
              children={children}
              menu={menu}
              createItem={createItem}
              editItem={editItem}
              depth={depth}
            />
          )}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  )
}

const ReorderableItem: React.FC<{
  item: Api.MenuItemWithRelations
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => void
  index?: number
  isOverlay?: boolean
  children?: (item: Api.MenuItemWithRelations, index: number) => React.ReactNode
  menu: (item: Api.MenuItemWithRelations, index: number) => React.ReactNode
  createItem?: (value: CreateDialogProps) => void
  editItem?: (item: Api.MenuItemWithRelations) => void
  depth?: number
}> = ({ item, onKeyDown, index = -1, isOverlay = false, children, menu, createItem, editItem, depth = 0 }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { toggleItemState, swr } = useMenu()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const isGroup = item.type === "group"

  const isValidLink = React.useMemo(() => {
    return match(item.type)
      .with("resource", () => (item.slug?.page || item.slug?.article)?.state === "published")
      .with("link", () => typeof item.props?.link === "string" && item.props?.link.trim().length > 0)
      .with("url", () => {
        const url = translate(item, servicePlaceholder.menuItem).props.url
        return typeof url === "string" && url.trim().length > 0
      })
      .otherwise(() => false)
  }, [item, translate])

  const isEachParentPublished = React.useMemo(() => {
    // Recursive function to check if all parents are published
    const checkParentsPublished = (parentId: string | null): boolean => {
      // If no parent, we've reached the root - all parents are published
      if (!parentId) return true

      // Find the parent item
      const parent = swr.menu.items.find((menuItem) => menuItem.id === parentId)

      // If parent not found or not published, return false
      if (!parent || parent.state !== "published") return false

      // Recursively check the parent's parent
      return checkParentsPublished(parent.parentId)
    }

    return checkParentsPublished(item.parentId)
  }, [swr.menu.items, item.parentId])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cx(
        "relative rounded-md bg-card pl-4 ring-offset-2 ring-offset-background transition-all",
        isDragging ? "opacity-0" : "opacity-100",
        isOverlay ? "z-20 opacity-75" : ""
      )}
    >
      <div className='flex select-none items-center gap-2 py-4'>
        <Ui.Button {...listeners} {...attributes} variant='ghost' size='sm' onKeyDown={(e) => onKeyDown(e, item.id)}>
          <span className='sr-only'>{_("drag-item")}</span>
          <GripHorizontal aria-hidden />
        </Ui.Button>
        <Title item={item}>
          {placeholder(translate({ translations: item.translations }, { name: _("name-ph") }).name, _("name-ph"))}
        </Title>
        <div className='flex items-center gap-2'>
          {isGroup ? (
            <>
              {createItem && (
                <Ui.Tooltip.Quick tooltip={_("create-item-tooltip")} asChild>
                  <Ui.Button variant='ghost' size='sm' onClick={() => createItem({ order: -1, parentId: item.id })}>
                    <Plus aria-hidden />
                    {_("create-item")}
                  </Ui.Button>
                </Ui.Tooltip.Quick>
              )}
            </>
          ) : (
            <Ui.HoverCard.Root>
              <Ui.HoverCard.Trigger asChild>
                <Ui.Button variant={isValidLink ? "outline" : "destructive"} size='sm' className='text-[10px]'>
                  {_(`type-${item.type}`)}
                </Ui.Button>
              </Ui.HoverCard.Trigger>
              <Ui.HoverCard.Content
                align='start'
                side='left'
                className='p-0 border-none bg-transparent shadow-none overflow-y-visible'
              >
                <Preview item={item} />
              </Ui.HoverCard.Content>
            </Ui.HoverCard.Root>
          )}

          {/* toggle state button */}
          <Ui.Tooltip.Quick
            tooltip={item.state === "published" && isEachParentPublished ? _("state-published") : _("state-draft")}
            asChild
          >
            <Ui.Button
              variant='ghost'
              size='sm'
              onClick={() => toggleItemState(item)}
              disabled={!isEachParentPublished}
            >
              {item.state === "published" && isEachParentPublished ? (
                <Globe className='text-green-600' aria-hidden />
              ) : (
                <FileText className='text-muted-foreground' aria-hidden />
              )}
            </Ui.Button>
          </Ui.Tooltip.Quick>

          {/* open menu button */}
          <Ui.DropdownMenu.Root>
            <Ui.DropdownMenu.Trigger asChild>
              <Ui.Tooltip.Quick tooltip={_("open-menu")} asChild>
                <Ui.Button variant='ghost' size='sm'>
                  <Ellipsis aria-hidden />
                  <span className='sr-only'>{_("open-menu")}</span>
                </Ui.Button>
              </Ui.Tooltip.Quick>
            </Ui.DropdownMenu.Trigger>
            <Ui.DropdownMenu.Content>{menu(item, index)}</Ui.DropdownMenu.Content>
          </Ui.DropdownMenu.Root>
        </div>
      </div>
      {isGroup ? (
        <Reorderable item={item} menu={menu} depth={depth + 1} editItem={editItem}>
          {children}
        </Reorderable>
      ) : (
        // diplay template of the menu item
        <div className=''>{children?.(item, index)}</div>
      )}
    </div>
  )
}

const Title: React.FC<React.ComponentPropsWithoutRef<"div"> & { item: Api.MenuItemWithRelations }> = ({
  children,
  item,
  className,
  ...props
}) => {
  const { editItem } = useMenu()
  return (
    <div
      className={cxm("cursor-pointer grow text-sm font-semibold", className)}
      {...props}
      onClick={(e) => editItem(item)}
    >
      {children}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "create-item": "Ajouter un élément",
    "create-item-tooltip": "Ajouter un élément enfant de ce groupe",
    "state-draft": "Brouillon",
    "state-published": "Publié",
    "toggle-draft": "Mettre en brouillon",
    "toggle-published": "Publier",
    "open-menu": "Ouvrir le menu",
    "render-error-title": "Erreur de rendu",
    "render-error-description": "Une erreur est survenue lors du rendu du menu",
    "name-ph": "Lien sans nom",
    "drag-item": "Déplacer l'élément",
    "type-url": "Lien",
    "type-link": "Lien",
    "type-group": "Groupe",
    "type-resource": "Ressource",
  },
  de: {
    "create-item": "Element hinzufügen",
    "create-item-tooltip": "Ein neues Unterelement zu dieser Gruppe hinzufügen",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
    "toggle-draft": "Als Entwurf speichern",
    "toggle-published": "Veröffentlichen",
    "open-menu": "Menü öffnen",
    "render-error-title": "Darstellungsfehler",
    "render-error-description": "Beim Darstellen des Menüs ist ein Fehler aufgetreten",
    "name-ph": "Link ohne Namen",
    "drag-item": "Element verschieben",
    "type-url": "Link",
    "type-link": "Link",
    "type-group": "Gruppe",
    "type-resource": "Ressource",
  },
  en: {
    "create-item": "Add item",
    "create-item-tooltip": "Add a new item child of this group",
    "state-draft": "Draft",
    "state-published": "Published",
    "toggle-draft": "Put in draft",
    "toggle-published": "Publish",
    "open-menu": "Open menu",
    "render-error-title": "Render error",
    "render-error-description": "An error occurred while rendering the menu",
    "name-ph": "Link without name",
    "drag-item": "Drag item",
    "type-url": "Link",
    "type-link": "Link",
    "type-group": "Group",
    "type-resource": "Resource",
  },
}
