import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, isNotEmptyString, placeholder, stripHtml } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "../service.context"

/**
 * OrganisationContactsDetailsDialog
 */
export const OrganisationContactsDetailsDialog: React.FC<Ui.QuickDialogProps<Api.ContactOrganisation>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("dialog-description")}
      {...props}
      classNames={{ content: "sm:max-w-5xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.ContactOrganisation>> = ({ item }) => {
  const { _, format } = useTranslation(dictionary)
  const { getImageUrl } = useDirectoryService()
  const { translate } = useContextualLanguage()
  const translated = translate(item, servicePlaceholder.contactOrganisation)
  const contactTranslated = translate(item.contact, servicePlaceholder.contact)
  const fullName = placeholder(`${item.contact.firstName} ${item.contact.lastName}`, _("name-untitled"))
  const role = placeholder(translated.role, _("role-untitled"))
  const roleDescription = translated.roleDescription
  const { description, biography } = contactTranslated
  const portraitImage = getImageUrl(item.contact.portraitImage, "preview") ?? undefined
  const squareImage = getImageUrl(item.contact.squareImage, "preview") ?? undefined

  // Merge contact and contactOrganisation data (contactOrganisation takes priority)
  const emails = A.isNotEmpty(item.emails) ? item.emails : item.contact.emails
  const phones = A.isNotEmpty(item.phones) ? item.phones : item.contact.phones
  const extras = A.isNotEmpty(item.extras) ? item.extras : item.contact.extras

  const baseLevel = 2

  return (
    <div className='space-y-6 pb-6 @container'>
      {/* Header with images and basic info */}
      <div className='grid gap-6 @lg:grid-cols-[auto_1fr]'>
        {/* Images */}
        <div className='flex gap-4 @lg:flex-col'>
          {squareImage && (
            <Ui.Image
              src={squareImage}
              alt={fullName}
              className='aspect-square rounded-md object-cover object-center w-32 h-32'
            />
          )}
          {portraitImage && (
            <Ui.Image
              src={portraitImage}
              alt={fullName}
              className='aspect-[3/4] rounded-md object-cover object-center w-24 h-32'
            />
          )}
        </div>

        {/* Basic Info */}
        <div className='space-y-4'>
          <div>
            <Ui.Hn level={baseLevel} className='text-2xl font-bold'>
              {fullName}
            </Ui.Hn>
            <p className='text-lg text-muted-foreground mt-1'>{role}</p>
          </div>

          {/* Flags and dates */}
          <div className='flex flex-wrap gap-2'>
            {item.isPrimary && <Ui.Badge variant='secondary'>{_("primary")}</Ui.Badge>}
            {item.isResponsible && <Ui.Badge variant='secondary'>{_("responsible")}</Ui.Badge>}
            {item.contact.politicalParty && <Ui.Badge variant='outline'>{item.contact.politicalParty}</Ui.Badge>}
          </div>

          {(item.startDate || item.endDate) && (
            <div className='text-sm'>
              <span className='text-muted-foreground'>{_("period")}:</span>{" "}
              <span>
                {item.startDate ? format(item.startDate, "short") : "..."}
                {" → "}
                {item.endDate ? format(item.endDate, "short") : _("active")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Role Description */}
      {isNotEmptyString(roleDescription) && (
        <div>
          <Ui.Hn level={baseLevel} className='text-sm font-medium text-muted-foreground'>
            {_("roleDescription")}
          </Ui.Hn>
          <p className='mt-1 text-base'>{roleDescription}</p>
        </div>
      )}

      {/* Description */}
      {isNotEmptyString(stripHtml(description)) && (
        <div>
          <Ui.Hn level={baseLevel} className='text-sm font-medium text-muted-foreground'>
            {_("contact-description")}
          </Ui.Hn>
          <div className='prose prose-sm dark:prose-invert mt-1' dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}

      {/* Biography */}
      {isNotEmptyString(stripHtml(biography)) && (
        <div>
          <Ui.Hn level={baseLevel} className='text-sm font-medium text-muted-foreground'>
            {_("biography")}
          </Ui.Hn>
          <div className='prose prose-sm dark:prose-invert mt-1' dangerouslySetInnerHTML={{ __html: biography }} />
        </div>
      )}

      {/* Contact Information */}
      <div className='grid gap-6 @lg:grid-cols-2'>
        {/* Emails */}
        {A.isNotEmpty(emails) && (
          <div>
            <Ui.Hn level={baseLevel} className='text-sm font-medium text-muted-foreground'>
              {_("emails")}
            </Ui.Hn>
            <div className='mt-2 space-y-2'>
              {A.mapWithIndex(emails, (index, email) => (
                <div
                  key={index}
                  className='flex items-start gap-2 group border rounded-md hover:border-primary transition-colors duration-300 ease-in-out p-2 pl-4'
                >
                  <span className='text-muted-foreground min-w-20 text-xs/[18px] pt-[5px]'>
                    {placeholder(email.name, _("email-untitled"))}:
                  </span>
                  <div className='flex justify-between grow'>
                    <a href={`mailto:${email.value}`} className='text-primary hover:underline text-sm/[18px] pt-[5px]'>
                      {email.value}
                    </a>
                    <Ui.CopyToClipboardButton
                      value={email.value}
                      size='xs'
                      variant='ghost'
                      className='opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phones */}
        {A.isNotEmpty(phones) && (
          <div>
            <Ui.Hn level={baseLevel} className='text-sm font-medium text-muted-foreground'>
              {_("phones")}
            </Ui.Hn>
            <div className='mt-2 space-y-2'>
              {A.mapWithIndex(phones, (index, phone) => (
                <div
                  key={index}
                  className='flex items-start gap-2 group border rounded-md hover:border-primary transition-colors duration-300 ease-in-out p-2 pl-4'
                >
                  <span className='text-muted-foreground min-w-20 text-xs/[18px] pt-[5px]'>
                    {placeholder(phone.name, _("phone-untitled"))}:
                  </span>
                  <div className='flex justify-between grow'>
                    <a href={`tel:${phone.value}`} className='text-primary hover:underline text-sm/[18px] pt-[5px]'>
                      {phone.value}
                    </a>
                    <Ui.CopyToClipboardButton
                      value={phone.value}
                      size='xs'
                      variant='ghost'
                      className='opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {A.isNotEmpty(extras) && (
          <div className='@lg:col-span-2'>
            <Ui.Hn level={baseLevel} className='text-sm font-medium text-muted-foreground'>
              {_("extras")}
            </Ui.Hn>
            <div className='mt-2 grid gap-2 @md:grid-cols-2'>
              {A.mapWithIndex(extras, (index, { name, type, value }) => (
                <div
                  key={index}
                  className='flex items-start gap-2 group border rounded-md hover:border-primary transition-colors duration-300 ease-in-out p-2 pl-4'
                >
                  <span className='text-muted-foreground min-w-20 text-xs/[18px] pt-[5px]'>
                    {placeholder(name, _("extra-untitled"))}:
                  </span>
                  <div className='flex justify-between grow'>
                    {type === "email" ? (
                      <a href={`mailto:${value}`} className='text-primary hover:underline text-sm/[18px] pt-[5px]'>
                        {value}
                      </a>
                    ) : type === "phone" ? (
                      <a href={`tel:${value}`} className='text-primary hover:underline text-sm/[18px] pt-[5px]'>
                        {value}
                      </a>
                    ) : type === "url" ? (
                      <a
                        href={value}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline text-sm/[18px] pt-[5px]'
                      >
                        {value}
                      </a>
                    ) : (
                      <span className='text-sm/[18px] pt-[5px]'>{value}</span>
                    )}
                    <Ui.CopyToClipboardButton
                      value={value}
                      size='xs'
                      variant='ghost'
                      className='opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Contact Details",
    "dialog-description": "Detailed information about the contact in this organisation",
    "name-untitled": "Unnamed contact",
    "role-untitled": "No role specified",
    roleDescription: "Role Description",
    "contact-description": "Description",
    biography: "Biography",
    period: "Period",
    active: "Active",
    primary: "Primary",
    responsible: "Responsible",
    emails: "Emails",
    phones: "Phones",
    extras: "Additional Information",
    "email-untitled": "Email",
    "phone-untitled": "Phone",
    "extra-untitled": "Info",
  },
  fr: {
    title: "Détails du contact",
    "dialog-description": "Informations détaillées sur le contact dans cette organisation",
    "name-untitled": "Contact sans nom",
    "role-untitled": "Aucun rôle spécifié",
    roleDescription: "Description du rôle",
    "contact-description": "Description",
    biography: "Biographie",
    period: "Période",
    active: "Actif",
    primary: "Principal",
    responsible: "Responsable",
    emails: "Emails",
    phones: "Téléphones",
    extras: "Informations supplémentaires",
    "email-untitled": "Email",
    "phone-untitled": "Téléphone",
    "extra-untitled": "Info",
  },
  de: {
    title: "Kontaktdetails",
    "dialog-description": "Detaillierte Informationen über den Kontakt in dieser Organisation",
    "name-untitled": "Unbenannter Kontakt",
    "role-untitled": "Keine Rolle angegeben",
    roleDescription: "Rollenbeschreibung",
    "contact-description": "Beschreibung",
    biography: "Biografie",
    period: "Zeitraum",
    active: "Aktiv",
    primary: "Primär",
    responsible: "Verantwortlich",
    emails: "E-Mails",
    phones: "Telefonnummern",
    extras: "Zusätzliche Informationen",
    "email-untitled": "E-Mail",
    "phone-untitled": "Telefon",
    "extra-untitled": "Info",
  },
}
