import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { makeColorsFromString, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarIcon, CalendarSync } from "lucide-react"
import React from "react"
import { useCouncils } from "../councils.context"
import { CouncilsMenu } from "./councils.menu"

/**
 * CouncilsCard
 */
export const CouncilsCard: React.FC<{ council: Api.Council }> = ({ council }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const translatedCouncil = translate(council, servicePlaceholder.council)
  const { selectable, displayCouncil } = useCouncils()
  const date = T.parseISO(council.date)

  // display different color by month
  const { scheme } = Ui.useTheme()
  const month = format(date, "MMyy")
  const [light, dark] = makeColorsFromString(month)
  const colorStyle =
    scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }

  return (
    <Dashboard.Card.Root
      key={council.id}
      menu={<CouncilsMenu council={council} />}
      item={council}
      selectable={selectable}
      {...smartClick(council, selectable, () => displayCouncil(council))}
    >
      <Dashboard.Card.Image style={colorStyle}>
        <span className='text-muted-foreground font-extralight text-2xl' style={colorStyle}>
          {format(date, "dd / MM")}
        </span>
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{format(date, "PPP")}</Dashboard.Card.Title>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field
          tooltip={_("updated-at-tooltip", { date: format(T.parseISO(council.updatedAt), "PPPp") })}
        >
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(council.updatedAt)) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * CouncilsCardSkeleton
 */
export const CouncilsCardSkeleton: React.FC = () => {
  return (
    <Dashboard.Card.Root>
      <Dashboard.Card.Image className='animate-pulse'>
        <CalendarIcon className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>
          <Ui.Skeleton variant='text-lg' className='w-2/4' />
          <div>
            <Ui.Skeleton variant='text-sm' className='w-full' />
            <Ui.Skeleton variant='text-sm' className='w-3/4' />
          </div>
        </Dashboard.Card.Title>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Ui.Skeleton variant='text-sm' className='w-1/2' />
        <Ui.Skeleton variant='text-sm' className='w-3/4' />
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "no-agenda": "No agenda",
    "files-count": "{{count}} file",
    "files-count_other": "{{count}} files",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    "no-agenda": "Pas d'ordre du jour",
    "files-count": "{{count}} fichier",
    "files-count_other": "{{count}} fichiers",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    "no-agenda": "Keine Tagesordnung",
    "files-count": "{{count}} Datei",
    "files-count_other": "{{count}} Dateien",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
