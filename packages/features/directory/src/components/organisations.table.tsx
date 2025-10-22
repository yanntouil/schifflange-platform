import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { A, G, placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { BuildingIcon, MapPinIcon, SquareUser } from "lucide-react"
import React from "react"
import { useOrganisations } from "../organisations.context"
import { useDirectoryService } from "../service.context"
import { makeAddress } from "../utils"
import { OrganisationsMenu } from "./organisations.menu"

/**
 * OrganisationsTable
 */
export const OrganisationsTable: React.FC<{ organisations: Api.Organisation[] }> = ({ organisations }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.Organisation>({
    data: organisations,
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
      {(row) => <TableRow key={row.id} row={row} organisation={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  organisation: Api.Organisation
}> = ({ row, organisation }) => {
  const { selectable } = useOrganisations()

  return (
    <Dashboard.Table.Row
      menu={<OrganisationsMenu organisation={organisation} />}
      item={organisation}
      selectable={selectable}
      {...smartClick(organisation, selectable, () => {})}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.Organisation> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useOrganisations()
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

const ColumnName: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { getImageUrl } = useDirectoryService()
  const { translate } = useContextualLanguage()
  const organisation = row.original
  const { contactCount } = organisation
  const translatedOrganisation = translate(organisation, servicePlaceholder.organisation)
  const name = placeholder(translatedOrganisation.name, _("untitled"))
  const imageUrl = getImageUrl(organisation.logoImage, "thumbnail")

  const count = contactCount ? (
    <Ui.Tooltip.Quick tooltip={_("contact-count-tooltip", { contactCount })} asChild side='right'>
      <span className='text-muted-foreground text-sm font-light inline-flex items-center gap-0.5 ml-1'>
        {contactCount}
        <SquareUser className='size-3.5' aria-label={"contact-count-aria-label"} />
      </span>
    </Ui.Tooltip.Quick>
  ) : null

  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image src={imageUrl ?? undefined} className='bg-muted size-8 shrink-0 rounded-md'>
        <BuildingIcon className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>
            {name} {count}
          </span>
        </div>
      </div>
    </div>
  )
}

const ColumnType: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const organisation = row.original
  return <span className='text-muted-foreground text-sm'>{_(`type-${organisation.type}`)}</span>
}

const ColumnCategories: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const organisation = row.original
  const categories = organisation.categories || []

  if (categories.length === 0) {
    return <span className='text-muted-foreground text-sm'>{_("no-categories")}</span>
  }

  const translatedCategory = translate(categories[0], servicePlaceholder.organisationCategory)
  const firstCategory = placeholder(translatedCategory.title, _("untitled-category"))

  return (
    <span className='inline-flex items-center gap-2 text-sm'>
      {firstCategory}
      {categories.length > 1 && (
        <Ui.Badge variant='secondary' className='text-xs'>
          +{categories.length - 1}
        </Ui.Badge>
      )}
    </span>
  )
}

const ColumnAddress: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const organisation = row.original
  const firstAddress = A.head(organisation.addresses)

  if (G.isNullable(firstAddress)) {
    return <span className='text-muted-foreground text-sm'>{_("no-address")}</span>
  }
  const shortAddress = [firstAddress.city, firstAddress.country].filter(Boolean).join(", ") || _("no-address")
  const fullAddress = makeAddress(firstAddress)

  return (
    <Ui.Tooltip.Quick tooltip={_("address-tooltip", { fullAddress })} asChild side='right'>
      <span className='inline-flex items-center gap-2 text-sm'>
        <MapPinIcon aria-hidden className='text-muted-foreground size-3.5' />
        <span className='truncate'>{shortAddress}</span>
      </span>
    </Ui.Tooltip.Quick>
  )
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const organisation = row.original

  return (
    <UserTooltip user={organisation.updatedBy} displayUsername>
      {formatDistance(T.parseISO(organisation.updatedAt))}
    </UserTooltip>
  )
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.Organisation>[] = [
  {
    id: "select",
    size: 48,
    minSize: 48,
    maxSize: 48,
    enableResizing: false,
    cell: ({ row }) => <ColumnSelect row={row} />,
  },
  {
    id: "name",
    header: "name-label",
    accessorFn: (organisation) => organisation.translations[0]?.name || "",
    size: 500,
    minSize: 200,
    maxSize: 800,
    cell: ({ row }) => <ColumnName row={row} />,
  },
  {
    id: "type",
    header: "type-label",
    accessorFn: (organisation) => organisation.type,
    size: 200,
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => <ColumnType row={row} />,
  },
  {
    id: "categories",
    header: "categories-label",
    size: 180,
    minSize: 150,
    maxSize: 250,
    cell: ({ row }) => <ColumnCategories row={row} />,
  },
  {
    id: "address",
    header: "address-label",
    size: 200,
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => <ColumnAddress row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 200,
    minSize: 150,
    maxSize: 300,
    accessorFn: (organisation) => organisation.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<OrganisationsMenu organisation={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "name-label": "Name",
    "contact-count-tooltip": "{{contactCount}} contacts in this organisation",
    "contact-count-aria-label": "contacts in this organisation",
    "type-label": "Type",
    "categories-label": "Categories",
    "address-label": "Address",
    "address-tooltip": "Address: {{fullAddress}}",
    "updated-at-label": "Last modification",
    untitled: "Untitled organisation",
    "untitled-category": "Untitled category",
    "no-categories": "-",
    "no-address": "-",
    "type-municipality": "Municipality",
    "type-service": "Service",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Company",
    "type-other": "Other",
  },
  fr: {
    "name-label": "Nom",
    "contact-count-tooltip": "{{contactCount}} contacts dans l'organisation",
    "contact-count-aria-label": "contacts dans l'organisation",
    "type-label": "Type",
    "categories-label": "Catégories",
    "address-label": "Adresse",
    "address-tooltip": "Adresse: {{fullAddress}}",
    "updated-at-label": "Dernière modification",
    untitled: "Organisation sans nom",
    "untitled-category": "Catégorie sans titre",
    "no-categories": "-",
    "no-address": "-",
    "type-municipality": "Commune",
    "type-service": "Service communal",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Entreprise",
    "type-other": "Autre",
  },
  de: {
    "name-label": "Name",
    "contact-count-tooltip": "{{contactCount}} Kontakte in dieser Organisation",
    "contact-count-aria-label": "Kontakte in dieser Organisation",
    "type-label": "Typ",
    "categories-label": "Kategorien",
    "address-label": "Adresse",
    "address-tooltip": "Adresse: {{fullAddress}}",
    "updated-at-label": "Letzte Modifikation",
    untitled: "Organisation ohne Namen",
    "untitled-category": "Kategorie ohne Titel",
    "no-categories": "-",
    "no-address": "-",
    "type-municipality": "Gemeinde",
    "type-service": "Dienst",
    "type-association": "Verein",
    "type-commission": "Kommission",
    "type-company": "Unternehmen",
    "type-other": "Andere",
  },
}
