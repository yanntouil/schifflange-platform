import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, cxm, getInitials, makeColorsFromString, placeholder } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Calendar, Crown, UserCheck } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { useContact } from "../contact.context"
import { useDirectoryService } from "../service.context"

/**
 * ContactOrganisations
 */
export const ContactOrganisations: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useContact()
  const { contact } = ctx.swr
  const baseLevel = 2

  const { contactOrganisations } = contact

  return (
    <Ui.CollapsibleCard.Root id={`${contact.id}-organisations`}>
      <Ui.CollapsibleCard.Header>
        <div>
          <Ui.CollapsibleCard.Title level={baseLevel}>{_("title")}</Ui.CollapsibleCard.Title>
          <Ui.Card.Description>{_("description")}</Ui.Card.Description>
        </div>
        <Ui.CollapsibleCard.Aside />
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container'>
        <div className='p-6 pt-2'>
          {A.isEmpty(contactOrganisations) ? (
            <p className='text-muted-foreground text-sm text-center py-8'>{_("no-organisations")}</p>
          ) : (
            <div className='grid gap-4 @md:grid-cols-2 @xl:grid-cols-3'>
              {A.mapWithIndex(contactOrganisations, (index, co) => (
                <ContactOrganisationCard key={co.id} contactOrganisation={co} level={baseLevel + 1} />
              ))}
            </div>
          )}
        </div>
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

/**
 * ContactOrganisationCard
 */
const ContactOrganisationCard: React.FC<{
  contactOrganisation: Api.ContactWithRelations["contactOrganisations"][number]
  level: number
}> = ({ contactOrganisation, level }) => {
  const { _, format } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { scheme } = Ui.useTheme()
  const { getImageUrl, routesTo } = useDirectoryService()
  const [, navigate] = useLocation()

  const { organisation } = contactOrganisation

  if (!organisation) return null

  const translated = translate(contactOrganisation, servicePlaceholder.contactOrganisation)
  const orgTranslated = translate(organisation, servicePlaceholder.organisation)
  const name = placeholder(orgTranslated.name, _("organisation-untitled"))
  const role = placeholder(translated.role, _("role-untitled"))
  const [light, dark] = makeColorsFromString(name)
  const initials = getInitials(name, "", 2)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  const image = getImageUrl(organisation.logoImage, "thumbnail")
  const imageCx = "rounded-sm flex-none size-12 fit-contain"

  const handleClick = () => {
    navigate(routesTo.organizations.byId(organisation.id))
  }

  return (
    <div
      onClick={handleClick}
      className='border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer group space-y-3'
    >
      {/* Header with image and name */}
      <div className='flex items-center gap-3'>
        {image ? (
          <Ui.Image src={image} classNames={{ wrapper: imageCx, image: imageCx }} alt={name}>
            <Ui.ImageEmpty />
          </Ui.Image>
        ) : (
          <span className={cxm(imageCx, "flex items-center justify-center text-sm font-medium")} style={style}>
            {initials}
          </span>
        )}
        <div className='flex-1 min-w-0'>
          <Ui.Hn level={level} className='font-medium text-sm group-hover:text-primary transition-colors truncate'>
            {placeholder(name, _("organisation-untitled"))}
          </Ui.Hn>
          <p className='text-xs text-muted-foreground truncate'>{placeholder(role, _("role-untitled"))}</p>
        </div>
      </div>

      {/* Badges and info */}
      {(contactOrganisation.isPrimary || contactOrganisation.isResponsible) && (
        <div className='flex flex-wrap gap-2'>
          {contactOrganisation.isPrimary && (
            <Ui.Badge variant='secondary' className='text-xs gap-1'>
              <Crown className='size-3' />
              {_("primary")}
            </Ui.Badge>
          )}
          {contactOrganisation.isResponsible && (
            <Ui.Badge variant='secondary' className='text-xs gap-1'>
              <UserCheck className='size-3' />
              {_("responsible")}
            </Ui.Badge>
          )}
        </div>
      )}

      {/* Period */}
      {(contactOrganisation.startDate || contactOrganisation.endDate) && (
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Calendar className='size-3' />
          <span>
            {contactOrganisation.startDate ? format(contactOrganisation.startDate, "short") : "..."}
            {" → "}
            {contactOrganisation.endDate ? format(contactOrganisation.endDate, "short") : _("active")}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Organisations",
    description: "Organisations this contact belongs to",
    "no-organisations": "This contact is not associated with any organisation",
    "organisation-untitled": "Unnamed organisation",
    "role-untitled": "No role specified",
    primary: "Primary",
    responsible: "Responsible",
    active: "Active",
  },
  fr: {
    title: "Organisations",
    description: "Organisations auxquelles ce contact appartient",
    "no-organisations": "Ce contact n'est associé à aucune organisation",
    "organisation-untitled": "Organisation sans nom",
    "role-untitled": "Aucun rôle spécifié",
    primary: "Principal",
    responsible: "Responsable",
    active: "Actif",
  },
  de: {
    title: "Organisationen",
    description: "Organisationen, zu denen dieser Kontakt gehört",
    "no-organisations": "Dieser Kontakt ist keiner Organisation zugeordnet",
    "organisation-untitled": "Unbenannte Organisation",
    "role-untitled": "Keine Rolle angegeben",
    primary: "Primär",
    responsible: "Verantwortlich",
    active: "Aktiv",
  },
}
