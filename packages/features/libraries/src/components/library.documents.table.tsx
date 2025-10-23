import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { FileText } from "lucide-react"
import React from "react"
import { useLibrary } from "../library.context"

/**
 * LibraryDocumentsTable
 */
export const LibraryDocumentsTable: React.FC<{ documents: Api.LibraryDocument[] }> = ({ documents }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.LibraryDocument>({
    data: documents,
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
      {(row) => <TableRow key={row.id} row={row} document={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  document: Api.LibraryDocument
}> = ({ row, document }) => {
  const { selectable } = useLibrary()

  return (
    <Dashboard.Table.Row
      item={document}
      selectable={selectable}
      {...smartClick(document, selectable, () => {})}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.LibraryDocument> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useLibrary()
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
  const libraryDocument = row.original
  const translatedDocument = translate(libraryDocument, servicePlaceholder.libraryDocument)
  const title = placeholder(translatedDocument.title, _("untitled"))

  return (
    <div className='inline-flex items-center gap-4'>
      <div className='bg-muted flex size-8 shrink-0 items-center justify-center rounded-md'>
        <FileText className='text-muted-foreground size-4' aria-hidden />
      </div>
      <div className='min-w-0 flex-1'>
        <span className='truncate font-medium'>{title}</span>
      </div>
    </div>
  )
}

const ColumnReference: React.FC<ColumnProps> = ({ row }) => {
  const libraryDocument = row.original
  return <span className='text-sm'>{libraryDocument.reference}</span>
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const libraryDocument = row.original

  return (
    <UserTooltip user={libraryDocument.updatedBy} displayUsername>
      {formatDistance(T.parseISO(libraryDocument.updatedAt))}
    </UserTooltip>
  )
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.LibraryDocument>[] = [
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
    accessorFn: (libraryDocument) => libraryDocument.translations[0]?.title || "",
    size: 400,
    minSize: 200,
    maxSize: 600,
    cell: ({ row }) => <ColumnTitle row={row} />,
  },
  {
    id: "reference",
    header: "reference-label",
    accessorFn: (libraryDocument) => libraryDocument.reference,
    size: 200,
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => <ColumnReference row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 200,
    minSize: 150,
    maxSize: 300,
    accessorFn: (libraryDocument) => libraryDocument.updatedAt,
    cell: ({ row }) => <ColumnUpdatedAt row={row} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "title-label": "Title",
    "reference-label": "Reference",
    "updated-at-label": "Last modification",
    untitled: "Untitled document",
  },
  fr: {
    "title-label": "Titre",
    "reference-label": "Référence",
    "updated-at-label": "Dernière modification",
    untitled: "Document sans titre",
  },
  de: {
    "title-label": "Titel",
    "reference-label": "Referenz",
    "updated-at-label": "Letzte Modifikation",
    untitled: "Dokument ohne Titel",
  },
}
