import { A, D, G } from "@compo/utils"
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
import { type Api } from "@services/dashboard"
import React from "react"
import { useContent } from "../context"
import { Add } from "./add"
import { Item } from "./item"

/**
 * Collection
 * display the collection of items
 */
export const Collection: React.FC = () => {
  const { content, reorder, createItem } = useContent()
  const items = React.useMemo(() => [...A.sortBy(content.items, D.prop("order"))], [content.items])

  // drag and drop reordering
  const [active, setActive] = React.useState<Api.ContentItem | null>(null)
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      setActive(null)
      const { active, over } = event
      if (active.id !== over?.id) {
        const list = A.map(items, D.prop("id"))
        const oldIndex = list.indexOf(active.id as string)
        const newIndex = list.indexOf(over!.id as string)
        reorder(arrayMove([...list], oldIndex, newIndex))
      }
    },
    [items, reorder]
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
      const list = A.map(items, D.prop("id"))
      const oldIndex = list.indexOf(id as string)
      switch (keyCode) {
        case "ArrowUp": {
          const newIndex = oldIndex - 1
          if (newIndex < 0) return
          reorder(arrayMove([...list], oldIndex, newIndex))
          break
        }
        case "ArrowDown": {
          const newIndex = oldIndex + 1
          if (newIndex >= list.length) return
          reorder(arrayMove([...list], oldIndex, newIndex))
          break
        }
      }
    },
    [items, reorder]
  )

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className='flex w-full flex-col items-center'>
          <Add index={-1} onClick={() => createItem(-1)} isSorting={!G.isNull(active)} />
          {A.mapWithIndex(items, (index, item) => (
            <React.Fragment key={item.id}>
              <Item key={item.id} item={item} onKeyDown={onKeyDown} index={index} />
              <Add index={index} onClick={() => createItem(index)} isSorting={!G.isNull(active)} />
            </React.Fragment>
          ))}
        </div>
        <DragOverlay adjustScale={false}>
          {active && <Item item={active} onKeyDown={onKeyDown} isOverlay />}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  )
}
