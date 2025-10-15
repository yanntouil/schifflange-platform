import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, placeholder } from "@compo/utils"
import { Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Edit } from "lucide-react"
import React from "react"
import { useTemplate } from "../template.context"
import { MenuButton } from "./template.menu"
import { Thumbnail } from "./tumbnail"

/**
 * TemplateHeader
 * display the template header and actions to edit or delete the template
 */
export const TemplateHeader: React.FC<{ template: Api.TemplateWithRelations }> = ({ template }) => {
  const { _ } = useTranslation(dictionary)
  const { t, current, translate } = useContextualLanguage()
  const { editTemplate } = useTemplate()

  const translated = translate(template, servicePlaceholder.template)
  return (
    <Ui.CollapsibleCard.Root id={template.id}>
      <Ui.CollapsibleCard.Header>
        <Ui.CollapsibleCard.Title>{placeholder(translated.title, _("untitled"))}</Ui.CollapsibleCard.Title>
        <Ui.CollapsibleCard.Aside>
          <Ui.Tooltip.Quick tooltip={_("edit")} side='left' asChild>
            <Ui.Button variant='ghost' size='xs' icon onClick={editTemplate}>
              <Edit aria-hidden />
              <Ui.SrOnly>{_("edit")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>
          <MenuButton />
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container overflow-hidden'>
        <div className='flex flex-col-reverse flex-wrap gap-6 px-6 pb-6 @2xl:flex-row @2xl:flex-nowrap'>
          <div className='grid grow grid-rows-[auto_auto_1fr] space-y-4 pt-2'>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              {placeholder(translated.description, _("no-description"))}
            </p>
            <div className='flex flex-wrap gap-2'>
              {A.isNotEmpty(translated.tags) ? (
                A.mapWithIndex(translated.tags, (index, keyword) => (
                  <Ui.Badge key={index} variant='outline' lang={current.code}>
                    {keyword}
                  </Ui.Badge>
                ))
              ) : (
                <Ui.Badge variant='destructive-outline' className='text-muted-foreground text-sm leading-relaxed'>
                  {_("no-keywords", { language: t(current.code).toLowerCase() })}
                </Ui.Badge>
              )}
            </div>
          </div>
          <div className='aspect-video h-auto w-full @2xl:h-48 @2xl:w-auto'>
            <Thumbnail template={template} />
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
    untitled: "Untitled",
    "no-description": "No description",
    "no-keywords": "No keywords",
  },
  fr: {
    untitled: "Sans titre",
    "no-description": "Aucune description",
    "no-keywords": "Aucun mot-clé",
  },
  de: {
    untitled: "Unbenannt",
    "no-description": "Keine Beschreibung",
    noKeywords: "Keine Schlüsselwörter",
  },
}
