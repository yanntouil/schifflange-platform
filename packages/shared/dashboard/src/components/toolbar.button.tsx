import { Ui } from "@compo/ui"
import { MatchableSize } from "@compo/utils"
import React from "react"
import { useToolbar } from "./toolbar.context"

/**
 * Toolbar button
 */
type ToolbarButtonProps = React.ComponentPropsWithoutRef<typeof Ui.Button> & {
  size?: MatchableSize
  tooltip?: string
  side?: Ui.Tooltip.Side
  align?: Ui.Tooltip.Align
}
const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>((props, ref) => {
  const { size: toolbarSize } = useToolbar()
  const { size = toolbarSize, className, tooltip, side = "left", align = "center", icon, children, ...rest } = props
  if (tooltip) {
    return (
      <Ui.Tooltip.Quick asChild tooltip={tooltip} side={side} align={align}>
        <Ui.Button
          {...rest}
          size={size}
          data-slot='dashboard-toolbar-button'
          icon={icon}
          ref={ref}
          className={className}
        >
          {children}
          {icon === true && <Ui.SrOnly>{tooltip}</Ui.SrOnly>}
        </Ui.Button>
      </Ui.Tooltip.Quick>
    )
  }
  return <Ui.Button {...props} size={size} data-slot='dashboard-toolbar-button' ref={ref} className={className} />
})

export { ToolbarButton as Button }
