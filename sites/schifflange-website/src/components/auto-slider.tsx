import { cn } from "@/lib/utils"
import { Primitives } from "@compo/primitives"
import { useRef } from "react"
import { useDraggable } from "react-use-draggable-scroll"

export const Viewport: React.FC<React.ComponentProps<"div"> & { asChild?: boolean }> = (props) => {
  const { asChild, ...elProps } = props

  const Comp = asChild ? Primitives.Slot : "div"

  const viewportRef = useRef<HTMLDivElement>(null)
  const { events } = useDraggable(viewportRef as React.MutableRefObject<HTMLDivElement>, {
    applyRubberBandEffect: true,
  })

  return (
    <Comp
      {...elProps}
      {...events}
      ref={viewportRef}
      className={cn(
        "-my-1 min-w-0 overflow-x-auto overflow-y-hidden py-1 scrollbar-none [&>*]:shrink-0",
        elProps.className
      )}
    />
  )
}
