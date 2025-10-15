import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { BanIcon, ChevronsUpDown, FolderIcon } from "lucide-react"
import React from "react"
import { useProject } from "../../project.context"
import { useProjectsService } from "../../service.context"
import { useSwrCategories } from "../../swr"

/**
 * Project category select
 */
export const CategorySelect: React.FC<{ className?: string }> = ({ className }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { updateCategory, swr } = useProject()
  const category = swr.project.category
  const { categories } = useSwrCategories()

  const { getImageUrl } = useProjectsService()
  const translatedCategory = category ? translate(category, servicePlaceholder.projectCategory) : null
  const trigger = translatedCategory
    ? {
        title: placeholder(translatedCategory.title, _("untitled-category")),
        imageUrl: getImageUrl(translatedCategory.image, "thumbnail") ?? undefined,
        icon: <FolderIcon className='text-muted-foreground size-4' aria-hidden />,
      }
    : {
        title: _("no-category"),
        imageUrl: undefined,
        icon: <BanIcon className='text-muted-foreground size-4' aria-hidden />,
      }
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button variant='ghost' className={className}>
          {/* <Ui.Image src={trigger.imageUrl} className='bg-muted size-5 shrink-0 rounded'>
            {trigger.icon}
          </Ui.Image> */}
          {trigger.title}
          <ChevronsUpDown className='text-muted-foreground !size-3.5' aria-hidden />
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content className='min-w-48' align='start' side='bottom'>
        <Ui.DropdownMenu.Item active={!category} onClick={() => updateCategory(null)}>
          <Ui.Image className='bg-muted size-5 shrink-0 rounded-md'>
            <BanIcon className='text-muted-foreground size-4' aria-hidden />
          </Ui.Image>
          {_("no-category")}
        </Ui.DropdownMenu.Item>
        <Ui.DropdownMenu.Separator />
        {categories.map((option) => (
          <CategoryItem key={option.id} active={option.id === category?.id} category={option} />
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}
const CategoryItem: React.FC<{ active: boolean; category: Api.ProjectCategory }> = ({ active, category }) => {
  const { _ } = useTranslation(dictionary)
  const { getImageUrl } = useProjectsService()
  const { translate } = useContextualLanguage()
  const translatedCategory = translate(category, servicePlaceholder.projectCategory)
  const title = placeholder(translatedCategory.title, _("placeholder"))
  const imageUrl = getImageUrl(translatedCategory.image) ?? undefined
  const { updateCategory } = useProject()
  return (
    <Ui.DropdownMenu.Item key={category.id} onClick={() => updateCategory(category.id)} active={active}>
      <Ui.Image src={imageUrl} className='bg-muted size-5 shrink-0 rounded'>
        <FolderIcon className='text-muted-foreground size-4' aria-hidden />
      </Ui.Image>
      {title}
    </Ui.DropdownMenu.Item>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    placeholder: "Untitled category",
    "no-category": "No category",
  },
  fr: {
    placeholder: "Catégorie sans titre",
    "no-category": "Aucune catégorie",
  },
  de: {
    placeholder: "Kategorie ohne Titel",
    "no-category": "Keine Kategorie",
  },
}
