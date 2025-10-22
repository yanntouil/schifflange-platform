import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { cxm, getInitials, makeColorsFromString, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { useContact } from "../contact.context"
import { useDirectoryService } from "../service.context"
import { ContactMenu } from "./contact.menu"

/**
 * ContactHeader
 */
export const ContactHeader: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { scheme } = Ui.useTheme()
  const { swr } = useContact()
  const { contact } = swr
  const { getImageUrl } = useDirectoryService()
  const translated = translate(contact, servicePlaceholder.contact)
  const fullName = placeholder(`${contact.firstName} ${contact.lastName}`, _("name-placeholder"))
  const description = placeholder(translated.description, _("description-placeholder"))
  const [light, dark] = makeColorsFromString(fullName)
  const initials = getInitials(contact.firstName, contact.lastName, 2)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  const image = getImageUrl(contact.squareImage, "thumbnail")
  const imageCx = "rounded-sm flex-none size-8 fit-contain border-muted-forground"
  return (
    <Dashboard.Header>
      <div className='flex justify-between gap-2'>
        <div className='flex items-center gap-4'>
          {image ? (
            <Ui.Image src={image} classNames={{ wrapper: imageCx, image: imageCx }} alt={fullName}>
              <Ui.ImageEmpty />
            </Ui.Image>
          ) : (
            <span className={cxm(imageCx, "flex items-center justify-center text-[10px] font-medium")} style={style}>
              {initials}
            </span>
          )}
          <Dashboard.Title level={1}>{fullName}</Dashboard.Title>
        </div>
        <Ui.DropdownMenu.Quick menu={<ContactMenu />} className='min-w-[16rem]'>
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
    "name-placeholder": "Unnamed contact",
    "description-placeholder": "No description",
    "menu-tooltip": "Contact menu",
  },
  fr: {
    "name-placeholder": "Contact sans nom",
    "description-placeholder": "Aucune description",
    "menu-tooltip": "Menu du contact",
  },
  de: {
    "name-placeholder": "Unbenannter Kontakt",
    "description-placeholder": "Keine Beschreibung",
    "menu-tooltip": "Kontaktmenü",
  },
}
