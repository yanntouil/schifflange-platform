import { Translation, useTranslation } from "@compo/localize"
import { Primitives, Ui } from "@compo/ui"
import { cxm, everyAreNotEmpty, makeColorsFromString, oneIsNotEmpty, placeholder, type Option } from "@compo/utils"
import { useDashboardService, type Api } from "@services/dashboard"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { User2 } from "lucide-react"
import React from "react"

/**
 * UserTooltip
 */
type Props = React.ComponentPropsWithoutRef<typeof Ui.Tooltip.Root> & {
  user?: Option<Api.User>
  children?: React.ReactNode
  displayUsername?: boolean
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}
export const UserTooltip = React.forwardRef<HTMLSpanElement, Props>(
  ({ user, children, displayUsername = true, onClick, ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    const { service } = useDashboardService()
    const springConfig = { stiffness: 100, damping: 5 }
    const x = useMotionValue(0) // going to set this value on mouse move
    // rotate the tooltip
    const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
    // translate the tooltip
    const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)
    const handleMouseMove: React.MouseEventHandler<HTMLSpanElement> = (event) => {
      const halfWidth = event.currentTarget.offsetWidth / 2
      x.set(event.nativeEvent.offsetX - halfWidth) // set the x value, which is then used in transform and rotate
    }

    const { scheme } = Ui.useTheme()

    const fullName = user
      ? placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("user-anonymous"))
      : _("user-unknown")
    const colors = makeColorsFromString(user?.id)
    const style = {
      "--avatar-color-1": scheme === "dark" ? colors[1] : colors[0],
      "--avatar-color-2": scheme === "dark" ? colors[0] : colors[1],
    } as React.CSSProperties
    const url = service.getImageUrl(user?.profile.image, "preview") ?? ""
    return (
      <Ui.Tooltip.Root>
        <Ui.Tooltip.Trigger className={cxm("inline-flex items-center gap-1")} onClick={onClick}>
          <Ui.Avatar.Root
            className={cxm("size-5 rounded-full text-[var(--avatar-color-2)] [&_svg]:size-3")}
            style={style}
            onMouseMove={handleMouseMove}
          >
            <Ui.Avatar.Image src={url} alt={fullName} />
            <Ui.Avatar.Fallback className={cxm("rounded-full bg-[var(--avatar-color-1)]")}>
              <User2 aria-hidden />
            </Ui.Avatar.Fallback>
          </Ui.Avatar.Root>
          {displayUsername && fullName}
        </Ui.Tooltip.Trigger>
        <Primitives.Tooltip.Portal>
          <AnimatePresence mode='popLayout'>
            <Primitives.Tooltip.Content className='relative' align='center' side='top'>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className='relative flex flex-col items-center justify-center rounded-md bg-black/80 px-4 py-2 text-xs shadow-xl'
              >
                <div
                  className='absolute inset-x-10 right-1/5 -bottom-px h-0.5 w-2/5 bg-gradient-to-r from-transparent via-red-500 to-transparent'
                  aria-hidden
                />
                <div
                  className='absolute -bottom-px left-1/5 h-0.5 w-2/5 bg-gradient-to-r from-transparent via-sky-500 to-transparent'
                  aria-hidden
                />
                <div className='relative z-30 text-sm font-medium text-white'>{fullName}</div>
                {user && oneIsNotEmpty(user.profile.position, user.profile.company) && (
                  <div className='text-xs text-white'>
                    {user.profile.position}
                    {everyAreNotEmpty(user.profile.position, user?.profile.company) ? " - " : " "}
                    {user.profile.company}
                  </div>
                )}
                {!!children && <div className='text-xs text-white'>{children}</div>}
              </motion.div>
            </Primitives.Tooltip.Content>
          </AnimatePresence>
        </Primitives.Tooltip.Portal>
      </Ui.Tooltip.Root>
    )
  }
)

/**
 * translations
 */

const dictionary = {
  fr: {
    "user-unknown": "Utilisateur inconnu",
    "user-anonymous": "Utilisateur anonyme",
  },
  en: {
    "user-unknown": "Unknown user",
    "user-anonymous": "Anonymous user",
  },
  de: {
    "user-unknown": "Unbekannter Benutzer",
    "user-anonymous": "Anonymer Benutzer",
  },
} satisfies Translation
