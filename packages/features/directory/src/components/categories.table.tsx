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
import { useDirectoryService } from "../service.context"
import { CategoriesMenu } from "./categories.menu"

/**
 * CategoriesTable
 */
export const CategoriesTable: React.FC<{ categories: Api.OrganisationCategory[] }> = ({ categories }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.OrganisationCategory>({
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
  category: Api.OrganisationCategory
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
type ColumnProps = { row: Row<Api.OrganisationCategory> }

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
  const { getImageUrl } = useDirectoryService()
  const { translate } = useContextualLanguage()
  const category = row.original
  const translatedCategory = translate(category, servicePlaceholder.organisationCategory)
  const title = placeholder(translatedCategory.title, _("untitled"))
  const imageUrl = getImageUrl(category.image, "thumbnail")
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

const ColumnType: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const category = row.original
  return <span className='text-muted-foreground text-sm'>{_(`type-${category.type}`)}</span>
}

const ColumnOrder: React.FC<ColumnProps> = ({ row }) => {
  const category = row.original
  return <span className='text-muted-foreground text-sm'>{category.order}</span>
}

const ColumnDescription: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const category = row.original
  const translatedCategory = translate(category, servicePlaceholder.organisationCategory)
  const description = placeholder(translatedCategory.description, _("no-description"))
  return <span className='line-clamp-2 text-sm'>{description}</span>
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
const columns: ColumnDef<Api.OrganisationCategory>[] = [
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
    size: 300,
    minSize: 200,
    maxSize: 500,
    cell: ({ row }) => <ColumnTitle row={row} />,
  },
  {
    id: "type",
    header: "type-label",
    accessorFn: (category) => category.type,
    size: 140,
    minSize: 120,
    maxSize: 180,
    cell: ({ row }) => <ColumnType row={row} />,
  },
  {
    id: "order",
    header: "order-label",
    accessorFn: (category) => category.order,
    size: 100,
    minSize: 80,
    maxSize: 120,
    cell: ({ row }) => <ColumnOrder row={row} />,
  },
  {
    id: "description",
    header: "description-label",
    accessorFn: (category) => category.translations[0]?.description || "",
    size: 300,
    minSize: 200,
    maxSize: 500,
    cell: ({ row }) => <ColumnDescription row={row} />,
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
    "type-label": "Type",
    "order-label": "Order",
    "description-label": "Description",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    untitled: "Untitled category",
    "no-description": "No description",
    "type-municipality": "Municipality",
    "type-service": "Service",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Company",
    "type-other": "Other",
  },
  fr: {
    "title-label": "Titre",
    "type-label": "Type",
    "order-label": "Ordre",
    "description-label": "Description",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Catégorie sans titre",
    "no-description": "Aucune description",
    "type-municipality": "Commune",
    "type-service": "Service communal",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Entreprise",
    "type-other": "Autre",
  },
  de: {
    "title-label": "Titel",
    "type-label": "Typ",
    "order-label": "Reihenfolge",
    "description-label": "Beschreibung",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Kategorie ohne Titel",
    "no-description": "Keine Beschreibung",
    "type-municipality": "Gemeinde",
    "type-service": "Dienst",
    "type-association": "Verein",
    "type-commission": "Kommission",
    "type-company": "Unternehmen",
    "type-other": "Andere",
  },
}
