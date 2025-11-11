import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useLightbox } from "@compo/lightbox"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { A, humanFileSize, makeBreakable, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, Row, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Folder, FolderLock } from "lucide-react"
import React from "react"
import { useMedias } from "../medias.context"
import { isMediaFolder } from "../utils"
import { FilePreview } from "./files/icon"
import { FileMenu } from "./files/menu"
import { FolderMenu } from "./folders/menu"

type TableProps = {
  files: Api.MediaFileWithRelations[]
  folders: Api.MediaFolderWithRelations[]
  disabledIds?: string[]
  hiddenIds?: string[]
  selectOnClick?: boolean
  onQuickSelect?: (items: Api.MediaFileWithRelations[]) => void
}

/**
 * Table
 * Display a list of files and folders as table (tanstack table)
 */
export const Table: React.FC<TableProps> = ({
  files,
  folders,
  disabledIds,
  hiddenIds,
  selectOnClick,
  onQuickSelect,
}) => {
  const { _ } = useTranslation(dictionary)
  // Memoize filtered data to avoid infinite re-renders with arrays
  const visibleFolders = React.useMemo(() => {
    if (!hiddenIds) return folders
    return A.filter(folders, (folder) => !A.includes(hiddenIds, folder.id)) as Api.MediaFolderWithRelations[]
  }, [folders, hiddenIds])
  const visibleFiles = React.useMemo(() => {
    if (!hiddenIds) return files
    return A.filter(files, (file) => !A.includes(hiddenIds, file.id)) as Api.MediaFileWithRelations[]
  }, [files, hiddenIds])

  const data = useData(visibleFiles, visibleFolders)

  const table = useReactTable<DataItem>({
    data,
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
      {(row) =>
        isMediaFolder(row.original.item) ? (
          <TableRowFolder key={row.id} row={row} item={row.original.item} disabledIds={disabledIds} />
        ) : (
          <TableRowFile
            key={row.id}
            row={row}
            item={row.original.item}
            disabledIds={disabledIds}
            selectOnClick={selectOnClick}
            onQuickSelect={onQuickSelect}
          />
        )
      }
    </Dashboard.Table.Tanstack>
  )
}

const TableRowFolder: React.FC<{
  row: Row<DataItem>
  item: Api.MediaFolderWithRelations
  disabledIds?: string[]
}> = ({ row, item, disabledIds }) => {
  const { displayFolder, selectable, canSelectFolder } = useMedias()
  const isDisabled = A.includes(disabledIds ?? [], row.original.item.id)
  return (
    <Dashboard.Table.Row
      menu={<FolderMenu item={item} />}
      item={row.original.item}
      selectable={selectable}
      disabled={isDisabled}
      {...(canSelectFolder && !isDisabled
        ? smartClick(item, selectable, () => displayFolder(item))
        : { isSelectable: false, onClick: () => displayFolder(item) })}
      cells={row.getVisibleCells()}
    />
  )
}
const TableRowFile: React.FC<{
  row: Row<DataItem>
  item: Api.MediaFileWithRelations
  disabledIds?: string[]
  selectOnClick?: boolean
  onQuickSelect?: (items: Api.MediaFileWithRelations[]) => void
}> = ({ row, item, disabledIds, selectOnClick, onQuickSelect }) => {
  const { selectable, canSelectFile } = useMedias()
  const { displayPreview, hasPreview } = useLightbox()
  const isDisabled = A.includes(disabledIds ?? [], row.original.item.id)
  return (
    <Dashboard.Table.Row
      menu={<FileMenu item={item} />}
      item={row.original.item}
      selectable={selectable}
      disabled={isDisabled}
      {...(canSelectFile && !isDisabled
        ? smartClick(
            item,
            selectable,
            selectOnClick ? true : hasPreview(item.id) ? () => displayPreview(item.id) : undefined
          )
        : { isSelectable: false })}
      onDoubleClick={() => onQuickSelect?.([item])}
      cells={row.getVisibleCells()}
    />
  )
}

/**
 * TableSkeleton
 * Display skeleton loaders while content is loading
 */
export const TableSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<DataItemSkeleton>({
    data: Array.from({ length: count }, (_, index) => ({ id: index })),
    columns: columnsSkeleton,
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
      {(row) => <Dashboard.Table.Row cells={row.getVisibleCells()} />}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * prepare data and data types
 */
const useData = (files: Api.MediaFileWithRelations[], folders: Api.MediaFolderWithRelations[]) =>
  React.useMemo(() => {
    const folderItems = A.map(folders, (folder) => ({
      id: `folder-${folder.id}`,
      type: "folder" as const,
      item: folder,
    }))
    const fileItems = A.map(files, (file) => ({
      id: `file-${file.id}`,
      type: "file" as const,
      item: file,
    }))
    return [...folderItems, ...fileItems]
  }, [files, folders])

type DataItem = ReturnType<typeof useData>[number]
type ColumnProps = { row: Row<DataItem> }

/**
 * configure columns rendering
 */
const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useMedias()
  return (
    <Dashboard.Table.Checkbox
      item={row.original.item}
      // @ts-expect-error
      selectable={selectable}
    />
  )
}

const ColumnName: React.FC<ColumnProps> = ({ row }) => {
  const { translate } = useLanguage()
  const { displayFolder } = useMedias()
  if (row.original.type === "folder") {
    const folder = row.original.item as Api.MediaFolderWithRelations
    return (
      <div className='inline-flex items-center gap-3'>
        <div className='flex size-8 items-center justify-center'>
          {folder.lock ? <FolderLock className='size-5' /> : <Folder className='size-5' />}
        </div>
        <button onClick={() => displayFolder(folder)} className='truncate text-left font-medium hover:underline'>
          {makeBreakable(folder.name)}
        </button>
      </div>
    )
  }

  const file = row.original.item as Api.MediaFileWithRelations
  const translated = translate(file, servicePlaceholder.mediaFile)
  return (
    <div className='inline-flex items-center gap-3'>
      <FilePreview file={file} />
      <div className='min-w-0 flex-1'>
        <div className='truncate font-medium'>{makeBreakable(translated.name)}</div>
      </div>
    </div>
  )
}

const ColumnSize: React.FC<ColumnProps> = ({ row }) => {
  if (row.original.type === "folder") {
    return <span className='text-muted-foreground text-sm'>—</span>
  }
  const file = row.original.item as Api.MediaFileWithRelations
  return <span className='text-sm'>{humanFileSize(file.size)}</span>
}

const ColumnType: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)

  if (row.original.type === "folder") {
    const folder = row.original.item as Api.MediaFolderWithRelations
    return <span className='text-muted-foreground text-sm'>{folder.lock ? _("locked-folder") : _("folder")}</span>
  }

  const file = row.original.item as Api.MediaFileWithRelations
  return <span className='font-mono text-sm uppercase'>{file.extension}</span>
}

