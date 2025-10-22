import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { UserTooltip } from "@compo/users"
import { placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table"
import { Calendar, UserIcon } from "lucide-react"
import React from "react"
import { useOrganisation } from "../organisation.context"
import { useDirectoryService } from "../service.context"
import { OrganisationContactsMenu } from "./organisation.contacts.menu"

/**
 * OrganisationContactsTable
 */
export const OrganisationContactsTable: React.FC<{ contactOrganisations: Api.ContactOrganisation[] }> = ({
  contactOrganisations,
}) => {
  const { _ } = useTranslation(dictionary)
  const table = useReactTable<Api.ContactOrganisation>({
    data: contactOrganisations,
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
      {(row) => <TableRow key={row.id} row={row} contactOrganisation={row.original} />}
    </Dashboard.Table.Tanstack>
  )
}

const TableRow: React.FC<{
  row: any
  contactOrganisation: Api.ContactOrganisation
}> = ({ row, contactOrganisation }) => {
  const { selectable } = useOrganisation()
  return (
    <Dashboard.Table.Row
      menu={<OrganisationContactsMenu contactOrganisation={contactOrganisation} />}
      item={contactOrganisation}
      selectable={selectable}
      cells={row.getVisibleCells()}
    />
  )
}

// Column components
type ColumnProps = { row: Row<Api.ContactOrganisation> }

const ColumnContact: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { getImageUrl } = useDirectoryService()
  const contactOrganisation = row.original
  const contact = contactOrganisation.contact
  if (!contact) return <span className='text-muted-foreground'>{_("no-contact")}</span>

  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || _("untitled")
  const imageUrl = getImageUrl(contact.squareImage, "thumbnail")

  return (
    <div className='inline-flex items-center gap-4'>
      <Ui.Image
        src={imageUrl ?? undefined}
        classNames={{
          wrapper: "size-8 rounded-full overflow-hidden flex-none border border-border",
          image: "size-8 object-cover",
        }}
        alt={fullName}
      >
        <div className='bg-muted flex size-8 items-center justify-center rounded-full'>
          <UserIcon className='text-muted-foreground !size-3.5' aria-hidden />
        </div>
      </Ui.Image>
      <span className='truncate'>{fullName}</span>
    </div>
  )
}

const ColumnRole: React.FC<ColumnProps> = ({ row }) => {
  const { translate } = useContextualLanguage()
  const contactOrganisation = row.original
  const translated = translate(contactOrganisation, servicePlaceholder.contactOrganisation)
  return <span className='truncate'>{placeholder(translated.role, "-")}</span>
}

const ColumnDates: React.FC<ColumnProps> = ({ row }) => {
  const { _, format } = useTranslation(dictionary)
  const contactOrganisation = row.original
  const startDate = contactOrganisation.startDate
  const endDate = contactOrganisation.endDate

  if (!startDate && !endDate) {
    return <span className='text-muted-foreground text-xs'>-</span>
  }

  return (
    <div className='flex items-center gap-2 text-xs'>
      <Calendar className='size-3.5 text-muted-foreground' aria-hidden />
      <span>
        {startDate ? format(startDate, "short") : "..."}
        {" → "}
        {endDate ? format(endDate, "short") : _("active")}
      </span>
    </div>
  )
}

const ColumnFlags: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const contactOrganisation = row.original

  return (
    <div className='flex items-center gap-2'>
      {contactOrganisation.isPrimary && <Ui.Badge variant='secondary'>{_("primary")}</Ui.Badge>}
      {contactOrganisation.isResponsible && <Ui.Badge variant='secondary'>{_("responsible")}</Ui.Badge>}
    </div>
  )
}

const ColumnCreatedBy: React.FC<ColumnProps> = ({ row }) => {
  return <UserTooltip user={row.original.createdBy} displayUsername />
}

const ColumnUpdatedBy: React.FC<ColumnProps> = ({ row }) => {
  return <UserTooltip user={row.original.updatedBy} displayUsername />
}

/**
 * Columns definition
 */
const columns: ColumnDef<Api.ContactOrganisation>[] = [
  {
    id: "contact",
    header: "contact-label",
    cell: ({ row }) => <ColumnContact row={row} />,
    size: 300,
  },
  {
    id: "role",
    header: "role-label",
    cell: ({ row }) => <ColumnRole row={row} />,
    size: 200,
  },
  {
    id: "dates",
    header: "dates-label",
    cell: ({ row }) => <ColumnDates row={row} />,
    size: 200,
  },
  {
    id: "flags",
    header: "flags-label",
    cell: ({ row }) => <ColumnFlags row={row} />,
    size: 150,
  },
  {
    id: "createdBy",
    header: "created-by-label",
    cell: ({ row }) => <ColumnCreatedBy row={row} />,
    size: 120,
  },
  {
    id: "updatedBy",
    header: "updated-by-label",
    cell: ({ row }) => <ColumnUpdatedBy row={row} />,
    size: 120,
  },
  {
    id: "menu",
    header: "",
    size: 60,
    meta: {
      isSticky: true,
    },
  },
]

/**
 * translations
 */
const dictionary = {
  en: {
    untitled: "Unnamed contact",
    "no-contact": "No contact",
    "contact-label": "Contact",
    "role-label": "Role",
    "dates-label": "Period",
    "flags-label": "Flags",
    primary: "Primary",
    "responsible-label": "Responsible",
    active: "Active",
    "created-by-label": "Created by",
    "updated-by-label": "Updated by",
  },
  fr: {
    untitled: "Contact sans nom",
    "no-contact": "Pas de contact",
    "contact-label": "Contact",
    role: "Rôle",
    "dates-label": "Période",
    "flags-label": "Marqueurs",
    primary: "Principal",
    "responsible-label": "Responsable",
    active: "Actif",
    "created-by": "Créé par",
    "updated-by": "Modifié par",
  },
  de: {
    untitled: "Unbenannter Kontakt",
    "no-contact": "Kein Kontakt",
    "contact-label": "Kontakt",
    role: "Rolle",
    "dates-label": "Zeitraum",
    "flags-label": "Markierungen",
    primary: "Primär",
    "responsible-label": "Verantwortlich",
    active: "Aktiv",
    "created-by": "Erstellt von",
    "updated-by": "Geändert von",
  },
}
