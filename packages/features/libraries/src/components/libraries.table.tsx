import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { Library } from "lucide-react"
import React from "react"
import { useLibraries } from "../libraries.context"
import { LibrariesMenu } from "./libraries.menu"

/**
 * LibrariesTable
 */
export const LibrariesTable: React.FC<{ libraries: Api.Library[] }> = ({ libraries }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.Library>({
    data: libraries,
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
      {(row) => <TableRow key={row.id} row={row} library={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  library: Api.Library
}> = ({ row, library }) => {
  const { selectable } = useLibraries()

  return (
    <Dashboard.Table.Row
      menu={<LibrariesMenu library={library} />}
      item={library}
      selectable={selectable}
      {...smartClick(library, selectable, () => {})}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.Library> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useLibraries()
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
  const { translate } = useContextualLanguage()
  const library = row.original
  const translatedLibrary = translate(library, servicePlaceholder.library)
  const title = placeholder(translatedLibrary.title, _("untitled"))

  return (
    <div className='inline-flex items-center gap-4'>
      <div className='bg-muted flex size-8 shrink-0 items-center justify-center rounded-md'>
        <Library className='text-muted-foreground size-4' aria-hidden />
      </div>
      <div className='min-w-0 flex-1'>
        <span className='truncate font-medium'>{title}</span>
      </div>
    </div>
  )
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const library = row.original

  return (
    <UserTooltip user={library.updatedBy} displayUsername>
      {formatDistance(T.parseISO(library.updatedAt))}
    </UserTooltip>
  )
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.Library>[] = [
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
    accessorFn: (library) => library.translations[0]?.title || "",
    size: 500,
    minSize: 200,
    maxSize: 800,
    cell: ({ row }) => <ColumnTitle row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 200,
    minSize: 150,
    maxSize: 300,
    accessorFn: (library) => library.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<LibrariesMenu library={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "title-label": "Title",
    "updated-at-label": "Last modification",
    untitled: "Untitled library",
  },
  fr: {
    "title-label": "Titre",
    "updated-at-label": "Dernière modification",
    untitled: "Bibliothèque sans titre",
  },
  de: {
    "title-label": "Titel",
    "updated-at-label": "Letzte Modifikation",
    untitled: "Bibliothek ohne Titel",
  },
}
