import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder, T } from "@compo/utils"
import { placeholder as placeholderService, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { ArrowRightFromLine, ArrowRightToLine, LayoutPanelTop } from "lucide-react"
import React from "react"
import { useForwards } from "../forwards.context"
import { useForwardsService } from "../service.context"
import { getSlugSeo } from "../utils"
import { ForwardsMenu } from "./forwards.menu"

/**
 * ForwardsTable
 */
export const ForwardsTable: React.FC<{ forwards: Api.Forward[] }> = ({ forwards }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.Forward>({
    data: forwards,
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
      {(row) => <TableRow key={row.id} row={row} forward={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  forward: Api.Forward
}> = ({ row, forward }) => {
  const { selectable } = useForwards()

  return (
    <Dashboard.Table.Row
      menu={<ForwardsMenu forward={forward} />}
      item={forward}
      selectable={selectable}
      {...smartClick(forward, selectable, () => {})}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.Forward> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useForwards()
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

const ColumnRedirect: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { getImageUrl } = useForwardsService()
  const forward = row.original
  const seo = getSlugSeo(forward.slug)
  const translatedSeo = translate(seo, placeholderService.seo)
  const title = placeholder(translatedSeo.title, _("untitled"))
  const imageUrl = getImageUrl(translatedSeo.image)
  return (
    <div className='inline-flex items-center gap-4'>
      <div className='relative bg-muted size-16 shrink-0 rounded flex items-center justify-center overflow-hidden'>
        <LayoutPanelTop className='text-muted-foreground size-4' aria-hidden />
        <Ui.Image src={imageUrl ?? undefined} className='size-full absolute inset-0 shrink-0 rounded object-cover' />
      </div>
      <div className='min-w-0 flex-1 flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{title}</span>
        </div>
        <div className='flex flex-col gap-1 text-muted-foreground text-xs/none'>
          <span className='truncate rounded flex items-center gap-2'>
            <ArrowRightToLine className='size-3.5 shrink-0' aria-hidden />
            {forward.path}
          </span>
          <span className='truncate rounded  flex items-center gap-2'>
            <ArrowRightFromLine className='size-3.5 shrink-0' aria-hidden />
            {forward.slug.path}
          </span>
        </div>
      </div>
    </div>
  )
}

const ColumnType: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const forward = row.original
  const type = forward.slug.model

  if (!type) return <span className='text-muted-foreground'>—</span>

  return <Ui.Badge>{_(type)}</Ui.Badge>
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const forward = row.original

  return formatDistance(T.parseISO(forward.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.Forward>[] = [
  {
    id: "select",
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: ({ row }) => <ColumnSelect row={row} />,
  },
  {
    id: "redirect",
    header: "redirect-label",
    accessorFn: (forward) => forward.path,
    size: 800,
    minSize: 300,
    maxSize: 1200,
    cell: ({ row }) => <ColumnRedirect row={row} />,
  },
  {
    id: "type",
    header: "type-label",
    size: 200,
    minSize: 80,
    maxSize: 300,
    accessorFn: (forward) => forward.slug.model,
    cell: ({ row }) => <ColumnType row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 300,
    minSize: 80,
    maxSize: 400,
    accessorFn: (forward) => forward.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<ForwardsMenu forward={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "redirect-label": "Redirect",
    "type-label": "Type",
    "updated-at-label": "Last update",
    "redirect-to": "Redirects to {type}",
    untitled: "Untitled",
    page: "Page",
    article: "Article",
    project: "Project",
  },
  fr: {
    "redirect-label": "Redirection",
    "type-label": "Type",
    "updated-at-label": "Dernière mise à jour",
    "redirect-to": "Redirige vers {type}",
    untitled: "Sans titre",
    page: "Page",
    article: "Article",
    project: "Projet",
  },
  de: {
    "redirect-label": "Weiterleitung",
    "type-label": "Typ",
    "updated-at-label": "Letzte Aktualisierung",
    "redirect-to": "Leitet weiter zu {type}",
    untitled: "Ohne Titel",
    page: "Seite",
    article: "Artikel",
    project: "Projekt",
  },
}
