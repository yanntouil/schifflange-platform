import { Slot } from "@radix-ui/react-slot"
import React from "react"
import useMeasure from "react-use-measure"
import { ReactZoomPanPinchContentRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { TransformContext } from "./context"
import { TransformControlsProvider } from "./provider"

const defaultProps = {
  minScale: 0.5,
  maxScale: 5,
  transformThreshold: 1,
  steps: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
  displayControls: true,
  disableTransforms: false,
  setDisableTransforms: () => {},
}
/**
 * Transform
 */
export type TransformRootProps = React.ComponentProps<"div"> & {
  minScale?: number
  maxScale?: number
  displayControls?: boolean
  steps?: number[]
  isActive?: boolean
  transformThreshold?: number
  disableTransforms?: boolean
  setDisableTransforms?: (disabled: boolean) => void
}
export const TransformRoot: React.FC<TransformRootProps> = (props) => {
  const {
    minScale = defaultProps.minScale,
    maxScale = defaultProps.maxScale,
    displayControls = defaultProps.displayControls,
    steps = defaultProps.steps,
    children,
    isActive = false,

    transformThreshold = defaultProps.transformThreshold,
    disableTransforms = defaultProps.disableTransforms,
    setDisableTransforms = defaultProps.setDisableTransforms,
    ...elProps
  } = props

  const [ref, bounds] = useMeasure()
  const transformRef = React.useRef<ReactZoomPanPinchContentRef>(null)

  const value = React.useMemo(
    () => ({
      minScale,
      maxScale,
      displayControls,
      steps,
      isActive,

      transformThreshold,
      disableTransforms,
      setDisableTransforms,
    }),
    [isActive, disableTransforms, setDisableTransforms, transformThreshold]
  )
  const style = {
    width: "100%",
    height: "100%",
    overflow: "visible",
    display: "flex",
    ...elProps.style,
    "--transform-bounds-height": `${bounds.height}px`,
    "--transform-bounds-width": `${bounds.width}px`,
  } as React.CSSProperties

  return (
    <TransformContext.Provider value={value}>
      <div {...elProps} style={style} ref={ref} data-slot='transform-root'>
        {bounds.height > 0 && bounds.width > 0 && (
          <TransformWrapper
            ref={transformRef}
            disabled={!isActive}
            centerOnInit
            minScale={minScale}
            maxScale={maxScale}
            key={`${bounds.width}x${bounds.height}`}
            wheel={{ step: 0.1 }}
            pinch={{ step: 0.1 }}
            panning={{ disabled: disableTransforms }}
            limitToBounds={false}
            data-test
          >
            <TransformControlsProvider>{children}</TransformControlsProvider>
          </TransformWrapper>
        )}
      </div>
    </TransformContext.Provider>
  )
}

/**
 * TransformContent wrapper component
 */
type TransformComponentProps = Parameters<typeof TransformComponent>[0]
export const TransformContent: React.FC<TransformComponentProps> = ({ children, wrapperStyle, ...props }) => {
  return (
    <TransformComponent
      {...props}
      wrapperStyle={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        ...wrapperStyle,
      }}
      contentStyle={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TransformControlsProvider>
        <Slot
          style={{
            maxHeight: "var(--transform-bounds-height)",
            maxWidth: "var(--transform-bounds-width)",
          }}
          data-slot='transform-content'
        >
          {children}
        </Slot>
      </TransformControlsProvider>
    </TransformComponent>
  )
}
