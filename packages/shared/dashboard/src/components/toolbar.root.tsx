import { MatchableSize, cxm } from "@compo/utils"
import React from "react"
import { ToolbarContext } from "./toolbar.context"

/**
 * Toolbar root
 */
type ToolbarRootProps = React.ComponentPropsWithoutRef<"div"> & {
  size?: MatchableSize
}
const ToolbarRoot: React.FC<ToolbarRootProps> = ({ size = "default", className, ...props }) => {
  return (
    <ToolbarContext.Provider value={{ size }}>
      <div className='group/toolbar @container/toolbar grid grid-cols-1'>
        <div
          className={cxm(
            "flex w-full flex-wrap @2xl/dashboard:flex-nowrap",
            "gap-x-4 gap-y-2 @3xl/toolbar:gap-x-4 @3xl/toolbar:gap-y-3",
            // gapVariants({ size }),
            className
          )}
          data-size={size}
          {...props}
          data-slot='dashboard-toolbar-root'
        />
      </div>
    </ToolbarContext.Provider>
  )
}

export { ToolbarRoot as Root }
