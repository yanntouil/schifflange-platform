import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { FolderIcon, TagIcon } from "lucide-react"
import React from "react"
import { useProjectsService } from "../service.context"
import { useTags } from "../tags.context"
import { TagsMenu } from "./tags.menu"

/**
 * TagsTable
 */
export const TagsTable: React.FC<{ tags: Api.ProjectTag[] }> = ({ tags }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.ProjectTag>({
    data: tags,
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
      {(row) => <TableRow key={row.id} row={row} tag={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  tag: Api.ProjectTag
}> = ({ row, tag }) => {
  const { selectable } = useTags()

  return (
    <Dashboard.Table.Row
      menu={<TagsMenu tag={tag} />}
      item={tag}
      selectable={selectable}
      {...smartClick(tag, selectable, () => {})}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.ProjectTag> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useTags()
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
  const { getImageUrl } = useProjectsService()
  const { translate } = useContextualLanguage()
  const tag = row.original
  const translatedTag = translate(tag, servicePlaceholder.projectTag)
  const title = placeholder(translatedTag.name, _("untitled"))
  const tagType = _(`type-${tag.type}`, { defaultValue: tag.type })
  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image className='bg-muted size-8 shrink-0 rounded-md'>
        <TagIcon className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{title}</span>
        </div>
        <div className='text-muted-foreground truncate text-xs'>{tagType}</div>
      </div>
    </div>
  )
}

const ColumnProjectsCount: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const tag = row.original
  return (
    <span className='inline-flex items-center gap-2'>
      <FolderIcon aria-hidden className='text-blue-600 size-4' />
      {_("projects-count", { count: tag.totalProjects || 0 })}
    </span>
  )
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const tag = row.original
  return <UserTooltip user={tag.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const tag = row.original

  return formatDistance(T.parseISO(tag.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.ProjectTag>[] = [
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
    accessorFn: (tag) => tag.translations[0]?.name || "",
    size: 400,
    minSize: 200,
    maxSize: 800,
    cell: ({ row }) => <ColumnTitle row={row} />,
  },
  {
    id: "projectsCount",
    header: "projects-count-label",
    size: 120,
    minSize: 100,
    maxSize: 140,
    accessorFn: (tag) => tag.totalProjects || 0,
    cell: ({ row }) => <ColumnProjectsCount row={row} />,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    size: 180,
    minSize: 150,
    maxSize: 220,
    accessorFn: (tag) => tag.updatedById,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (tag) => tag.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<TagsMenu tag={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "title-label": "Title",
    "projects-count-label": "Projects",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    untitled: "Untitled tag",
    "no-description": "No description",
    "projects-count": "{{count}} project",
    "projects-count_other": "{{count}} projects",
    "type-non-formal-education": "Non-formal education",
    "type-child-family-services": "Child and family services",
  },
  fr: {
    "title-label": "Titre",
    "projects-count-label": "Projets",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Tag sans titre",
    "no-description": "Aucune description",
    "projects-count": "{{count}} projet",
    "projects-count_other": "{{count}} projets",
    "type-non-formal-education": "Éducation non formelle",
    "type-child-family-services": "Aide à l’enfance et à la famille",
  },
  de: {
    "title-label": "Titel",
    "projects-count-label": "Projekte",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Tag ohne Titel",
    "no-description": "Keine Beschreibung",
    "projects-count": "{{count}} Projekt",
    "projects-count_other": "{{count}} Projekte",
    "type-non-formal-education": "Nicht-formale Bildung",
    "type-child-family-services": "Kinder- und Familienhilfe",
  },
}
