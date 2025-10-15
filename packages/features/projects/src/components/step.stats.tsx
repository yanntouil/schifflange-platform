import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ChartColumnBig } from "lucide-react"
import React from "react"
import { useStep } from "../step.context"

/**
 * StepStatsButton
 */
export const StepStatsButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { displayStats } = useStep()
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
