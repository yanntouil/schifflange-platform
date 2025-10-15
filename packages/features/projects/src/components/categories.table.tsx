import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { FolderIcon } from "lucide-react"
import React from "react"
import { useCategories } from "../categories.context"
import { useProjectsService } from "../service.context"
import { CategoriesMenu } from "./categories.menu"

/**
 * CategoriesTable
 */
export const CategoriesTable: React.FC<{ categories: Api.ProjectCategory[] }> = ({ categories }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.ProjectCategory>({
    data: categories,
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
      {(row) => <TableRow key={row.id} row={row} category={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  category: Api.ProjectCategory
}> = ({ row, category }) => {
  const { selectable } = useCategories()

  return (
    <Dashboard.Table.Row
      menu={<CategoriesMenu category={category} />}
      item={category}
      selectable={selectable}
      {...smartClick(category, selectable, () => {})}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.ProjectCategory> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useCategories()
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
  const category = row.original
  const translatedCategory = translate(category, servicePlaceholder.projectCategory)
  const title = placeholder(translatedCategory.title, _("untitled"))
  const imageUrl = getImageUrl(translatedCategory.image)
  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image src={imageUrl ?? undefined} className='bg-muted size-8 shrink-0 rounded-md'>
        <FolderIcon className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{title}</span>
        </div>
      </div>
    </div>
  )
}

const ColumnProjectsCount: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const category = row.original
  return (
    <span className='inline-flex items-center gap-2'>
      <FolderIcon aria-hidden className='text-blue-600 size-4' />
      {_("projects-count", { count: category.totalProjects || 0 })}
    </span>
  )
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const category = row.original
  return <UserTooltip user={category.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const category = row.original

  return formatDistance(T.parseISO(category.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.ProjectCategory>[] = [
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
    accessorFn: (category) => category.translations[0]?.title || "",
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
    accessorFn: (category) => category.totalProjects || 0,
    cell: ({ row }) => <ColumnProjectsCount row={row} />,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    size: 180,
    minSize: 150,
    maxSize: 220,
    accessorFn: (category) => category.updatedById,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (category) => category.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<CategoriesMenu category={row.original} />} />,
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
    untitled: "Untitled category",
    "no-description": "No description",
    "projects-count": "{{count}} project",
    "projects-count_other": "{{count}} projects",
  },
  fr: {
    "title-label": "Titre",
    "projects-count-label": "Projets",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Catégorie sans titre",
    "no-description": "Aucune description",
    "projects-count": "{{count}} projet",
    "projects-count_other": "{{count}} projets",
  },
  de: {
    "title-label": "Titel",
    "projects-count-label": "Projekte",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Kategorie ohne Titel",
    "no-description": "Keine Beschreibung",
    "projects-count": "{{count}} Projekt",
    "projects-count_other": "{{count}} Projekte",
  },
}
