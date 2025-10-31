import { usePinnedLibraries } from "@compo/libraries"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Primitives, Ui } from "@compo/ui"
import { A, G, getInitials, makeColorsFromString, placeholder } from "@compo/utils"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { GripVertical, PinOff } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

/**
 * Pinned Sidebar
 */
export const SidebarPinned: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const pinnedLibraries = usePinnedLibraries()
  const { libraries, makePinnable } = pinnedLibraries
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [isShiftPressed, setIsShiftPressed] = React.useState(false)

  // Track Shift key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftPressed(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftPressed(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
  const sortedLibraries = React.useMemo(() => A.sortBy(libraries, (l) => l.pinOrder), [libraries])

  // drag start
  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  // drag and drop reordering
  const handleDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (active.id !== over?.id) {
        const oldIndex = A.getIndexBy(libraries, ({ id }) => id === active.id)
        const newIndex = A.getIndexBy(libraries, ({ id }) => id === over!.id)
        if (G.isNullable(oldIndex) || G.isNullable(newIndex)) return

        // Optimistic update
        const reordered = arrayMove(libraries, oldIndex, newIndex)

        // Call API to persist the new order
        await pinnedLibraries.reorder(A.map(reordered, (l) => l.id))
      }
    },
    [libraries, pinnedLibraries]
  )

  const handleDragCancel = React.useCallback(() => {
    setActiveId(null)
  }, [])

  // keyboard accessibility reordering
  const onKeyDown = React.useCallback(
    async (e: React.KeyboardEvent<HTMLButtonElement>, library: Api.Library) => {
      const keyCode = e.key
      if (!A.includes(["ArrowUp", "ArrowDown"], keyCode)) return
      e.preventDefault()
      const index = A.getIndexBy(libraries, ({ id }) => id === library.id)
      if (G.isNullable(index)) return
      const newIndex = keyCode === "ArrowUp" ? (index - 1 < 0 ? null : index - 1) : index + 1 >= libraries.length ? null : index + 1
      if (G.isNullable(newIndex)) return

      const reordered = arrayMove(libraries, index, newIndex)
      await pinnedLibraries.reorder(A.map(reordered, (l) => l.id))
    },
    [libraries, pinnedLibraries]
  )

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  if (A.isEmpty(libraries)) return null

  const activeLibrary = activeId ? A.find(libraries, (l) => l.id === activeId) : null

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
    >
      <SortableContext items={sortedLibraries} strategy={verticalListSortingStrategy}>
        {A.mapWithIndex(sortedLibraries, (index, l) => (
          <PinLink key={index} library={l} onKeyDown={onKeyDown} showGrip={isShiftPressed} makePinnable={makePinnable} />
        ))}
        <Primitives.Portal>
          <DragOverlay>{activeLibrary ? <PinLinkOverlay library={activeLibrary} /> : null}</DragOverlay>
        </Primitives.Portal>
      </SortableContext>
    </DndContext>
  )
}

/**
 * LibraryLink
 * This link is used to navigate to the library page. It is only visible if the sidebar
 * is expanded and option "display library" is activated in workspace configuration.
 */
const PinLink: React.FC<{
  library: Api.Library
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, library: Api.Library) => void
  showGrip: boolean
  makePinnable: ReturnType<typeof usePinnedLibraries>["makePinnable"]
}> = ({ library, onKeyDown, showGrip, makePinnable }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const { unpin } = makePinnable(library.id)

  const libraryName = placeholder(translate(library, servicePlaceholder.library).title, _("library-placeholder"))

  const { scheme } = Ui.useTheme()
  const [light, dark] = makeColorsFromString(libraryName)
  const initials = getInitials(libraryName, "", 3)
  const colorStyle = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: library.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const PinOffButton = (
    <Ui.Sidebar.MenuSubAction onClick={unpin} tooltip={_("unpin")} className="opacity-50 hover:opacity-100 [&>svg]:size-3">
      <PinOff aria-hidden />
      <span className="sr-only">{_("unpin")}</span>
    </Ui.Sidebar.MenuSubAction>
  )

  const GripButton = (
    <Ui.Sidebar.MenuSubAction
      className="cursor-grab touch-none opacity-50 hover:opacity-100 active:cursor-grabbing [&>svg]:size-3"
      {...listeners}
      {...attributes}
      onKeyDown={(e) => onKeyDown(e, library)}
    >
      <GripVertical aria-hidden />
      <span className="sr-only">{_("drag")}</span>
    </Ui.Sidebar.MenuSubAction>
  )

  return (
    <Ui.Sidebar.CollapsibleMenuSubButton
      ref={setNodeRef}
      style={style}
      action={
        showGrip ? (
          <>
            {PinOffButton}
            {GripButton}
          </>
        ) : undefined
      }
    >
      <Link to={routesTo.byId(library.id)} className="grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="flex size-4 flex-none items-center justify-center rounded-sm border text-[5px] font-medium" style={colorStyle}>
          {initials}
        </div>
        <span className="line-clamp-1">{libraryName}</span>
      </Link>
    </Ui.Sidebar.CollapsibleMenuSubButton>
  )
}

/**
 * PinLinkOverlay
 * Rendered in the DragOverlay during drag operations
 */
const PinLinkOverlay: React.FC<{ library: Api.Library }> = ({ library }) => {
  const { translate } = useLanguage()
  const { _ } = useTranslation(dictionary)

  const libraryName = placeholder(translate(library, servicePlaceholder.library).title, _("library-placeholder"))

  const { scheme } = Ui.useTheme()
  const [light, dark] = makeColorsFromString(libraryName)
  const initials = getInitials(libraryName, "", 3)
  const colorStyle = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }

  return (
    <Ui.Sidebar.CollapsibleMenuSubButton
      className="bg-sidebar block opacity-50 shadow"
      action={
        <>
          <Ui.Sidebar.MenuSubAction className="opacity-50 [&>svg]:size-3">
            <PinOff aria-hidden />
          </Ui.Sidebar.MenuSubAction>
          <Ui.Sidebar.MenuSubAction className="opacity-50 [&>svg]:size-3">
            <GripVertical aria-hidden />
          </Ui.Sidebar.MenuSubAction>
        </>
      }
    >
      <span className="grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="flex size-4 flex-none items-center justify-center rounded-sm border text-[5px] font-medium" style={colorStyle}>
          {initials}
        </div>
        <span className="line-clamp-1">{libraryName}</span>
      </span>
    </Ui.Sidebar.CollapsibleMenuSubButton>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "library-placeholder": "Sans nom",
    drag: "Déplacer la bibliothèque",
    unpin: "Désépingler la bibliothèque",
  },
  en: {
    "library-placeholder": "Unnamed",
    drag: "Drag library",
    unpin: "Unpin library",
  },
  de: {
    "library-placeholder": "Unbenannt",
    drag: "Bibliothek verschieben",
    unpin: "Bibliothek lösen",
  },
}
