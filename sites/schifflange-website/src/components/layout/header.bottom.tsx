import { LocalizeLanguage } from "@/lib/localize"
import { Api } from "@/service"
import { getServerTranslation } from "@/utils/localize"
import { cn } from "@compo/utils"
import { AccessibilityDialog } from "../dialogs/accessibility"
import { itemVariants } from "./header.variants"
import { AccessibilitySvg, SignInArrowSvg } from "./icons"
import { Languages } from "./languages"

/**
 * header
 * the header of the page
 */
type HeaderProps = {
  lang: LocalizeLanguage
  menu: Api.MenuItemWithRelations[]
}
export const HeaderBottom = ({ lang }: HeaderProps) => {
  const { _ } = getServerTranslation(lang, dictionary)

  return (
    <div className='flex flex-col gap-2'>
      <div className='w-full inline-flex gap-2'>
        <AccessibilityDialog>
          <button className={cn(itemVariants({ scheme: "accessibility" }), "w-[50px] px-0 justify-center shrink-0")}>
            <AccessibilitySvg aria-label={_("accessibility")} className='size-[21px]' />
          </button>
        </AccessibilityDialog>
        <Languages />
      </div>
      <a
        className={cn(itemVariants(), "px-0 justify-center")}
        href='#'
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        {_(`platform`)}
      </a>
      <a
        className={cn(itemVariants({ scheme: "highlight" }), "px-0 justify-center")}
        href='#'
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        {_(`sign-in`)}
        <SignInArrowSvg aria-hidden className='size-[19px]' />
      </a>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    accessibility: "Accessibilité",
    "language-fr": "Français",
    "language-en": "Anglais",
    platform: "Espace interactif",
    "sign-in": "Inscription",
  },
  en: {
    accessibility: "Accessibility",
    "language-fr": "French",
    "language-en": "English",
    platform: "Interactive space",
    "sign-in": "Sign in",
  },
  de: {
    accessibility: "Zugänglichkeit",
    "language-fr": "Französisch",
    "language-en": "Englisch",
    platform: "Interaktiver Raum",
    "sign-in": "Anmelden",
  },
}
