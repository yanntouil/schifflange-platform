import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { placeholder, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarSync } from "lucide-react"
import React from "react"
import { useTemplates } from "../templates.context"
import { TemplatesMenu } from "./templates.menu"
import { Thumbnail } from "./tumbnail"

/**
 * Card
 */
export const Card: React.FC<{ template: Api.TemplateWithRelations }> = ({ template }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)

  const { translate } = useLanguage()
  const translated = translate(template, servicePlaceholder.template)
  const { selectable, displayTemplate } = useTemplates()
  const title = placeholder(translated.title, _("untitled"))
  const description = placeholder(translated.description, _("no-description"))

  return (
    <Dashboard.Card.Root
      key={template.id}
      menu={<TemplatesMenu template={template} />}
      item={template}
      selectable={selectable}
      {...smartClick(template, selectable, () => displayTemplate(template))}
    >
      <Thumbnail template={template} />
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field
          tooltip={_("updated-at-tooltip", { date: format(T.parseISO(template.updatedAt), "PPPp") })}
        >
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(template.updatedAt)) })}
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
    untitled: "Untitled template",
    "no-description": "No description",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    untitled: "Template sans titre",
    "no-description": "Aucune description",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    untitled: "Unbenannte Template",
    "no-description": "Keine Beschreibung",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
