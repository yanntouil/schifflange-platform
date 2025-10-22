import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { A, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { MailIcon, PartyPopperIcon, PhoneIcon, UserIcon } from "lucide-react"
import React from "react"
import { useContacts } from "../contacts.context"
import { useDirectoryService } from "../service.context"
import { ContactsMenu } from "./contacts.menu"

/**
 * ContactsCard
 */
export const ContactsCard: React.FC<{ contact: Api.Contact }> = ({ contact }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { getImageUrl } = useDirectoryService()
  const translatedContact = translate(contact, servicePlaceholder.contact)
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || _("name")
  const description = placeholder(translatedContact.description, _("description"))
  const { selectable, displayContact } = useContacts()
  const imageUrl = getImageUrl(contact.squareImage, "preview")
  const phone = A.head(contact.phones)
  const phoneNumber = phone ? phone.value : _("no-phone")
  const email = A.head(contact.emails)
  const emailAddress = email ? email.value : _("no-email")
  return (
    <Dashboard.Card.Root
      key={contact.id}
      menu={<ContactsMenu contact={contact} />}
      item={contact}
      selectable={selectable}
      {...smartClick(contact, selectable, () => displayContact(contact))}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined} classNames={{ wrapper: "aspect-square" }}>
        <UserIcon className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{fullName}</Dashboard.Card.Title>
        <Dashboard.Card.Description className='text-muted-foreground'>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        {contact.politicalParty && (
          <Dashboard.Card.Field>
            <PartyPopperIcon aria-hidden />
            {_("political-party")}:&nbsp;
            <span className='font-medium'>{contact.politicalParty}</span>
          </Dashboard.Card.Field>
        )}
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
    description: "No description",
    "political-party": "Political party",
    "no-phone": "No phone number",
    "no-email": "No email address",
  },
  fr: {
    name: "Contact sans nom",
    description: "Aucune description",
    "political-party": "Parti politique",
    "no-phone": "Aucun numéro de téléphone",
    "no-email": "Aucune adresse email",
  },
  de: {
    name: "Unbenannter Kontakt",
    description: "Keine Beschreibung",
    "political-party": "Politische Partei",
    "no-phone": "Kein Telefonnummer",
    "no-email": "Keine E-Mail-Adresse",
  },
}
