import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, delay } from "@compo/utils"
import { VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { LayoutGrid, Rows4 } from "lucide-react"
import React from "react"
import { CollectionViewType } from "./collection"
import { useToolbar } from "./toolbar.context"
import { viewItemVariants, viewVariants } from "./toolbar.variants"

/**
 * View toggle for collections
 */
export type ToolbarViewProps = {
  view: CollectionViewType
  setView: (view: CollectionViewType) => void
  size?: VariantProps<typeof viewVariants>["size"]
}
const ToolbarView: React.FC<ToolbarViewProps> = ({ ...props }) => {
  const layoutId = React.useId()
  const { _ } = useTranslation(dictionary)
  const { size: toolbarSize } = useToolbar()
  const { view, setView, size = toolbarSize, ...rest } = props
  const id = React.useId()

  const [startAnimate, setStartAnimate] = React.useState(false)
  // delay the first animation to avoid flickering when the view is changed
  React.useEffect(() => {
    delay(600).then(() => setStartAnimate(true))
  }, [])
  return (
    <Ui.ToggleGroup.Root
      type='single'
      onValueChange={(value) => setView((value || view) === "card" ? "card" : "row")}
      className={viewVariants({ size })}
      value={view}
      id={id}
      data-slot='dashboard-toolbar-view'
    >
      <Ui.Tooltip.Quick tooltip={_("card")} asChild>
        <Ui.ToggleGroup.Item value='card' data-selected={view === "card"} className={viewItemVariants({ size })}>
          {view === "card" && (
            <motion.div
              layoutId={layoutId}
              transition={{ type: "spring", bounce: 0.3, duration: startAnimate ? 0.6 : 0 }}
              className={cxm("bg-primary absolute inset-0 rounded-md")}
            />
          )}
          <LayoutGrid aria-hidden className='relative' />
          <Ui.SrOnly>{_("card")}</Ui.SrOnly>
        </Ui.ToggleGroup.Item>
      </Ui.Tooltip.Quick>
      <Ui.Tooltip.Quick tooltip={_("row")} asChild>
        <Ui.ToggleGroup.Item value='row' data-selected={view === "row"} className={viewItemVariants({ size })}>
          {view === "row" && (
            <motion.div
              layoutId={layoutId}
              transition={{ type: "spring", bounce: 0.3, duration: startAnimate ? 0.6 : 0 }}
              className={cxm("bg-primary absolute inset-0 rounded-md")}
            />
          )}
          <Rows4 aria-hidden className='relative' />
          <Ui.SrOnly>{_("row")}</Ui.SrOnly>
        </Ui.ToggleGroup.Item>
      </Ui.Tooltip.Quick>
    </Ui.ToggleGroup.Root>
  )
}
export { ToolbarView as View }

/**
 * translations
 */
const dictionary = {
  fr: {
    card: "Affichage en carte",
    row: "Affichage en liste",
  },
  en: {
    card: "Card view",
    row: "List view",
  },
  de: {
    card: "Kartenansicht",
    row: "Listeansicht",
  },
}
