import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, placeholder } from "@compo/utils"
import React from "react"
import { useContact } from "../contact.context"

/**
 * ContactContact
 */
export const ContactContact: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useContact()
  const { contact } = ctx.swr
  const { emails, phones, extras } = contact
  const baseLevel = 2
  return (
    <Ui.CollapsibleCard.Root id={`${contact.id}-contact`}>
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
                        <a
                          href={`tel:${phone.value}`}
                          className='text-primary hover:underline text-sm/[18px] pt-[5px]'
                        >
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
                <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
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
                          <a
                            href={`mailto:${value}`}
                            className='text-primary hover:underline text-sm/[18px] pt-[5px]'
                          >
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
    description: "Contact details",
    emails: "Emails",
    phones: "Phones",
    extras: "Additional Information",
    "email-untitled": "Email",
    "phone-untitled": "Phone",
    "extra-untitled": "Info",
  },
  fr: {
    title: "Informations de contact",
    description: "Coordonnées du contact",
    emails: "Emails",
    phones: "Téléphones",
    extras: "Informations supplémentaires",
    "email-untitled": "Email",
    "phone-untitled": "Téléphone",
    "extra-untitled": "Info",
  },
  de: {
    title: "Kontaktinformationen",
    description: "Kontaktdaten",
    emails: "E-Mails",
    phones: "Telefonnummern",
    extras: "Zusätzliche Informationen",
    "email-untitled": "E-Mail",
    "phone-untitled": "Telefon",
    "extra-untitled": "Info",
  },
}
