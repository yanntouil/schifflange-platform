import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { FolderIcon, LayoutPanelTop } from "lucide-react"
import React from "react"
import { useEvents } from "../events.context"
import { useEventsService } from "../service.context"
import { EventsMenu } from "./events.menu"
import { EventsStateIcon } from "./icons"

/**
 * EventsTable
 */
export const EventsTable: React.FC<{ events: Api.EventWithRelations[] }> = ({ events }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.EventWithRelations>({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: Dashboard.makeColumnSize(),
    initialState: {
      columnPinning: {
        right: ["menu"],
      },
    },
  })

  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => <TableRow key={row.id} row={row} event={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  event: Api.EventWithRelations
}> = ({ row, event }) => {
  const { selectable, displayEvent } = useEvents()

  return (
    <Dashboard.Table.Row
      menu={<EventsMenu event={event} />}
      item={event}
      selectable={selectable}
      {...smartClick(event, selectable, () => displayEvent(event))}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.EventWithRelations> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useEvents()
  return (
    <Dashboard.Table.Checkbox
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
      item={row.original}
      // @ts-expect-error
      selectable={selectable}
    />
  )
}

const ColumnTitle: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { getImageUrl } = useEventsService()
  const { translate } = useLanguage()
  const event = row.original
  const translatedSeo = translate(event.seo, servicePlaceholder.seo)
  const title = placeholder(translatedSeo.title, _("untitled"))
  const imageUrl = getImageUrl(translatedSeo.image)
  const path = event.slug.path === "/" ? "/" : `/${event.slug.path}`

  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image src={imageUrl ?? undefined} className='bg-muted size-8 shrink-0 rounded-md'>
        <LayoutPanelTop className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{title}</span>
        </div>
        {event.slug && <div className='text-muted-foreground truncate text-xs'>{path}</div>}
      </div>
    </div>
  )
}

const ColumnState: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const event = row.original
  return (
    <span className='inline-flex items-center gap-2'>
      <EventsStateIcon state={event.state} className='size-4' />
      {_(`state-${event.state}`)}
    </span>
  )
}

const ColumnCategories: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const event = row.original
  const categoriesTitle =
    event.categories.length > 0
      ? event.categories.map((cat) => translate(cat, servicePlaceholder.eventCategory).title).join(", ")
      : _("uncategorized")
  return (
    <span className='inline-flex items-center gap-2'>
      <FolderIcon aria-hidden className='text-blue-600 size-4' />
      {categoriesTitle}
    </span>
  )
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const event = row.original
  return <UserTooltip user={event.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const event = row.original

  return formatDistance(T.parseISO(event.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.EventWithRelations>[] = [
  {
    id: "select",
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: ({ row }) => <ColumnSelect row={row} />,
  },
  {
    id: "title",
    header: "title-label",
    accessorFn: (event) => event.seo.translations[0]?.title || "",
    size: 400,
    minSize: 200,
    maxSize: 800,
    cell: ({ row }) => <ColumnTitle row={row} />,
  },
  {
    id: "state",
    header: "state-label",
    size: 120,
    minSize: 100,
    maxSize: 140,
    accessorFn: (event) => event.state,
    cell: ({ row }) => <ColumnState row={row} />,
  },
  {
    id: "categories",
    header: "categories-label",
    size: 150,
    minSize: 120,
    maxSize: 200,
    accessorFn: (event) => event.categories.map((cat) => cat.translations[0]?.title).join(", "),
    cell: ({ row }) => <ColumnCategories row={row} />,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    size: 180,
    minSize: 150,
    maxSize: 220,
    accessorFn: (event) => event.updatedBy,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (event) => event.updatedAt,
    cell: ({ row }) => <ColumnUpdatedAt row={row} />,
  },
  {
    id: "menu",
    size: 56,
    minSize: 56,
    maxSize: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
    cell: ({ row }) => <Dashboard.Table.Menu menu={<EventsMenu event={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "title-label": "Title",
    "state-label": "Status",
    "categories-label": "Categories",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    untitled: "Untitled event",
    "no-description": "No description",
    uncategorized: "Uncategorized",
    "state-draft": "Draft",
    "state-published": "Published",
  },
  fr: {
    "title-label": "Titre",
    "state-label": "Statut",
    "categories-label": "Catégories",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Événement sans titre",
    "no-description": "Aucune description",
    uncategorized: "Non catégorisé",
    "state-draft": "Brouillon",
    "state-published": "Publié",
  },
  de: {
    "title-label": "Titel",
    "state-label": "Status",
    "categories-label": "Kategorien",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Veranstaltung ohne Titel",
    "no-description": "Keine Beschreibung",
    uncategorized: "Unkategorisiert",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
  },
}
