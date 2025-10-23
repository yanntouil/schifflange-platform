import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { getInitials, isNotEmptyString, makeColorsFromString, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { useLibrary } from "../library.context"
import { LibraryMenu } from "./library.menu"

/**
 * LibraryHeader
 * Component that displays a library header
 */
export const LibraryHeader: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()

  const { scheme } = Ui.useTheme()

  const { swr } = useLibrary()
  const { library } = swr

  const translated = translate(library, servicePlaceholder.library)
  const title = placeholder(translated.title, _("title-placeholder"))

  const [light, dark] = makeColorsFromString(title)
  const initials = getInitials(title, "", 3)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }

  return (
    <Dashboard.Header>
      <div className='flex justify-between gap-2'>
        <div className='flex items-start gap-4'>
          <span
            className='rounded-sm flex-none size-8 fit-contain border-muted-forground flex items-center justify-center text-[10px] font-medium'
            style={style}
          >
            {initials}
          </span>
          <div className='space-y-0.5'>
            <Dashboard.Title level={1}>{title}</Dashboard.Title>
            {isNotEmptyString(translated.description) && (
              <Dashboard.Description>{translated.description}</Dashboard.Description>
            )}
          </div>
        </div>
        <Ui.DropdownMenu.Quick menu={<LibraryMenu />} className='min-w-[16rem]'>
          <Ui.Tooltip.Quick tooltip={_("menu-tooltip")} side='left' asChild>
            <Ui.Button variant='ghost' icon size='sm'>
              <MoreHorizontal aria-hidden />
              <Ui.SrOnly>{_("menu-tooltip")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>
        </Ui.DropdownMenu.Quick>
      </div>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Library",
    "title-placeholder": "Untitled library",
    "menu-tooltip": "Library menu",
  },
  fr: {
    title: "Bibliothèque",
    "title-placeholder": "Bibliothèque sans titre",
    "menu-tooltip": "Menu de la bibliothèque",
  },
  de: {
    title: "Bibliothek",
    "title-placeholder": "Bibliothek ohne Name",
    "menu-tooltip": "Bibliotheksmenü",
  },
}
