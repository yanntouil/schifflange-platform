import { useTranslation } from "@compo/localize"
import { Primitives, Ui } from "@compo/ui"
import { A, O, cxm, match } from "@compo/utils"
import { Monitor, MonitorPlay, ScreenShareOff, Smartphone, Tablet } from "lucide-react"
import React from "react"
import { useContent } from "../context"
import { PreviewType, previewTypes } from "../context.actions"

/**
 * OpenPreviewButton
 * display the open preview button
 */
const OpenPreviewButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Ui.Button> & { openPreview: () => void }
>(({ className, openPreview, ...props }, ref) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Primitives.Portal>
      <Ui.Tooltip.Quick tooltip={_("open-preview-mode")} side='left' asChild>
        <Ui.Button
          className={cxm("fixed right-4 bottom-4 z-10 rounded-full", className)}
          icon
          onClick={openPreview}
          ref={ref}
          {...props}
        >
          <MonitorPlay />
          <Ui.SrOnly>{_("open-preview-mode")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.Tooltip.Quick>
    </Primitives.Portal>
  )
})
OpenPreviewButton.displayName = "OpenPreviewButton"
export { OpenPreviewButton }

/**
 * ChangePreviewButton
 * display the change preview button
 */
const ChangePreviewButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Ui.Button> & {
    open: boolean
    onOpenChange: (open: boolean) => void
    closePreview: () => void
  }
>(({ className, open, onOpenChange, closePreview, ...props }, ref) => {
  const { _ } = useTranslation(dictionary)
  const { preview } = useContent()

  return (
    <Primitives.DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <Primitives.DropdownMenu.Trigger asChild>
        <Ui.Tooltip.Quick tooltip={_("change-preview-mode")} side='left' asChild>
          <Ui.Button className={cxm("fixed right-4 bottom-4 rounded-full", className)} icon ref={ref} {...props}>
            <DeviceIcon type={preview.type} />
            <Ui.SrOnly>{_("change-preview-mode")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Primitives.DropdownMenu.Trigger>
      <Primitives.DropdownMenu.Portal>
        <Primitives.DropdownMenu.Content
          className={cxm(
            "flex origin-bottom flex-col items-center justify-center gap-2",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
          sideOffset={4}
        >
          <Ui.Tooltip.Quick tooltip={_("stop-preview")} side='left' asChild>
            <Primitives.DropdownMenu.Item
              className={cxm(
                Ui.buttonVariants({ variant: "secondary", size: "sm", className: "size-7 rounded-full px-0" })
              )}
              onClick={closePreview}
            >
              {<ScreenShareOff aria-hidden />}
              <Ui.SrOnly>{_("stop-preview")}</Ui.SrOnly>
            </Primitives.DropdownMenu.Item>
          </Ui.Tooltip.Quick>
          {A.filterMap([...previewTypes], (type) =>
            type !== preview.type ? (
              <Ui.Tooltip.Quick tooltip={_(`preview-on-${type}`)} side='left' key={type} asChild>
                <Primitives.DropdownMenu.Item
                  className={cxm(
                    Ui.buttonVariants({
                      variant: "secondary",
                      size: "sm",
                      className: "size-7 rounded-full px-0",
                    })
                  )}
                  onClick={() => preview.setType(type)}
                >
                  <DeviceIcon type={type} />
                  <Ui.SrOnly>{_(`preview-on-${type}`)}</Ui.SrOnly>
                </Primitives.DropdownMenu.Item>
              </Ui.Tooltip.Quick>
            ) : (
              O.None
            )
          )}
        </Primitives.DropdownMenu.Content>
      </Primitives.DropdownMenu.Portal>
    </Primitives.DropdownMenu.Root>
  )
})
ChangePreviewButton.displayName = "ChangePreviewButton"
export { ChangePreviewButton }

/**
 * DeviceIcon
 * display the device icon
 */
const DeviceIcon: React.FC<{ type: PreviewType }> = ({ type }) => {
  return match(type)
    .with("mobile", () => <Smartphone aria-hidden />)
    .with("desktop", () => <Monitor aria-hidden />)
    .with("tablet-landscape", () => <Tablet aria-hidden />)
    .with("tablet-portrait", () => <Tablet className='rotate-90' aria-hidden />)
    .exhaustive()
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "open-preview-mode": "Lancer la prévisualisation",
    "change-preview-mode": "Changer le mode de prévisualisation",
    "preview-on-auto": "Prévisualiser sur l'appareil",
    "preview-on-mobile": "Prévisualiser sur mobile",
    "preview-on-desktop": "Prévisualiser sur desktop",
    "preview-on-tablet-portrait": "Prévisualiser sur tablette en mode paysage",
    "preview-on-tablet-landscape": "Prévisualiser sur tablette en mode portrait",
    "stop-preview": "Arrêter la prévisualisation",
  },
  de: {
    "open-preview-mode": "Vorschau starten",
    "change-preview-mode": "Vorschau-Modus ändern",
    "preview-on-auto": "Vorschau auf Gerät",
    "preview-on-mobile": "Vorschau auf Mobilgerät",
    "preview-on-desktop": "Vorschau auf Desktop",
    "preview-on-tablet-portrait": "Vorschau auf Tablet im Querformat",
    "preview-on-tablet-landscape": "Vorschau auf Tablet im Hochformat",
    "stop-preview": "Vorschau stoppen",
  },
  en: {
    "open-preview-mode": "Start preview",
    "change-preview-mode": "Change preview mode",
    "preview-on-auto": "Preview on device",
    "preview-on-mobile": "Preview on mobile",
    "preview-on-desktop": "Preview on desktop",
    "preview-on-tablet-portrait": "Preview on tablet in landscape mode",
    "preview-on-tablet-landscape": "Preview on tablet in portrait mode",
    "stop-preview": "Stop preview",
  },
}
