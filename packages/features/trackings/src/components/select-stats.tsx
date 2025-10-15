import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, capitalize, cxm, match } from "@compo/utils"
import { AppWindow, Earth, Eye, MonitorSmartphone, Mouse, Search } from "lucide-react"
import React from "react"
import { StatsName, StatsProps } from "../types"

/**
 * SelectStats
 */
type Props = {
  stats: StatsName
  setStats: (stats: StatsName) => void
  display?: StatsProps["display"]
} & React.ComponentProps<typeof Ui.Button>
export const SelectStats: React.FC<Props> = ({ stats, setStats, className, display = "visits", ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button
          {...props}
          aria-label={props["aria-label"] ?? _("tooltip")}
          variant={props.variant ?? "outline"}
          size={props.size ?? "sm"}
          className={cxm(className)}
        >
          <StatsIcon stats={stats} display={display} />
          <span className='line-clamp-1'>{capitalize(_(`stats.${stats === "visit" ? display : stats}`))}</span>
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content align='end'>
        {A.map(typeOfStats, (item) => (
          <Ui.DropdownMenu.Item key={item} onClick={() => setStats(item)} className='[&>svg]:shrink-0'>
            <StatsIcon stats={item} display={display} />
            {capitalize(_(`stats.${item === "visit" ? display : item}`))}
          </Ui.DropdownMenu.Item>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * icon dispatcher
 */
const StatsIcon: React.FC<{ stats: StatsName; display: NonNullable<Props["display"]> }> = ({ stats, display }) =>
  match(stats)
    .with("visit", () =>
      match(display)
        .with("clicks", () => <Mouse aria-hidden />)
        .with("views", () => <Eye aria-hidden />)
        .with("visits", () => <Search aria-hidden />)
        .exhaustive()
    )
    .with("os", () => <AppWindow aria-hidden />)
    .with("device", () => <MonitorSmartphone aria-hidden />)
    .with("browser", () => <Earth aria-hidden />)
    .exhaustive()

/**
 * translation
 */
const dictionary = {
  fr: {
    tooltip: "Sélectionner le type de statistiques à afficher",
    stats: {
      views: "vues",
      clicks: "clics",
      visits: "visites",
      os: "os",
      device: "types de périphériques",
      browser: "navigateurs",
    },
  },
  de: {
    tooltip: "Art der anzuzeigenden Statistiken auswählen",
    stats: {
      views: "Aufrufe",
      clicks: "Klicks",
      visits: "Besuche",
      os: "Betriebssystem",
      device: "Gerätetypen",
      browser: "Browser",
    },
  },
  en: {
    tooltip: "Select the type of statistics to display",
    stats: {
      views: "views",
      clicks: "clicks",
      visits: "visits",
      os: "os",
      device: "device types",
      browser: "browsers",
    },
  },
}
const typeOfStats: StatsName[] = ["visit", "os", "device", "browser"]
