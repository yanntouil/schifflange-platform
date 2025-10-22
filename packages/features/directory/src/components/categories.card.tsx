import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { Tag } from "lucide-react"
import React from "react"
import { useCategories } from "../categories.context"
import { useDirectoryService } from "../service.context"
import { CategoriesMenu } from "./categories.menu"

/**
 * CategoriesCard
 */
export const CategoriesCard: React.FC<{ category: Api.OrganisationCategory }> = ({ category }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { getImageUrl } = useDirectoryService()
  const translatedCategory = translate(category, servicePlaceholder.organisationCategory)
  const title = placeholder(translatedCategory.title, _("title"))
  const description = placeholder(translatedCategory.description, _("description"))
  const { selectable } = useCategories()
  const imageUrl = getImageUrl(category.image, "preview")
  return (
    <Dashboard.Card.Root
      key={category.id}
      menu={<CategoriesMenu category={category} />}
      item={category}
      selectable={selectable}
      {...smartClick(category, selectable, () => {})}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined}>
        <Ui.ImageEmpty className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          <Tag aria-hidden />
          {_("type-label", { type: _(`type-${category.type}`) })}
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
    title: "Untitled",
    description: "No description",
    "type-label": "Type: {{type}}",
    "type-municipality": "Municipality",
    "type-service": "Service",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Company",
    "type-other": "Other",
  },
  fr: {
    title: "Sans titre",
    description: "Aucune description",
    "type-label": "Type: {{type}}",
    "type-municipality": "Commune",
    "type-service": "Service communal",
    "type-association": "Association",
    "type-commission": "Commission",
    "type-company": "Entreprise",
    "type-other": "Autre",
  },
  de: {
    title: "Ohne Titel",
    description: "Keine Beschreibung",
    "type-label": "Typ: {{type}}",
    "type-municipality": "Gemeinde",
    "type-service": "Dienst",
    "type-association": "Verein",
    "type-commission": "Kommission",
    "type-company": "Unternehmen",
    "type-other": "Andere",
  },
}
