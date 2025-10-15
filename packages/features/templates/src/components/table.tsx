import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import React from "react"
import { useTemplates } from "../templates.context"
import { TemplatesMenu } from "./templates.menu"

/**
 * Table
 */
export const Table: React.FC<{ templates: Api.TemplateWithRelations[] }> = ({ templates }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.TemplateWithRelations>({
    data: templates,
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
      {(row) => <TableRow key={row.id} row={row} template={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  template: Api.TemplateWithRelations
}> = ({ row, template }) => {
  const { selectable, displayTemplate } = useTemplates()

  return (
    <Dashboard.Table.Row
      menu={<TemplatesMenu template={template} />}
      item={template}
      selectable={selectable}
      {...smartClick(template, selectable, () => displayTemplate(template))}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.TemplateWithRelations> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useTemplates()
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
  const { translate } = useLanguage()
  const template = row.original
  const translated = translate(template, servicePlaceholder.template)
  const title = placeholder(translated.title, _("untitled"))
  return (
    <div className='inline-flex items-center gap-4'>
      {/* <Ui.Image src={imageUrl ?? undefined} className='bg-muted size-8 shrink-0 rounded-md'>
        <LayoutPanelTop className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image> */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{title}</span>
        </div>
      </div>
    </div>
  )
}
const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const template = row.original
  return <UserTooltip user={template.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const template = row.original

  return formatDistance(T.parseISO(template.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.TemplateWithRelations>[] = [
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
    accessorFn: (template) => template.translations[0]?.title || "",
    size: 400,
    minSize: 200,
    maxSize: 800,
    cell: ({ row }) => <ColumnTitle row={row} />,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    size: 180,
    minSize: 150,
    maxSize: 220,
    accessorFn: (template) => template.updatedBy,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (template) => template.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<TemplatesMenu template={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "title-label": "Title",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    untitled: "Untitled template",
    "no-description": "No description",
  },
  fr: {
    "title-label": "Titre",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Template sans titre",
    "no-description": "Aucune description",
  },
  de: {
    "title-label": "Titel",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Unbenannte Template",
    "no-description": "Keine Beschreibung",
  },
}
