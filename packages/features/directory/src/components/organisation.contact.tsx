import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, makeGoogleMapUrl, placeholder, trimSpaces } from "@compo/utils"
import React from "react"
import { useOrganisation } from "../organisation.context"

/**
 * OrganisationContact
 */
export const OrganisationContact: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useOrganisation()
  const { organisation } = ctx.swr
  const { emails, phones, extras, addresses } = organisation
  const baseLevel = 2
  return (
    <Ui.CollapsibleCard.Root id={`${organisation.id}-contact`} defaultOpen={false}>
      <Ui.CollapsibleCard.Header>
        <div>
          <Ui.CollapsibleCard.Title level={baseLevel}>{_("title")}</Ui.CollapsibleCard.Title>
          <Ui.Card.Description>{_("description")}</Ui.Card.Description>
        </div>
        <Ui.CollapsibleCard.Aside />
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container'>
        <div className='p-6 pt-2 flex flex-col gap-6'>
          <div className='grid gap-6 @lg:grid-cols-2'>
            {/* Emails */}
            {A.isNotEmpty(emails) && (
              <div>
                <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
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
                        <a
                          href={`mailto:${email.value}`}
                          className='text-primary hover:underline text-sm/[18px] pt-[5px]'
                        >
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
                <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
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
              <div>
                <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                  {_("extras")}
                </Ui.Hn>
                <div className='mt-2 space-y-2'>
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
          {/* Addresses */}
          {addresses.length > 0 && (
            <div>
              <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                {_("addresses")}
              </Ui.Hn>
              <div className='mt-2 grid grid-cols-1 @sm:grid-cols-2 gap-4 @lg:grid-cols-3'>
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className='group text-sm border rounded-md p-4 hover:border-primary transition-colors duration-300 ease-in-out'
                  >
                    <div className='relative'>
                      <Ui.Hn level={baseLevel + 2} className='font-medium flex items-center min-h-7 mr-8'>
                        {placeholder(address.label, _("address-untitled"))} ({_(address.type)})
                      </Ui.Hn>
                      <Ui.CopyToClipboardButton
                        value={trimSpaces(`${address.street} ${address.postalCode} ${address.city} ${address.country}`)}
                        size='xs'
                        variant='ghost'
                        className='absolute right-0 top-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity'
                      />
                    </div>
                    <a
                      href={makeGoogleMapUrl({
                        address: address.street,
                        city: address.city,
                        zip: address.postalCode,
                        country: address.country,
                      })}
                      rel='nofollow noopener noreferrer'
                      target='_blank'
                      className='text-muted-foreground leading-tight flex flex-col gap-1'
                    >
                      {address.street}
                      <span>
                        {address.postalCode} {address.city}
                      </span>
                      {address.country && <span>{address.country}</span>}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Contact Information",
    description: "Contact details of the organisation",
    emails: "Emails",
    phones: "Phones",
    addresses: "Addresses",
    extras: "Additional Information",
    "email-untitled": "Email",
    "phone-untitled": "Phone",
    "extra-untitled": "Info",
    "address-untitled": "Address",
    // Address types
    physical: "Physical",
    postal: "Postal",
  },
  fr: {
    title: "Informations de contact",
    description: "Coordonnées de l'organisation",
    emails: "Emails",
    phones: "Téléphones",
    addresses: "Adresses",
    extras: "Informations supplémentaires",
    "email-untitled": "Email",
    "phone-untitled": "Téléphone",
    "extra-untitled": "Info",
    "address-untitled": "Adresse",
    // Address types
    physical: "Physique",
    postal: "Postale",
  },
  de: {
    title: "Kontaktinformationen",
    description: "Kontaktdaten der Organisation",
    emails: "E-Mails",
    phones: "Telefonnummern",
    addresses: "Adressen",
    extras: "Zusätzliche Informationen",
    "email-untitled": "E-Mail",
    "phone-untitled": "Telefon",
    "extra-untitled": "Info",
    "address-untitled": "Adresse",
    // Address types
    physical: "Physisch",
    postal: "Postal",
  },
}
