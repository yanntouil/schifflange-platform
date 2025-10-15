import { DictionaryFn, Translation, useTranslation } from "@compo/localize"
import { Primitives, Ui, variants } from "@compo/ui"
import { A, G, cxm, match } from "@compo/utils"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, Copy, Ellipsis, GripHorizontal, MinusSquare, Plus } from "lucide-react"
import React from "react"
import { FormReorderableContext, useFormReorderableContext } from "./reorderable-context"

/**
 * FormReorderableList
 */
export type FormReorderableListProps = {
  items: string[]
  create?: () => string
  duplicate?: (props: { id: string; index: number }) => void
  remove?: (props: { id: string; index: number }) => void
  reorder?: (from: number, to: number) => void
  title?: (props: { id: string; index: number }) => React.ReactNode
  level?: string | number
  t?: DictionaryFn
  children: (props: { id: string; index: number }) => React.ReactNode
  value?: string | undefined
  onValueChange?: (value: string | undefined) => void
}
export const FormReorderableList: React.FC<FormReorderableListProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { items, create, title, level, duplicate, remove, reorder, t = _, children, value } = props
  const [item, setItem] = React.useState<string | undefined>(value)
  const onValueChange = (value: string | undefined) => {
    setItem(value)
    props.onValueChange?.(value)
  }

  // drag and drop reordering
  const [active, setActive] = React.useState<string | null>(null)
  const onDragEnd = (event: DragEndEvent) => {
    setActive(null)
    const { active, over } = event
    if (!(over && active.id !== over.id) || !reorder) return
    const oldIndex = A.getIndexBy(items, (id) => id === active.id)
    const newIndex = A.getIndexBy(items, (id) => id === over.id)
    if (G.isNullable(oldIndex) || G.isNullable(newIndex)) return
    reorder(oldIndex, newIndex)
  }
  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string
    const item = A.find(items, (item) => item === id)
    setActive(item ?? null)
  }
  const onDragCancel = () => {
    setActive(null)
  }
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  const itemProps = { title, level, remove, reorder, duplicate, t }

  return (
    <FormReorderableContext.Provider value={{ items, item, setItem }}>
      <Primitives.Accordion.Root type='single' value={item} onValueChange={onValueChange} collapsible>
        <div className='flex w-full flex-col items-start gap-4'>
          {A.isNotEmpty(items) &&
            (G.isNotNullable(reorder) ? (
              <DndContext
                collisionDetection={pointerWithin}
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
                onDragCancel={onDragCancel}
                sensors={sensors}
              >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  <ul className='w-full space-y-4'>
                    {A.mapWithIndex(items, (index, id) => (
                      <Item id={id} index={index} key={id} {...itemProps}>
                        {children({ id, index })}
                      </Item>
                    ))}
                    <Primitives.Portal>
                      <DragOverlay adjustScale={false}>
                        {active && (
                          <ItemOverlay id={active} index={-1} {...itemProps}>
                            {children({ id: active, index: -1 })}
                          </ItemOverlay>
                        )}
                      </DragOverlay>
                    </Primitives.Portal>
                  </ul>
                </SortableContext>
              </DndContext>
            ) : (
              <ul className='w-full space-y-4'>
                {A.mapWithIndex(items, (index, id) => (
                  <Item id={id} index={index} key={id} {...itemProps}>
                    {children({ id, index })}
                  </Item>
                ))}
              </ul>
            ))}
          {create && (
            <Ui.Button
              onClick={() => {
                setItem(create())
              }}
              variant='outline'
            >
              <Plus aria-hidden />
              {t("create", { defaultValue: _("create") })}
            </Ui.Button>
          )}
        </div>
      </Primitives.Accordion.Root>
    </FormReorderableContext.Provider>
  )
}

/**
 * Item
 * wrapper for the children items
 */
