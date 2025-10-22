import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { UserIcon } from "lucide-react"
import React from "react"
import { useContacts } from "../contacts.context"
import { useDirectoryService } from "../service.context"
import { ContactsMenu } from "./contacts.menu"

/**
 * ContactsTable
 */
export const ContactsTable: React.FC<{ contacts: Api.Contact[] }> = ({ contacts }) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.Contact>({
    data: contacts,
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
      {(row) => <TableRow key={row.id} row={row} contact={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  contact: Api.Contact
}> = ({ row, contact }) => {
  const { selectable } = useContacts()

  return (
    <Dashboard.Table.Row
      menu={<ContactsMenu contact={contact} />}
      item={contact}
      selectable={selectable}
      {...smartClick(contact, selectable, () => {})}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.Contact> }

const ColumnSelect: React.FC<ColumnProps> = ({ row }) => {
  const { selectable } = useContacts()
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
  const contact = row.original
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || _("untitled")
  const imageUrl = getImageUrl(contact.squareImage, "thumbnail")
  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image src={imageUrl ?? undefined} className='bg-muted size-8 shrink-0 rounded-full'>
        <UserIcon className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium'>{fullName}</span>
        </div>
      </div>
    </div>
  )
}

const ColumnPoliticalParty: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const contact = row.original
  if (!contact.politicalParty) {
    return <span className='text-muted-foreground text-sm'>{_("no-party")}</span>
  }
  return <span className='text-sm'>{contact.politicalParty}</span>
}

const ColumnDescription: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const contact = row.original
  const translatedContact = translate(contact, servicePlaceholder.contact)
  const description = placeholder(translatedContact.description, _("no-description"))
  return <span className='line-clamp-2 text-sm'>{description}</span>
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  const contact = row.original
  return <UserTooltip user={contact.updatedBy} displayUsername />
}

const ColumnUpdatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { formatDistance } = useTranslation(dictionary)
  const contact = row.original

  return formatDistance(T.parseISO(contact.updatedAt))
}

/**
 * Table columns
 */
const columns: ColumnDef<Api.Contact>[] = [
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
    accessorFn: (contact) => `${contact.firstName} ${contact.lastName}`,
    size: 250,
    minSize: 200,
    maxSize: 400,
    cell: ({ row }) => <ColumnName row={row} />,
  },
  {
    id: "politicalParty",
    header: "political-party-label",
    accessorFn: (contact) => contact.politicalParty,
    size: 180,
    minSize: 150,
    maxSize: 250,
    cell: ({ row }) => <ColumnPoliticalParty row={row} />,
  },
  {
    id: "description",
    header: "description-label",
    accessorFn: (contact) => contact.translations[0]?.description || "",
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
    accessorFn: (contact) => contact.updatedById,
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
  },
  {
    id: "updatedAt",
    header: "updated-at-label",
    size: 140,
    minSize: 120,
    maxSize: 160,
    accessorFn: (contact) => contact.updatedAt,
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
    cell: ({ row }) => <Dashboard.Table.Menu menu={<ContactsMenu contact={row.original} />} />,
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    "name-label": "Name",
    "political-party-label": "Political party",
    "description-label": "Description",
    "updated-by-label": "Updated by",
    "updated-at-label": "Last update",
    untitled: "Untitled contact",
    "no-party": "No party",
    "no-description": "No description",
  },
  fr: {
    "name-label": "Nom",
    "political-party-label": "Parti politique",
    "description-label": "Description",
    "updated-by-label": "Modifié par",
    "updated-at-label": "Dernière mise à jour",
    untitled: "Contact sans nom",
    "no-party": "Aucun parti",
    "no-description": "Aucune description",
  },
  de: {
    "name-label": "Name",
    "political-party-label": "Politische Partei",
    "description-label": "Beschreibung",
    "updated-by-label": "Aktualisiert von",
    "updated-at-label": "Letzte Aktualisierung",
    untitled: "Kontakt ohne Namen",
    "no-party": "Keine Partei",
    "no-description": "Keine Beschreibung",
  },
}