const ColumnCreatedBy: React.FC<ColumnProps> = ({ row }) => {
  const item = row.original.item
  const createdBy = "createdBy" in item ? item.createdBy : null

  if (!createdBy) {
    return <span className='text-muted-foreground text-sm'>—</span>
  }
  return <UserTooltip user={createdBy} displayUsername />
}

const ColumnCreated: React.FC<ColumnProps> = ({ row }) => {
  const { format } = useTranslation(dictionary)
  const createdAt = row.original.item.createdAt
  return <span className='text-sm'>{format(T.parseISO(createdAt), "PPp")}</span>
}

/**
 * define columns
 */
const columns: ColumnDef<DataItem>[] = [
  {
    id: "select",
    cell: ({ row }) => <ColumnSelect row={row} />,
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
  },
  {
    header: "name-label",
    id: "name",
    cell: ({ row }) => <ColumnName row={row} />,
    size: 300,
    minSize: 100,
    maxSize: 1200,
  },
  {
    header: "size-label",
    id: "size",
    cell: ({ row }) => <ColumnSize row={row} />,
    size: 100,
  },
  {
    header: "type-label",
    id: "type",
    cell: ({ row }) => <ColumnType row={row} />,
    size: 100,
  },
  {
    header: "created-by-label",
    id: "createdBy",
    cell: ({ row }) => <ColumnCreatedBy row={row} />,
    size: 180,
  },
  {
    header: "created-label",
    id: "created",
    cell: ({ row }) => <ColumnCreated row={row} />,
    size: 150,
  },
  {
    id: "menu",
    cell: ({ row }) => (
      <Dashboard.Table.Menu
        menu={
          row.original.type === "folder" ? (
            <FolderMenu item={row.original.item as Api.MediaFolderWithRelations} />
          ) : (
            <FileMenu item={row.original.item as Api.MediaFileWithRelations} />
          )
        }
      />
    ),
    size: 56,
    minSize: 56,
    maxSize: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
]
type DataItemSkeleton = {
  id: number
}
const columnsSkeleton: ColumnDef<DataItemSkeleton>[] = [
  {
    id: "select",
    cell: () => <Ui.Skeleton variant='checkbox' />,
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
  },
  {
    header: "name-label",
    id: "name",
    cell: () => <Ui.Skeleton variant='text-base' />,
    size: 300,
    minSize: 100,
    maxSize: 800,
  },
  {
    header: "size-label",
    id: "size",
    cell: () => <Ui.Skeleton variant='text-sm' />,
    size: 100,
  },
  {
    header: "type-label",
    id: "type",
    cell: () => <Ui.Skeleton variant='text-sm' />,
    size: 100,
  },
  {
    header: "created-by-label",
    id: "createdBy",
    cell: () => (
      <div className='flex items-center gap-2'>
        <Ui.Skeleton className='size-6 rounded-full' />
        <Ui.Skeleton variant='text-sm' />
      </div>
    ),
    size: 180,
  },
  {
    header: "created-label",
    id: "created",
    cell: () => <Ui.Skeleton variant='text-sm' />,
    size: 150,
  },
  {
    id: "menu",
    cell: () => <Ui.Skeleton variant='button-icon' />,
    size: 56,
    minSize: 56,
    maxSize: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
]
/**
 * translations
 */
const dictionary = {
  en: {
    "name-label": "Name",
    "unnamed-user": "Unnamed user",
    "size-label": "Size",
    "type-label": "Type",
    "created-by-label": "Created by",
    "created-label": "Created",
    folder: "Folder",
    "locked-folder": "Locked Folder",
  },
  fr: {
    "name-label": "Nom",
    "unnamed-user": "Utilisateur anonyme",
    "size-label": "Taille",
    "type-label": "Type",
    "created-by-label": "Créé par",
    "created-label": "Créé le",
    folder: "Dossier",
    "locked-folder": "Dossier verrouillé",
  },
  de: {
    "name-label": "Name",
    "unnamed-user": "Unbekannter Benutzer",
    "size-label": "Größe",
    "type-label": "Typ",
    "created-by-label": "Erstellt von",
    "created-label": "Erstellt am",
    folder: "Ordner",
    "locked-folder": "Gesperrter Ordner",
  },
}
