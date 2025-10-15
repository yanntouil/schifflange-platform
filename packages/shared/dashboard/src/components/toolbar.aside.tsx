import { cxm, MatchableSize } from "@compo/utils"
import React from "react"
import { useToolbar } from "./toolbar.context"

/**
 * Toolbar aside
 */
type ToolbarAsideProps = React.ComponentPropsWithoutRef<"div"> & {
  size?: MatchableSize
}
const ToolbarAside: React.FC<ToolbarAsideProps> = ({ ...props }) => {
  const { size: toolbarSize } = useToolbar()
  const { size = toolbarSize, className, ...rest } = props

  return (
    <div
      className={cxm(
        "flex shrink-0 grow flex-wrap justify-end @2xl/toolbar:grow-0 @2xl/toolbar:justify-normal",
        "gap-x-4 gap-y-2 @3xl/toolbar:gap-x-4 @3xl/toolbar:gap-y-3",
        // gapVariants({ size }),
        className
      )}
      data-size={size}
      {...rest}
      data-slot='dashboard-toolbar-aside'
    />
  )
}

export { ToolbarAside as Aside }
