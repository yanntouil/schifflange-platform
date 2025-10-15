import { useTranslation } from "@compo/localize"
import { Primitives, Ui } from "@compo/ui"
import { A, D, delay, match } from "@compo/utils"
import React from "react"
import { useWindowSize } from "react-use"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { useContent } from "../context"
import { ItemRender } from "./item"
import { ChangePreviewButton, OpenPreviewButton } from "./preview-button"

/**
 * Preview
 * display a preview of the content
 */
export const Preview: React.FC = () => {
  const { preview } = useContent()
  const [open, onOpenChange] = React.useState(false)
  const changeRef = React.useRef<HTMLButtonElement>(null)
  const openRef = React.useRef<HTMLButtonElement>(null)
  const openPreview = () => {
    preview.onOpenChange(true)
    onOpenChange(true) // focus is placed automatically on the change button
  }
  const closePreview = () => {
    preview.onOpenChange(false)
    delay(0).then(() => openRef.current?.focus()) // replace the focus on the open button
  }
  return (
    <>
      {!preview.open && <OpenPreviewButton {...{ openPreview }} ref={openRef} />}
      <Primitives.Dialog.Root open={preview.open} onOpenChange={preview.onOpenChange}>
        <PreviewContent>
          <ChangePreviewButton {...{ open, onOpenChange, closePreview }} ref={changeRef} />
        </PreviewContent>
      </Primitives.Dialog.Root>
    </>
  )
}

/**
 * PreviewContent
 * display the collection of items in preview mode scaled to the device size
 */
const PreviewContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { _ } = useTranslation(dictionary)
  const { content, preview } = useContent()

  // get the items to display in preview mode (published items only)
  const items = React.useMemo(
    () =>
      A.sortBy(
        A.filter(content.items, (item) => item.state === "published"),
        D.prop("order")
      ),
    [content.items]
  )

  // set the device size displayed in relation to the preview type
  const deviceSize = React.useMemo(
    () =>
      match(preview.type)
        .with("desktop", () => ({ width: 1280, height: 720 }))
        .with("mobile", () => ({ width: 375, height: 667 }))
        .with("tablet-landscape", () => ({ width: 768, height: 1024 }))
        .with("tablet-portrait", () => ({ width: 1024, height: 768 }))
        .exhaustive(),
    [preview.type]
  )

  // get the window size use to calculate the scale
  const windowSize = useWindowSize()

  // set the padding, scale and displayed width and height
  const { padding, scale, displayedWidth, displayedHeight } = React.useMemo(() => {
    // set the padding
    const padding = windowSize.width > 1280 ? 16 : 8

    // calculate the best scale based on the window size and the device size
    const scaleX = (windowSize.width - padding * 2) / deviceSize.width
    const scaleY = (windowSize.height - padding * 2) / deviceSize.height
    const fitScale = Math.min(scaleX, scaleY)
    const scale = Math.floor(Math.min(fitScale, 1) * 100) / 100

    // calculate the real displayed width and height
    const displayedWidth = Math.round(deviceSize.width * scale)
    const displayedHeight = Math.round(deviceSize.height * scale)

    return { padding, scale, displayedWidth, displayedHeight }
  }, [deviceSize, windowSize])

  return (
    <Primitives.Dialog.Portal>
      <Primitives.Dialog.Overlay
        className='fixed inset-0 flex items-center justify-center bg-black/90'
        style={{ padding: padding }}
      >
        <Primitives.Dialog.Content
          key={scale}
          data-theme='lcb'
          style={{
            width: displayedWidth,
            height: displayedHeight,
            maxWidth: displayedWidth,
            maxHeight: displayedHeight,
          }}
        >
          <Primitives.Dialog.Title className='sr-only'>{_("title")}</Primitives.Dialog.Title>
          {children}
          <TransformWrapper
            wheel={{ disabled: true }}
            panning={{ disabled: true }}
            pinch={{ disabled: true }}
            doubleClick={{ disabled: true }}
            initialScale={scale}
          >
            <TransformComponent
              wrapperStyle={{ width: displayedWidth, height: displayedHeight }}
              contentStyle={{ width: deviceSize.width, height: deviceSize.height }}
            >
              <Ui.ScrollArea className='border-border/50 bg-background size-full rounded-md border shadow-md'>
                <div className='@container/preview'>
                  {A.map(items, (item) => (
                    <ItemRender key={item.id} item={item} />
                  ))}
                </div>
              </Ui.ScrollArea>
            </TransformComponent>
          </TransformWrapper>
        </Primitives.Dialog.Content>
      </Primitives.Dialog.Overlay>
    </Primitives.Dialog.Portal>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Prévisualisation",
  },
  de: {
    title: "Vorschau",
  },
  en: {
    title: "Preview",
  },
}
