import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, isNotEmptyString, stripHtml } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useOrganisation } from "../organisation.context"
import { useDirectoryService } from "../service.context"

/**
 * OrganisationDetails
 */
export const OrganisationDetails: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const ctx = useOrganisation()
  const { organisation } = ctx.swr
  const translated = translate(organisation, servicePlaceholder.organisation)
  const { getImageUrl } = useDirectoryService()
  const logo = getImageUrl(organisation.logoImage, "thumbnail") ?? undefined
  const card = getImageUrl(organisation.cardImage, "thumbnail") ?? undefined
  const { description, shortDescription } = translated
  const { type, categories } = organisation
  const baseLevel = 2
  return (
    <Ui.CollapsibleCard.Root id={`${organisation.id}-details`} defaultOpen={false}>
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
            {/* Type */}
            <div>
              <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                {_("type")}
              </Ui.Hn>
              <p className='mt-1 text-base capitalize'>{_(type)}</p>
            </div>

            {/* Categories */}
            {A.isNotEmpty(categories) && (
              <div>
                <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                  {_("categories")}
                </Ui.Hn>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {categories.map((category) => (
                    <Ui.Badge key={category.id} variant='secondary'>
                      {translate(category, servicePlaceholder.organisationCategory).title}
                    </Ui.Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className='grid gap-6 @lg:grid-cols-2'>
            <div className='space-y-6'>
              {/* Short Description */}
              {isNotEmptyString(shortDescription) && (
                <div>
                  <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                    {_("shortDescription")}
                  </Ui.Hn>
                  <p className='mt-1 text-base'>{shortDescription}</p>
                </div>
              )}

              {/* Description */}
              {isNotEmptyString(stripHtml(description)) && (
                <div>
                  <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground'>
                    {_("description-field")}
                  </Ui.Hn>
                  <div className='prose prose-sm dark:prose-invert' dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              )}
            </div>
            <div className='space-y-6'>
              {logo && (
                <div>
                  <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground mb-2'>
                    {_("logo")}
                  </Ui.Hn>
                  <Ui.Image
                    src={logo}
                    alt={_("logo")}
                    className='aspect-square rounded-md object-contain object-center max-w-40'
                  />
                </div>
              )}
              {card && (
                <div className='@md:col-span-2'>
                  <Ui.Hn level={baseLevel + 1} className='text-sm font-medium text-muted-foreground mb-2'>
                    {_("card")}
                  </Ui.Hn>
                  <Ui.Image src={card} alt={_("card")} className='aspect-video rounded-md object-cover object-center' />
                </div>
              )}
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
    description: "Metadata of the organisation",
    shortDescription: "Short Description",
    "description-field": "Description",
    type: "Type",
    categories: "Categories",
    logo: "Logo",
    card: "Card Image",
    // Organisation types
    municipality: "Municipality",
    service: "Service",
    association: "Association",
    commission: "Commission",
    company: "Company",
    other: "Other (undefined)",
  },
  fr: {
    title: "Métadonnées",
    description: "Métadonnées de l'organisation",
    shortDescription: "Description courte",
    "description-field": "Description",
    type: "Type",
    categories: "Catégories",
    logo: "Logo",
    card: "Image de carte",
    // Organisation types
    municipality: "Commune",
    service: "Service communal",
    association: "Association",
    commission: "Commission",
    company: "Entreprise",
    other: "Autre (non défini)",
  },
  de: {
    title: "Metadaten",
    description: "Metadaten der Organisation",
    shortDescription: "Kurzbeschreibung",
    "description-field": "Beschreibung",
    type: "Typ",
    categories: "Kategorien",
    logo: "Logo",
    card: "Kartenbild",
    // Organisation types
    municipality: "Gemeinde",
    service: "Dienst",
    association: "Verein",
    commission: "Kommission",
    company: "Unternehmen",
    other: "Andere (undefiniert)",
  },
}
