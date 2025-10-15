import React from "react"
import HeightTransition, { Height } from "react-animate-height"
import { cxm } from "@compo/utils"
/**
 * AnimateHeight
 */
export const AnimateHeight = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    duration?: number
  }
>((props, ref) => {
  const { duration = 250 } = props

  const [height, setHeight] = React.useState<Height>("auto")
  const contentDiv = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const element = contentDiv.current as HTMLDivElement

    const resizeObserver = new ResizeObserver(() => {
      setHeight(element.clientHeight)
    })

    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <HeightTransition
      height={height}
      contentClassName='auto-content'
      contentRef={contentDiv}
      disableDisplayNone
      duration={duration}
      className={props.className}
    >
      <div className='flex w-full flex-col' ref={ref}>
        <div {...props} className={cxm("h-fit", props.className)}>
          {props.children}
        </div>
      </div>
    </HeightTransition>
  )
})
