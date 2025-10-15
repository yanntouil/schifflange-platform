import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { BanIcon, ChevronsUpDown, TagIcon } from "lucide-react"
import React from "react"
import { useTagOptionsByType } from "../../hooks"
import { useProject } from "../../project.context"

/**
 * Project tag select
 */
export const TagSelect: React.FC<{ className?: string }> = ({ className }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { updateTag, swr } = useProject()
  const tag = swr.project.tag
  const translatedTag = tag ? translate(tag, servicePlaceholder.projectTag) : null
  const [tagOptionsByType, noneOption] = useTagOptionsByType(true)
  const trigger = translatedTag
    ? {
        title: placeholder(translatedTag.name, _("untitled-tag")),
        icon: <TagIcon className='text-muted-foreground size-4' aria-hidden />,
      }
    : {
        title: noneOption.label,
        icon: <BanIcon className='text-muted-foreground size-4' aria-hidden />,
      }
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button variant='ghost' className={className}>
          {/* <Ui.Image className='bg-muted size-5 shrink-0 rounded'>{trigger.icon}</Ui.Image> */}
          {trigger.title}
          <ChevronsUpDown className='text-muted-foreground !size-3.5' aria-hidden />
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content className='min-w-48' align='start' side='bottom'>
        <Ui.DropdownMenu.Item active={!tag} onClick={() => updateTag(null)}>
          <Ui.Image className='bg-muted size-5 shrink-0 rounded-md'>
            <BanIcon className='text-muted-foreground size-4' aria-hidden />
          </Ui.Image>
          {noneOption.label}
        </Ui.DropdownMenu.Item>
        {A.map(D.toPairs(tagOptionsByType), ([type, options]) => (
          <Ui.DropdownMenu.Group key={type}>
            <Ui.DropdownMenu.Separator />
            <Ui.DropdownMenu.Label>{_(`tag-type-${type}`)}</Ui.DropdownMenu.Label>
            {A.map(options, (option) => (
              <Ui.DropdownMenu.Item
                key={option.value}
                onClick={() => updateTag(option.value)}
                active={option.value === tag?.id}
              >
                <Ui.Image className='bg-muted size-5 shrink-0 rounded'>
                  <TagIcon className='text-muted-foreground size-4' aria-hidden />
                </Ui.Image>
                {option.label}
              </Ui.DropdownMenu.Item>
            ))}
          </Ui.DropdownMenu.Group>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}
/**
 * translations
 */
const dictionary = {
  en: {
    placeholder: "Untitled tag",
    "tag-type-non-formal-education": "Non-formal education",
    "tag-type-child-family-services": "Child and family services",
  },
  fr: {
    placeholder: "Tag sans titre",
    "tag-type-non-formal-education": "Éducation non formelle",
    "tag-type-child-family-services": "Services pour enfants et familles",
  },
  de: {
    placeholder: "Tag ohne Titel",
    "tag-type-non-formal-education": "Nicht-formale Bildung",
    "tag-type-child-family-services": "Kinder- und Familienleistungen",
  },
}
