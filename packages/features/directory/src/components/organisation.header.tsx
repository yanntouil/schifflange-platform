import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { cxm, getInitials, makeColorsFromString, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { useOrganisation } from "../organisation.context"
import { useDirectoryService } from "../service.context"
import { OrganisationMenu } from "./organisation.menu"

/**
 * OrganisationHeader
 */
export const OrganisationHeader: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { scheme } = Ui.useTheme()
  const { swr } = useOrganisation()
  const { organisation } = swr
  const { getImageUrl } = useDirectoryService()
  const translated = translate(organisation, servicePlaceholder.organisation)
  const name = placeholder(translated.name, _("name-placeholder"))
  const shortDescription = placeholder(translated.shortDescription, _("description-placeholder"))
  const [light, dark] = makeColorsFromString(name)
  const initials = getInitials(name, "", 2)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  const image = getImageUrl(organisation.logoImage, "thumbnail")
  const imageCx = "rounded-sm flex-none size-8 fit-contain border-muted-forground"
  return (
    <Dashboard.Header>
      <div className='flex justify-between gap-2'>
        <div className='flex items-center gap-4'>
          {image ? (
            <Ui.Image src={image} classNames={{ wrapper: imageCx, image: imageCx }} alt={name}>
              <Ui.ImageEmpty />
            </Ui.Image>
          ) : (
            <span className={cxm(imageCx, "flex items-center justify-center text-[10px] font-medium")} style={style}>
              {initials}
            </span>
          )}
          <Dashboard.Title level={1}>{name}</Dashboard.Title>
        </div>
        <Ui.DropdownMenu.Quick menu={<OrganisationMenu />} className='min-w-[16rem]'>
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
    "name-placeholder": "Unnamed organisation",
    "description-placeholder": "No description",
    "menu-tooltip": "Organisation menu",
  },
  fr: {
    "name-placeholder": "Organisation sans nom",
    "description-placeholder": "Aucune description",
    "menu-tooltip": "Menu de l'organisation",
  },
  de: {
    "name-placeholder": "Unbenannte Organisation",
    "description-placeholder": "Keine Beschreibung",
    "menu-tooltip": "Organisationsmenü",
  },
}
