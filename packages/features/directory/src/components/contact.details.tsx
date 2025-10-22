import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { isNotEmptyString, stripHtml } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useContact } from "../contact.context"
import { useDirectoryService } from "../service.context"

/**
 * ContactDetails
 */
export const ContactDetails: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const ctx = useContact()
  const { contact } = ctx.swr
  const translated = translate(contact, servicePlaceholder.contact)
  const { getImageUrl } = useDirectoryService()
  const portraitImage = getImageUrl(contact.portraitImage, "thumbnail") ?? undefined
  const squareImage = getImageUrl(contact.squareImage, "thumbnail") ?? undefined
  const { description, biography } = translated
  const baseLevel = 2
  return (
    <Ui.CollapsibleCard.Root id={contact.id}>
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
            <div className='space-y-6'>
              {/* Description */}
              {isNotEmptyString(stripHtml(description)) && (
                <div>
                  <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                    {_("description-field")}
                  </Ui.Hn>
                  <div className='prose prose-sm dark:prose-invert' dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              )}

              {/* Biography */}
              {isNotEmptyString(stripHtml(biography)) && (
                <div>
                  <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                    {_("biography")}
                  </Ui.Hn>
                  <div className='prose prose-sm dark:prose-invert' dangerouslySetInnerHTML={{ __html: biography }} />
                </div>
              )}
            </div>
            <div className='space-y-6'>
              {/* Political Party */}
              {contact.politicalParty && (
                <div>
                  <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                    {_("politicalParty")}
                  </Ui.Hn>
                  <p className='mt-1 text-base'>{contact.politicalParty}</p>
                </div>
              )}

              {/* Images */}
              <div className='flex gap-4'>
                {squareImage && (
                  <div>
                    <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground mb-2'>
                      {_("squareImage")}
                    </Ui.Hn>
                    <Ui.Image
                      src={squareImage}
                      alt={_("squareImage")}
                      className='aspect-square rounded-md object-cover object-center max-w-40'
                    />
                  </div>
                )}
                {portraitImage && (
                  <div>
                    <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground mb-2'>
                      {_("portraitImage")}
                    </Ui.Hn>
                    <Ui.Image
                      src={portraitImage}
                      alt={_("portraitImage")}
                      className='aspect-[3/4] rounded-md object-cover object-center max-w-32'
                    />
                  </div>
                )}
              </div>
            </div>
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
    title: "Metadata",
    description: "Metadata of the contact",
    "description-field": "Description",
    biography: "Biography",
    politicalParty: "Political Party",
    squareImage: "Square Image",
    portraitImage: "Portrait Image",
  },
  fr: {
    title: "Métadonnées",
    description: "Métadonnées du contact",
    "description-field": "Description",
    biography: "Biographie",
    politicalParty: "Parti politique",
    squareImage: "Image carrée",
    portraitImage: "Image portrait",
  },
  de: {
    title: "Metadaten",
    description: "Metadaten des Kontakts",
    "description-field": "Beschreibung",
    biography: "Biografie",
    politicalParty: "Politische Partei",
    squareImage: "Quadratisches Bild",
    portraitImage: "Porträtbild",
  },
}
