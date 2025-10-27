import { service } from "@/services"
import { usePinnedOrganisations } from "@compo/directory"
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
import { GripVertical } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

/**
 * Pinned Sidebar
 */
export const SidebarPinned: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const pinnedOrganisations = usePinnedOrganisations()
  const { organisations } = pinnedOrganisations
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
  const sortedOrganisations = React.useMemo(() => A.sortBy(organisations, (o) => o.pinOrder), [organisations])

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
        const oldIndex = A.getIndexBy(organisations, ({ id }) => id === active.id)
        const newIndex = A.getIndexBy(organisations, ({ id }) => id === over!.id)
        if (G.isNullable(oldIndex) || G.isNullable(newIndex)) return

        // Optimistic update
        const reordered = arrayMove(organisations, oldIndex, newIndex)

        // Call API to persist the new order
        await pinnedOrganisations.reorder(A.map(reordered, (o) => o.id))
      }
    },
    [organisations, pinnedOrganisations]
  )

  const handleDragCancel = React.useCallback(() => {
    setActiveId(null)
  }, [])

  // keyboard accessibility reordering
  const onKeyDown = React.useCallback(
    async (e: React.KeyboardEvent<HTMLButtonElement>, organisation: Api.Organisation) => {
      const keyCode = e.key
      if (!A.includes(["ArrowUp", "ArrowDown"], keyCode)) return
      e.preventDefault()
      const index = A.getIndexBy(organisations, ({ id }) => id === organisation.id)
      if (G.isNullable(index)) return
      const newIndex = keyCode === "ArrowUp" ? (index - 1 < 0 ? null : index - 1) : index + 1 >= organisations.length ? null : index + 1
      if (G.isNullable(newIndex)) return

      const reordered = arrayMove(organisations, index, newIndex)
      await pinnedOrganisations.reorder(A.map(reordered, (o) => o.id))
    },
    [organisations, pinnedOrganisations]
  )

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  if (A.isEmpty(organisations)) return null

  const activeOrganisation = activeId ? A.find(organisations, (o) => o.id === activeId) : null

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
    >
      <SortableContext items={sortedOrganisations} strategy={verticalListSortingStrategy}>
        {A.mapWithIndex(sortedOrganisations, (index, o) => (
          <PinLink key={index} organisation={o} onKeyDown={onKeyDown} showGrip={isShiftPressed} />
        ))}
        <Primitives.Portal>
          <DragOverlay>{activeOrganisation ? <PinLinkOverlay organisation={activeOrganisation} /> : null}</DragOverlay>
        </Primitives.Portal>
      </SortableContext>
    </DndContext>
  )
}

/**
 * OrganisationLink
 * This link is used to navigate to the organisation page. It is only visible if the sidebar
 * is expanded and option "display organisation" is activated in workspace configuration.
 */
const PinLink: React.FC<{
  organisation: Api.Organisation
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, organisation: Api.Organisation) => void
  showGrip: boolean
}> = ({ organisation, onKeyDown, showGrip }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()

  const organisationName = placeholder(translate(organisation, servicePlaceholder.organisation).name, _("organisation-placeholder"))

  const { scheme } = Ui.useTheme()
  const { getImageUrl } = service
  const [light, dark] = makeColorsFromString(organisationName)
  const initials = getInitials(organisationName, "", 3)
  const colorStyle = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  const image = getImageUrl(organisation.logoImage, "thumbnail")

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: organisation.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="group/button flex items-center gap-1">
      <Ui.Sidebar.CollapsibleMenuSubButton className="grow">
        <Link to={routesTo.pinned.list(organisation.id)}>
          {image ? (
            <Ui.Image
              src={image}
              classNames={{
                wrapper: "size-4 flex-none",
                image: "size-4 object-contain",
              }}
              alt={organisationName}
            >
              <Ui.ImageEmpty />
            </Ui.Image>
          ) : (
            <div className="flex size-4 flex-none items-center justify-center rounded-sm border text-[5px] font-medium" style={colorStyle}>
              {initials}
            </div>
          )}
          <span>{organisationName}</span>
        </Link>
      </Ui.Sidebar.CollapsibleMenuSubButton>
      {showGrip && (
        <button
          type="button"
          className="cursor-grab touch-none p-1 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100 active:cursor-grabbing"
          {...listeners}
          {...attributes}
          onKeyDown={(e) => onKeyDown(e, organisation)}
        >
          <GripVertical className="size-3 opacity-50 hover:opacity-100" aria-hidden />
          <span className="sr-only">{_("drag")}</span>
        </button>
      )}
    </div>
  )
}

/**
 * PinLinkOverlay
 * Rendered in the DragOverlay during drag operations
 */
const PinLinkOverlay: React.FC<{ organisation: Api.Organisation }> = ({ organisation }) => {
  const { translate } = useLanguage()
  const { _ } = useTranslation(dictionary)

  const organisationName = placeholder(translate(organisation, servicePlaceholder.organisation).name, _("organisation-placeholder"))

  const { scheme } = Ui.useTheme()
  const { getImageUrl } = service
  const [light, dark] = makeColorsFromString(organisationName)
  const initials = getInitials(organisationName, "", 3)
  const colorStyle = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  const image = getImageUrl(organisation.logoImage, "thumbnail")

  return (
    <div className="group/button bg-sidebar flex items-center gap-1 rounded opacity-50 shadow">
      <Ui.Sidebar.CollapsibleMenuSubButton className="block grow">
        <span className="flex items-center gap-2">
          {image ? (
            <Ui.Image
              src={image}
              classNames={{
                wrapper: "size-4 flex-none",
                image: "size-4 object-contain",
              }}
              alt={organisationName}
            >
              <Ui.ImageEmpty />
            </Ui.Image>
          ) : (
            <div className="flex size-4 flex-none items-center justify-center rounded-sm border text-[5px] font-medium" style={colorStyle}>
              {initials}
            </div>
          )}
          <span>{organisationName}</span>
        </span>
      </Ui.Sidebar.CollapsibleMenuSubButton>
      <div className="p-1">
        <GripVertical className="size-3 opacity-50" aria-hidden />
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "organisation-placeholder": "Sans nom",
    drag: "Déplacer l'organisation",
  },
  en: {
    "organisation-placeholder": "Unnamed",
    drag: "Drag organisation",
  },
  de: {
    "organisation-placeholder": "Unbenannt",
    drag: "Organisation verschieben",
  },
}
