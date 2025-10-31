import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ChartColumnBig } from "lucide-react"
import React from "react"
import { useEvent } from "../event.context"

/**
 * StatsButton
 */
export const StatsButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { displayStats } = useEvent()
  return (
    <Ui.Tooltip.Quick tooltip={_("stats")} side='left' asChild>
      <Ui.Button variant='ghost' icon size='xs' onClick={() => displayStats()}>
        <ChartColumnBig aria-hidden />
        <Ui.SrOnly>{_("stats")}</Ui.SrOnly>
      </Ui.Button>
    </Ui.Tooltip.Quick>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    stats: "Stats",
  },
  fr: {
    stats: "Statistiques",
  },
  de: {
    stats: "Statistiken",
  },
}
