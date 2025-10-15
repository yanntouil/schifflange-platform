import { Api, service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import { getInitials, makeColorsFromString, placeholder, S } from "@compo/utils"
import { UserIcon } from "lucide-react"
import React from "react"

/**
 * UserAvatar
 */
type UserAvatarProps = {
  user: Api.User
  rounded?: boolean
  size?: string
  className?: string
  classNames?: {
    root?: string
    image?: string
    fallback?: string
  }
}
export const UserAvatar = React.forwardRef<Icon.UserHandle, UserAvatarProps>(
  ({ user, rounded = false, size = "size-8", className, classNames }, ref) => {
    const { _ } = useTranslation(dictionary)
    const profile: Option<Api.UserProfile> = user.profile // sometimes the profile is not loaded at first
    const firstname = profile?.firstname ?? ""
    const lastname = profile?.lastname ?? ""
    const fullName = placeholder(`${firstname} ${lastname}`, _("unnamed-user"))

    const initials = getInitials(firstname, lastname, 4)
    const initialsClass = match(initials.length)
      .with(3, () => "text-xs")
      .with(4, () => "text-[10px]")
      .otherwise(() => "text-sm")
    const imageFallback = S.isNotEmpty(initials) ? <span className={initialsClass}>{initials}</span> : <UserIcon aria-hidden />

    const { scheme } = Ui.useTheme()
    const colors = makeColorsFromString(user.id)
    const style = {
      "--avatar-color-1": scheme === "dark" ? colors[1] : colors[0],
      "--avatar-color-2": scheme === "dark" ? colors[0] : colors[1],
    } as React.CSSProperties

    const url = service.getImageUrl(profile?.image, "thumbnail") ?? ""

    return (
      <Ui.Avatar.Root
        className={cxm(
          "text-[var(--avatar-color-2)] transition-[height,width] [&_svg]:size-3.5 [&_svg]:transition-[height,width]",
          size,
          rounded ? "rounded-full" : "rounded-sm",
          classNames?.root,
          className
        )}
        style={style}
      >
        <Ui.Avatar.Image src={url} alt={fullName} className={cxm("object-cover object-center", classNames?.image)} />
        <Ui.Avatar.Fallback className={cxm("bg-[var(--avatar-color-1)]", rounded ? "rounded-full" : "rounded-sm", classNames?.fallback)}>
          {imageFallback}
        </Ui.Avatar.Fallback>
      </Ui.Avatar.Root>
    )
  }
)
const dictionary = {
  fr: {
    "unnamed-user": "Utilisateur anonyme",
  },
  en: {
    "unnamed-user": "Anonymous user",
  },
  de: {
    "unnamed-user": "Anonymer Benutzer",
  },
}
