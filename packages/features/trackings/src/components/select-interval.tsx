import { JollyUI } from "@compo/jollyui"
import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import React from "react"
import { DisplayByName, StatsInterval } from "../types"

/**
 * SelectInterval
 */
export const SelectInterval: React.FC<{
  displayBy: DisplayByName
  interval: StatsInterval
  setInterval: (interval: StatsInterval) => void
}> = ({ displayBy, interval, setInterval }) => {
  const { _ } = useTranslation(dictionary)
  const jollyInterval = {
    start: interval.from,
    end: interval.to,
  }
  const setJollyInterval = (range: { start: Date | undefined; end: Date | undefined } | undefined) => {
    setInterval({
      from: range?.start,
      to: range?.end,
    })
  }
  if (A.includes(["months", "years"], displayBy)) {
    return (
      <JollyUI.DateRangePicker
        value={jollyInterval}
        onValueChange={setJollyInterval}
        aria-label={_("label")}
        size='sm'
      />
    )
  }
  if (displayBy === "hours") {
    return (
      <JollyUI.DatePicker
        value={interval.to}
        onValueChange={(v) => setInterval({ ...interval, to: v ?? undefined })}
        aria-label={_("to")}
        size='sm'
      />
    )
  }
  return (
    <>
      <JollyUI.DatePicker
        value={interval.from}
        onValueChange={(v) => setInterval({ ...interval, from: v ?? undefined })}
        aria-label={_("from")}
        size='sm'
      />
      <JollyUI.DatePicker
        value={interval.to}
        onValueChange={(v) => setInterval({ ...interval, to: v ?? undefined })}
        aria-label={_("to")}
        size='sm'
      />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    label: "Sélectionner une période",
    from: "Sélectionner le mois de",
    to: "Sélectionner une date",
  },
  de: {
    label: "Datumsbereich auswählen",
    from: "Monat von auswählen",
    to: "Datum auswählen",
  },
  en: {
    label: "Select date range",
    from: "Select month from",
    to: "Select month until",
  },
}
