import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { Folders, Tag } from "lucide-react"
import React from "react"
import { useOrganisations } from "../organisations.context"
import { useDirectoryService } from "../service.context"
import { OrganisationsMenu } from "./organisations.menu"

/**
 * OrganisationsCard
 */
export const OrganisationsCard: React.FC<{ organisation: Api.Organisation }> = ({ organisation }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { getImageUrl } = useDirectoryService()
  const translatedOrganisation = translate(organisation, servicePlaceholder.organisation)
  const name = placeholder(translatedOrganisation.name, _("name"))
  const shortDescription = placeholder(translatedOrganisation.shortDescription, _("description"))
  const { selectable, displayOrganisation } = useOrganisations()
  const imageUrl = getImageUrl(organisation.cardImage, "preview")
  const categories = A.isNotEmpty(organisation.categories)
    ? A.map(organisation.categories, (category) =>
        placeholder(translate(category, servicePlaceholder.organisationCategory).title, _("untitled-category"))
      ).join(", ")
    : _("no-categories")
  return (
    <Dashboard.Card.Root
      key={organisation.id}
      menu={<OrganisationsMenu organisation={organisation} />}
      item={organisation}
      selectable={selectable}
      {...smartClick(organisation, selectable, () => displayOrganisation(organisation))}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined}>
        <Ui.ImageEmpty className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header className='grow'>
        <Dashboard.Card.Title>{name}</Dashboard.Card.Title>
        <Dashboard.Card.Description className='line-clamp-4'>{shortDescription}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content className='justify-end'>
        <Dashboard.Card.Field>
          <Tag aria-hidden />
          {_("type-label", { type: _(`type-${organisation.type}`) })}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field>
          <Folders aria-hidden />
          {_("categories-label", { categories })}
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
    name: "Name",
    description: "Description",
    "type-label": "Type: {{type}}",
    "type-municipality": "Municipality",
    "type-service": "Service",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Company",
    "type-other": "Other",
    "categories-label": "Categories: {{categories}}",
    "no-categories": "No categories",
    "untitled-category": "Untitled category",
  },
  fr: {
    name: "Nom",
    description: "Description",
    "type-label": "Type: {{type}}",
    "type-municipality": "Commune",
    "type-service": "Service communal",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Entreprise",
    "type-other": "Autre",
    "categories-label": "Catégories: {{categories}}",
    "no-categories": "Aucune catégorie",
    "untitled-category": "Catégorie sans titre",
  },
  de: {
    name: "Name",
    description: "Description",
    "type-label": "Typ: {{type}}",
    "type-municipality": "Gemeinde",
    "type-service": "Dienst",
    "type-association": "Verein",
    "type-commission": "Kommission",
    "type-company": "Unternehmen",
    "type-other": "Andere",
    "categories-label": "Kategorien: {{categories}}",
    "no-categories": "Keine Kategorien",
    "untitled-category": "Kategorie ohne Titel",
  },
}
