import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage, useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { FolderIcon, LayoutPanelTop } from "lucide-react"
import React from "react"
import { useProjects } from "../projects.context"
import { useProjectsService } from "../service.context"
import { ProjectsStateIcon } from "./icons"
import { ProjectsMenu } from "./projects.menu"

/**
 * ProjectsTable
 */
export const ProjectsTable: React.FC<{ projects: Api.ProjectWithRelations[] }> = ({ projects }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.ProjectWithRelations>({
    data: projects,
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
      {(row) => <TableRow key={row.id} row={row} project={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  project: Api.ProjectWithRelations
}> = ({ row, project }) => {
  const { selectable, displayProject } = useProjects()

  return (
    <Dashboard.Table.Row
      menu={<ProjectsMenu project={project} />}
      item={project}
      selectable={selectable}
      {...smartClick(project, selectable, () => displayProject(project))}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.ProjectWithRelations> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useProjects()
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
  const project = row.original
  const translatedSeo = translate(project.seo, servicePlaceholder.seo)
  const title = placeholder(translatedSeo.title, _("untitled"))
  const imageUrl = getImageUrl(translatedSeo.image)
  const path = project.slug.path === "/" ? "/" : `/${project.slug.path}`
  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image src={imageUrl ?? undefined} className='bg-muted size-8 shrink-0 rounded-md'>
        <LayoutPanelTop className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{title}</span>
        </div>
        {project.slug && <div className='text-muted-foreground truncate text-xs'>{path}</div>}
      </div>
    </div>
  )
}

const ColumnState: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const project = row.original
  return (
    <span className='inline-flex items-center gap-2'>
      <ProjectsStateIcon state={project.state} className='size-4' />
      {_(`state-${project.state}`)}
    </span>
  )
}

const ColumnCategory: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const project = row.original
  const categoryTitle = project.category
    ? placeholder(translate(project.category, servicePlaceholder.projectCategory).title, _("uncategorized"))
    : _("uncategorized")
  return (
    <span className='inline-flex items-center gap-2'>
      <FolderIcon aria-hidden className='text-blue-600 size-4' />
      {categoryTitle}
    </span>
  )
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const project = row.original
  return <UserTooltip user={project.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const project = row.original

  return formatDistance(T.parseISO(project.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.ProjectWithRelations>[] = [
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
    accessorFn: (project) => project.seo.translations[0]?.title || "",
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
    accessorFn: (project) => project.state,
    cell: ({ row }) => <ColumnState row={row} />,
  },
  {
    id: "category",
    header: "category-label",
    size: 150,
    minSize: 120,
    maxSize: 200,
    accessorFn: (project) => project.category?.translations[0]?.title || "",
    cell: ({ row }) => <ColumnCategory row={row} />,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    size: 180,
    minSize: 150,
    maxSize: 220,
    accessorFn: (project) => project.updatedBy,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (project) => project.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<ProjectsMenu project={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "title-label": "Title",
    "state-label": "Status",
    "category-label": "Category",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    untitled: "Untitled project",
    "no-description": "No description",
    uncategorized: "Uncategorized",
    "state-draft": "Draft",
    "state-published": "Published",
  },
  fr: {
    "title-label": "Titre",
    "state-label": "Statut",
    "category-label": "Catégorie",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Projet sans titre",
    "no-description": "Aucune description",
    uncategorized: "Non catégorisé",
    "state-draft": "Brouillon",
    "state-published": "Publié",
  },
  de: {
    "title-label": "Titel",
    "state-label": "Status",
    "category-label": "Kategorie",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Projekt ohne Titel",
    "no-description": "Keine Beschreibung",
    uncategorized: "Nicht kategorisiert",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
  },
}
