import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Lock } from "lucide-react"
import React from "react"
import { usePage } from "../page.context"
import { usePagesService } from "../service.context"

/**
 * LockButton
 */
export const LockButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr } = usePage()
  const isLocked = swr.page.lock
  const { isAdmin } = usePagesService()
  if (!isLocked) return null
  return (
    <Ui.Tooltip.Quick tooltip={_("page-locked")} side='left' asChild>
      <Ui.Button variant='ghost' icon size='xs'>
        <Lock aria-hidden />
        <Ui.SrOnly>{_("page-locked")}</Ui.SrOnly>
      </Ui.Button>
    </Ui.Tooltip.Quick>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "page-locked": "Cette page est verrouillée, demandez à un administrateur de la page pour la déverrouiller",
  },
  en: {
    "page-locked": "This page is locked, ask an administrator of the page to unlock it",
  },
  de: {
    "page-locked": "Diese Seite ist gesperrt, bitten Sie einen Administrator der Seite, sie zu entsperren",
  },
}
