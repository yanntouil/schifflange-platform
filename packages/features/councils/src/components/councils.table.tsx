import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { CalendarIcon } from "lucide-react"
import React from "react"
import { useCouncils } from "../councils.context"
import { CouncilsMenu } from "./councils.menu"

/**
 * CouncilsTable
 */
export const CouncilsTable: React.FC<{ councils: Api.Council[] }> = ({ councils }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.Council>({
    data: councils,
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
      {(row) => <TableRow key={row.id} row={row} council={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  council: Api.Council
}> = ({ row, council }) => {
  const { selectable } = useCouncils()

  return (
    <Dashboard.Table.Row
      menu={<CouncilsMenu council={council} />}
      item={council}
      selectable={selectable}
      {...smartClick(council, selectable)}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.Council> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useCouncils()
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

const ColumnDate: React.FC<ColumnProps> = ({ row }) => {
  const council = row.original
  const date = new Date(council.date)
  return (
    <div className='inline-flex items-center gap-2'>
      <CalendarIcon aria-hidden className='text-blue-600 size-4' />
      <span className='font-medium'>{T.formatDate(date, "PPP")}</span>
    </div>
  )
}

const ColumnAgenda: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const council = row.original
  const translatedCouncil = translate(council, servicePlaceholder.council)
  const agenda = placeholder(translatedCouncil.agenda, _("no-agenda"))
  return <span className='truncate text-sm'>{agenda}</span>
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const council = row.original
  return <UserTooltip user={council.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const council = row.original
  return formatDistance(T.parseISO(council.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.Council>[] = [
  {
    id: "select",
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: ({ row }) => <ColumnSelect row={row} />,
  },
  {
    id: "date",
    header: "date-label",
    size: 300,
    minSize: 150,
    maxSize: 420,
    accessorFn: (council) => council.date,
    cell: ({ row }) => <ColumnDate row={row} />,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    size: 180,
    minSize: 150,
    maxSize: 220,
    accessorFn: (council) => council.updatedBy,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (council) => council.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<CouncilsMenu council={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "date-label": "Date",
    "agenda-label": "Agenda",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    "no-agenda": "No agenda",
  },
  fr: {
    "date-label": "Date",
    "agenda-label": "Ordre du jour",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    "no-agenda": "Pas d'ordre du jour",
  },
  de: {
    "date-label": "Datum",
    "agenda-label": "Tagesordnung",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    "no-agenda": "Keine Tagesordnung",
  },
}
