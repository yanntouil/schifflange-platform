import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { BriefcaseIcon, CalendarIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react"
import React from "react"
import { useOrganisation } from "../organisation.context"
import { useDirectoryService } from "../service.context"
import { OrganisationContactsMenu } from "./organisation.contacts.menu"

/**
 * OrganisationContactsCard
 */
export const OrganisationContactsCard: React.FC<{ contactOrganisation: Api.ContactOrganisation }> = ({
  contactOrganisation,
}) => {
  const { _, format } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { selectable, contactDetails } = useOrganisation()
  const { getImageUrl } = useDirectoryService()
  const contact = contactOrganisation.contact
  const translated = translate(contactOrganisation, servicePlaceholder.contactOrganisation)

  const fullName = placeholder(`${contact.firstName} ${contact.lastName}`, _("name"))

  const role = placeholder(translated.role, _("no-role"))
  const imageUrl = getImageUrl(contact.squareImage, "preview")
  const phone = A.head(contactOrganisation.phones.length > 0 ? contactOrganisation.phones : contact.phones)
  const email = A.head(contactOrganisation.emails.length > 0 ? contactOrganisation.emails : contact.emails)
  const startDate = contactOrganisation.startDate
  const endDate = contactOrganisation.endDate

  return (
    <Dashboard.Card.Root
      key={contactOrganisation.id}
      menu={<OrganisationContactsMenu contactOrganisation={contactOrganisation} />}
      item={contactOrganisation}
      selectable={selectable}
      {...smartClick(contactOrganisation, selectable, () => contactDetails(contactOrganisation))}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined} classNames={{ wrapper: "aspect-square" }}>
        <UserIcon className='text-muted-foreground !size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{fullName}</Dashboard.Card.Title>
        <Dashboard.Card.Description className='text-muted-foreground'>{role}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        {/* Dates */}
        {(startDate || endDate) && (
          <Dashboard.Card.Field>
            <CalendarIcon aria-hidden />
            {startDate ? format(startDate, "short") : "..."}
            {" → "}
            {endDate ? format(endDate, "short") : _("active")}
          </Dashboard.Card.Field>
        )}

        {/* Flags */}
        {(contactOrganisation.isPrimary || contactOrganisation.isResponsible) && (
          <Dashboard.Card.Field className='gap-2'>
            <BriefcaseIcon aria-hidden />
            <div className='inline-flex gap-2'>
              {contactOrganisation.isPrimary && <Ui.Badge variant='secondary'>{_("primary")}</Ui.Badge>}
              {contactOrganisation.isResponsible && <Ui.Badge variant='secondary'>{_("responsible")}</Ui.Badge>}
            </div>
          </Dashboard.Card.Field>
        )}

        {/* Phone */}
        <Dashboard.Card.Field>
          <PhoneIcon aria-hidden />
          {phone ? (
            <>
              {phone.name}:&nbsp;
              <a href={`tel:${phone.value}`} className='text-primary hover:underline'>
                {phone.value}
              </a>
            </>
          ) : (
            _("no-phone")
          )}
        </Dashboard.Card.Field>

        {/* Email */}
        <Dashboard.Card.Field>
          <MailIcon aria-hidden />
          {email ? (
            <>
              {email.name}:&nbsp;
              <a href={`mailto:${email.value}`} className='text-primary hover:underline'>
                {email.value}
              </a>
            </>
          ) : (
            _("no-email")
          )}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    name: "Unnamed contact",
    "no-role": "No role specified",
    active: "Active",
    primary: "Primary",
    responsible: "Responsible",
    "no-phone": "No phone number",
    "no-email": "No email address",
  },
  fr: {
    name: "Contact sans nom",
    "no-role": "Aucun rôle spécifié",
    active: "Actif",
    primary: "Principal",
    responsible: "Responsable",
    "no-phone": "Aucun numéro de téléphone",
    "no-email": "Aucune adresse email",
  },
  de: {
    name: "Unbenannter Kontakt",
    "no-role": "Keine Rolle angegeben",
    active: "Aktiv",
    primary: "Primär",
    responsible: "Verantwortlich",
    "no-phone": "Keine Telefonnummer",
    "no-email": "Keine E-Mail-Adresse",
  },
}
