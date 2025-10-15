import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, capitalize, cx, match } from "@compo/utils"
import { ChartColumnBig, LifeBuoy, Radar } from "lucide-react"
import React from "react"
import { ChartTypeName } from "../types"

/**
 * SelectChartType
 */
type Props = {
  chartType: ChartTypeName
  setChartType: (chart: ChartTypeName) => void
  className?: string
} & React.ComponentProps<typeof Ui.Button>
export const SelectChartType: React.FC<Props> = ({ chartType, setChartType, className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button
          {...props}
          aria-label={props["aria-label"] ?? _("tooltip")}
          variant={props.variant ?? "outline"}
          size={props.size ?? "sm"}
          className={cx(className)}
        >
          <ChartTypeIcon chartType={chartType} />
          {_(`stats.${chartType}`)}
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content align='end'>
        {A.map(chartRange, (item) => (
          <Ui.DropdownMenu.Item key={item} onClick={() => setChartType(item)}>
            <ChartTypeIcon chartType={item} />
            {capitalize(_(`stats.${item}`))}
          </Ui.DropdownMenu.Item>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * ChartTypeIcon
 * dispatch chart type icon
 */
const ChartTypeIcon: React.FC<{ chartType: ChartTypeName }> = ({ chartType }) =>
  match(chartType)
    .with("donut", () => <LifeBuoy />)
    .with("bar", () => <ChartColumnBig />)
    .with("radial", () => <Radar />)
    .exhaustive()

/**
 * constants
 */
const chartRange: ChartTypeName[] = ["donut", "bar", "radial"]

/**
 * translation
 */
const dictionary = {
  fr: {
    tooltip: "Sélectionnez le type de graphique à afficher",
    stats: {
      donut: "Graphique en donut",
      bar: "Graphique en barres",
      radial: "Graphique radial",
    },
  },
  de: {
    tooltip: "Wählen Sie den Diagrammtyp für die Statistik-Anzeige",
    stats: {
      donut: "Donut-Diagramm",
      bar: "Balkendiagramm",
      radial: "Radialdiagramm",
    },
  },
  en: {
    tooltip: "Select the type of chart to display the statistics",
    stats: {
      donut: "Donut chart",
      bar: "Bar chart",
      radial: "Radial chart",
    },
  },
}
