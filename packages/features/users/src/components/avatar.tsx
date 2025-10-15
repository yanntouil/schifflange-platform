import { Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, getInitials, makeColorsFromString, placeholder } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"

/**
 * UserAvatar
 * display the avatar of the user
 */
export const UserAvatar: React.FC<{
  user: Api.User
  classNames?: { wrapper?: string; image?: string; fallback?: string }
  size?: string
  getImageUrl: Api.GetImageUrl
}> = ({ user, classNames, size = "size-8", getImageUrl }) => {
  const { _ } = useTranslation(dictionary)
  const { scheme } = Ui.useTheme()
  const { firstname, lastname, image } = user.profile
  const fullname = placeholder(`${firstname} ${lastname}`, _("fullname-placeholder"))
  const initials = getInitials(firstname, lastname)
  const [light, dark] = makeColorsFromString(fullname)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }

  const imageCx = cxm("rounded-full flex-none", size)
  return (
    <Ui.Image
      src={getImageUrl(image, "thumbnail") as string}
      classNames={{ wrapper: cxm(imageCx, classNames?.wrapper), image: cxm(imageCx, classNames?.image) }}
      alt={fullname}
    >
      <span
        className={cxm(imageCx, "flex items-center justify-center text-[10px] font-medium", classNames?.fallback)}
        style={style}
      >
        {initials}
      </span>
    </Ui.Image>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "fullname-placeholder": "Unnamed user",
  },
  fr: {
    "fullname-placeholder": "Utilisateur sans nom",
  },
  de: {
    "fullname-placeholder": "Unbenannter Benutzer",
  },
} satisfies Translation