type ItemProps = {
  id: string
  index: number
  title?: (props: { id: string; index: number }) => React.ReactNode
  level?: string | number
  remove?: (props: { id: string; index: number }) => void
  duplicate?: (props: { id: string; index: number }) => void
  reorder?: (from: number, to: number) => void
  t: DictionaryFn
  children: React.ReactNode
}
const Item: React.FC<ItemProps> = ({ id, index, title, level = 4, children, reorder, t, remove, duplicate }) => {
  const { _ } = useTranslation(dictionary)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const { items, item } = useFormReorderableContext()

  // keyboard accessibility reordering
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!reorder || !(e.key === "ArrowUp" || e.key === "ArrowDown")) return
    e.preventDefault()
    match(e.key)
      .with("ArrowUp", () => {
        const newIndex = index - 1
        if (newIndex < 0) return
        reorder(index, newIndex)
      })
      .with("ArrowDown", () => {
        const newIndex = index + 1
        if (newIndex >= items.length) return
        reorder(index, newIndex)
      })
  }

  // move focus to collapse button on collapsed and scroll to top of the card dont re focus if item is already open
  const focusRef = React.useRef<HTMLButtonElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const itemRef = React.useRef<string | undefined>(item)
  // React.useEffect(() => {
  //   if (focusRef.current && item === id && itemRef.current !== id) {
  //     focusRef.current.focus()
  //     headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  //     itemRef.current = id
  //   }
  // }, [focusRef, item, id])

  return (
    <Primitives.Accordion.Item value={id} asChild>
      <Card
        ref={setNodeRef}
        id={id}
        style={style}
        className={cxm(G.isNotNullable(reorder) && "border-dashed", isDragging ? "z-20 opacity-0" : "opacity-100")}
      >
        <Primitives.Accordion.Header asChild>
          <CardHeader ref={headerRef}>
            <CardHeaderTitle level={level}>
              {title ? title({ id, index }) : t("title", { defaultValue: _("title") })}
            </CardHeaderTitle>
            <CardHeaderAside>
              {G.isNotNullable(reorder) && <ButtonReorder {...listeners} {...attributes} onKeyDown={onKeyDown} />}
              {(remove || duplicate) && (
                <Ui.DropdownMenu.Quick
                  menu={
                    <>
                      {duplicate && (
                        <Ui.Menu.Item onSelect={() => duplicate({ id, index })}>
                          <Copy aria-hidden />
                          {t("duplicate", { defaultValue: _("duplicate") })}
                        </Ui.Menu.Item>
                      )}
                      {remove && (
                        <Ui.Menu.Item onSelect={() => remove({ id, index })}>
                          <MinusSquare aria-hidden />
                          {t("remove", { defaultValue: _("remove") })}
                        </Ui.Menu.Item>
                      )}
                    </>
                  }
                >
                  <ButtonMenu />
                </Ui.DropdownMenu.Quick>
              )}
              <Primitives.Accordion.Trigger asChild>
                <ButtonCollapse ref={focusRef} />
              </Primitives.Accordion.Trigger>
            </CardHeaderAside>
          </CardHeader>
        </Primitives.Accordion.Header>
        <Primitives.Accordion.Content
          className={cxm(
            "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          )}
        >
          <CardContent>{children}</CardContent>
        </Primitives.Accordion.Content>
      </Card>
    </Primitives.Accordion.Item>
  )
}

/**
 * ItemOverlay
 * display the item overlay when dragging
 */
const ItemOverlay: React.FC<ItemProps> = ({ id, index, title, level = 4, children, t, remove, duplicate }) => {
  const { _ } = useTranslation(dictionary)
  const { item } = useFormReorderableContext()
  const isOpen = item === id
  return (
    <Card className='border-dashed opacity-75'>
      <CardHeader>
        <CardHeaderTitle level={level}>
          {title ? title({ id, index }) : t("title", { defaultValue: _("title") })}
        </CardHeaderTitle>
        <CardHeaderAside>
          <ButtonReorder />
          {(remove || duplicate) && <ButtonMenu />}
          <ButtonCollapse />
        </CardHeaderAside>
      </CardHeader>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  )
}

/**
 * components
 */
const ButtonReorder: React.FC<React.ComponentProps<typeof Ui.Button>> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Button {...props} variant='ghost' size='xxs' icon className={cxm("text-muted-foreground/50", className)}>
      <GripHorizontal aria-hidden />
      <Ui.SrOnly>{_("reorder")}</Ui.SrOnly>
    </Ui.Button>
  )
}
const ButtonMenu = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Ui.Button>>(
  ({ className, ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    return (
      <Ui.Button variant='ghost' icon size='xxs' {...props} ref={ref}>
        <Ellipsis aria-hidden />
        <Ui.SrOnly>{_("menu")}</Ui.SrOnly>
      </Ui.Button>
    )
  }
)
ButtonMenu.displayName = "ButtonMenu"
const ButtonCollapse = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Ui.Button>>(
  ({ className, ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    return (
      <Ui.Button
        {...props}
        variant='ghost'
        size='xxs'
        icon
        className={cxm(
          "text-muted-foreground/50 [&>svg]:transition-transform [&>svg]:duration-200 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        ref={ref}
      >
        <ChevronDown aria-hidden />
        <Ui.SrOnly>{_("accordion-toggle")}</Ui.SrOnly>
      </Ui.Button>
    )
  }
)
ButtonCollapse.displayName = "ButtonCollapse"
const Card: React.FC<React.ComponentProps<"li">> = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cxm("block w-full bg-card", variants.inputBorder(), variants.inputRounded(), className)}
    {...props}
  />
))
const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cxm("flex items-center justify-between px-4 py-1.5", className)} {...props} />
))
CardHeader.displayName = "CardHeader"
const CardHeaderTitle: React.FC<React.ComponentProps<typeof Ui.Hn>> = ({ className, ...props }) => (
  <Ui.Hn
    className={cxm(
      "line-clamp-1 flex items-center gap-2 text-sm font-normal leading-none tracking-tight text-muted-foreground",
      className
    )}
    {...props}
  />
)
const CardHeaderAside: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => (
  <div className={cxm("flex items-center gap-2", className)} {...props} />
)
const CardContent: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => (
  <div className={cxm("space-y-4 px-4 pb-4 pt-2", className)} {...props} />
)

/**
 * translations and replacements
 */
const dictionary = {
  fr: {
    reorder: "Réordonner",
    "accordion-toggle": "Ouvrir/Fermer",
    create: "Créer un nouvel item",
    title: "Titre de l'item",
    menu: "Ouvrir le menu",
    remove: "Supprimer l'item",
    duplicate: "Dupliquer l'item",
  },
  en: {
    reorder: "Reorder",
    "accordion-toggle": "Open/Close",
    create: "Create a new item",
    title: "Item title",
    menu: "Open the menu",
    remove: "Remove the item",
    duplicate: "Duplicate the item",
  },
  de: {
    reorder: "Reihenfolge ändern",
    "accordion-toggle": "Öffnen/Schließen",
    create: "Neues Element erstellen",
    title: "Elementtitel",
    menu: "Menü öffnen",
    remove: "Element entfernen",
    duplicate: "Element duplizieren",
  },
} satisfies Translation
