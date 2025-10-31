import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { LayoutPanelTop, LockIcon } from "lucide-react"
import React from "react"
import { usePages } from "../pages.context"
import { usePagesService } from "../service.context"
import { StateIcon } from "./pages.icons"
import { PagesMenu } from "./pages.menu"

/**
 * PagesTable
 */
export const PagesTable: React.FC<{ pages: Api.PageWithRelations[] }> = ({ pages }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.PageWithRelations>({
    data: pages,
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
      {(row) => <TableRow key={row.id} row={row} page={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  page: Api.PageWithRelations
}> = ({ row, page }) => {
  const { selectable, displayPage } = usePages()

  return (
    <Dashboard.Table.Row
      menu={<PagesMenu page={page} />}
      item={page}
      selectable={selectable}
      {...smartClick(page, selectable, () => displayPage(page))}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.PageWithRelations> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = usePages()
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
  const { getImageUrl } = usePagesService()
  const { translate } = useLanguage()
  const page = row.original
  const translatedSeo = translate(page.seo, servicePlaceholder.seo)
  const title = placeholder(translatedSeo.title, _("untitled"))
  const imageUrl = getImageUrl(translatedSeo.image)
  const path = page.slug.path === "/" ? "/" : `/${page.slug.path}`
  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image src={imageUrl ?? undefined} className='bg-muted size-8 shrink-0 rounded-md'>
        <LayoutPanelTop className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{title}</span>
          {page.lock && (
            <Ui.Tooltip.Quick tooltip={_("locked-tooltip")}>
              <LockIcon className='size-3 shrink-0' aria-hidden />
              <Ui.SrOnly>{_("locked")}</Ui.SrOnly>
            </Ui.Tooltip.Quick>
          )}
        </div>
        {page.slug && <div className='text-muted-foreground truncate text-xs'>{path}</div>}
      </div>
    </div>
  )
}

const ColumnState: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const page = row.original
  return (
    <span className='inline-flex items-center gap-2'>
      <StateIcon state={page.state} className='size-4' />
      {_(`state-${page.state}`)}
    </span>
  )
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const page = row.original
  return <UserTooltip user={page.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const page = row.original

  return formatDistance(T.parseISO(page.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.PageWithRelations>[] = [
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
    accessorFn: (page) => page.seo.translations[0]?.title || "",
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
    accessorFn: (page) => page.state,
    cell: ({ row }) => <ColumnState row={row} />,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    size: 180,
    minSize: 150,
    maxSize: 220,
    accessorFn: (page) => page.updatedBy,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (page) => page.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<PagesMenu page={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "title-label": "Title",
    "state-label": "Status",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    untitled: "Untitled page",
    "no-description": "No description",
    "state-draft": "Draft",
    "state-published": "Published",
    locked: "Locked",
    "locked-tooltip": "This page is locked by an administrator",
  },
  fr: {
    "title-label": "Titre",
    "state-label": "Statut",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Page sans titre",
    "no-description": "Aucune description",
    "state-draft": "Brouillon",
    "state-published": "Publié",
    locked: "Verrouillé",
    "locked-tooltip": "Cette page est verrouillée par un administrateur",
  },
  de: {
    "title-label": "Titel",
    "state-label": "Status",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Unbenannte Seite",
    "no-description": "Keine Beschreibung",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
    locked: "Gesperrt",
    "locked-tooltip": "Diese Seite ist von einem Administrator gesperrt",
  },
}
