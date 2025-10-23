import { useNow } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, T } from "@compo/utils"
import { ClockArrowDown, ClockArrowUp } from "lucide-react"
import React from "react"
import { usePublication } from "../publication.context"
import { isAvailable, wasAvailable, willBeAvailable } from "../utils"

/**
 * PublicationIcon
 * display the publication icon
 */
export const PublicationIcon: React.FC<React.ComponentProps<"span">> = ({ className, ...props }) => {
  const { _, formatDistance } = useTranslation(dictionary)
  const { publication } = usePublication()

  const now = useNow()
  const message = React.useMemo(() => {
    if (isAvailable(publication, now)) return _("now-available")
    if (wasAvailable(publication, now) && publication.publishedTo)
      return _("was-available", { distance: formatDistance(T.parseISO(publication.publishedTo), now) })
    if (willBeAvailable(publication, now) && publication.publishedFrom)
      return _("will-be-available", { distance: formatDistance(T.parseISO(publication.publishedFrom), now) })
    return ""
  }, [formatDistance, _, publication, now])

  return (
    <Ui.Tooltip.Quick tooltip={message} side='left' asChild>
      <span
        className={cxm("relative flex size-7 items-center justify-center p-0 [&_svg]:size-4", className)}
        {...props}
      >
        {isAvailable(publication, now) ? (
          <span
            className='flex items-center justify-center size-4 border border-foreground bg-card rounded-xs'
            aria-label={_("now-available")}
          >
            <span className='text-green-700 rounded-xs bg-green-700 size-2.5' aria-hidden />
          </span>
        ) : wasAvailable(publication, now) ? (
          <ClockArrowDown aria-label={_("was-available")} />
        ) : (
          <ClockArrowUp aria-label={_("will-be-available")} />
        )}
      </span>
    </Ui.Tooltip.Quick>
  )
}

const dictionary = {
  fr: {
    // Status messages
    "now-available": "Actuellement publié",
    "was-available": "Publication terminée {{distance}}",
    "will-be-available": "Sera publié {{distance}}",
  },
  en: {
    // Status messages
    "now-available": "Currently published",
    "was-available": "Publication ended {{distance}}",
    "will-be-available": "Will be published {{distance}}",
  },
  de: {
    // Status messages
    "now-available": "Derzeit veröffentlicht",
    "was-available": "Veröffentlichung endete {{distance}}",
    "will-be-available": "Wird veröffentlicht {{distance}}",
  },
}
