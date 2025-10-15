import { A, D, flow, G, pipe } from "@compo/utils"
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
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Api } from "@services/dashboard"
import React from "react"
import { useMenu } from "../../menu.context"
import { Item } from "./item"
import { ItemAdd } from "./item-add"
import { CreateDialogProps } from "./item-create"

/**
 * display a list of first level items, allow to reorder them and create new items
 */
export const Menu: React.FC<{
  createItem: (value: CreateDialogProps) => void
  children: (item: Api.MenuItemWithRelations) => React.ReactNode
}> = ({ ...props }) => {
  const { swr, reorderMenuItems } = useMenu()

  const items = React.useMemo(
    () =>
      pipe(
        swr.items,
        A.filter((item) => item.parentId === null),
        A.filter(flow(D.prop("parentId"), G.isNullable)),
        A.sortBy(D.prop("order"))
      ),
    [swr.items]
  )

  // drag and drop reordering
  const [active, setActive] = React.useState<Api.MenuItemWithRelations | null>(null)
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      setActive(null)
      const { active, over } = event
      if (active.id !== over?.id) {
        const list = A.map(items, (item) => item.id)
        const oldIndex = list.indexOf(active.id as string)
        const newIndex = list.indexOf(over!.id as string)
        reorderMenuItems(arrayMove(list, oldIndex, newIndex))
      }
    },
    [items, swr]
  )
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string
    const item = A.find(items, (item) => item.id === id)
    setActive(item ?? null)
  }
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  // keyboard accessibility reordering
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      const keyCode = e.key
      if (!A.includes(["ArrowUp", "ArrowDown"], keyCode)) return
      e.preventDefault()
      const list = A.map(items, (item) => item.id)
      const oldIndex = list.indexOf(id as string)
      switch (keyCode) {
        case "ArrowUp": {
          const newIndex = oldIndex - 1
          if (newIndex < 0) return
          reorderMenuItems(arrayMove(list, oldIndex, newIndex))
          break
        }
        case "ArrowDown": {
          const newIndex = oldIndex + 1
          if (newIndex >= list.length) return
          reorderMenuItems(arrayMove(list, oldIndex, newIndex))
          break
        }
      }
    },
    [items, swr]
  )
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className='flex flex-col select-none'>
          <ItemAdd index={-1} onClick={() => props.createItem({ order: -1 })} isSorting={!G.isNullable(active)} />
          {A.mapWithIndex(items, (index, item) => (
            <React.Fragment key={item.id}>
              <Item key={item.id} item={item} onKeyDown={onKeyDown} index={index} {...props} />
              <ItemAdd
                index={index}
                onClick={() => props.createItem({ order: index + 1 })}
                isSorting={!G.isNullable(active)}
              />
            </React.Fragment>
          ))}
        </div>
        <DragOverlay adjustScale={false}>
          {active && <Item item={active} onKeyDown={onKeyDown} isOverlay {...props} />}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  )
}
