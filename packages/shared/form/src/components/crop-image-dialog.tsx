import { Translation, useTranslation } from "@compo/localize"
import { Primitives, Ui, variants } from "@compo/ui"
import { cxm } from "@compo/utils"
import { Check, Scaling, X } from "lucide-react"
import React from "react"
import Cropper, { Area, CropperProps } from "react-easy-crop"

/**
 * CropImageDialog
 */
export type CropImageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: File | null
  cropAspect?: number
  cropShape?: "rect" | "round"
  onCropComplete: (croppedFile: File) => void
}

export const CropImageDialog: React.FC<CropImageDialogProps> = ({
  open,
  onOpenChange,
  file,
  cropAspect = 16 / 9,
  cropShape = "rect",
  onCropComplete,
}) => {
  const { _ } = useTranslation(dictionary)

  return (
    <Primitives.Dialog.Root open={open} onOpenChange={onOpenChange}>
      {file && (
        <Primitives.Dialog.Portal>
          <Primitives.Dialog.Overlay className='fixed inset-0 size-full bg-black/40' />
          <Primitives.Dialog.Content
            data-state-ui={"visible"}
            className='dark group/dia-content animate-appear bg-background text-foreground fixed inset-0 isolate flex w-full flex-col overflow-hidden transition-all duration-300 data-[state-ui=visible]:top-12 data-[state-ui=visible]:rounded-t-3xl'
          >
            <Primitives.Dialog.Title className='sr-only'>{_("title")}</Primitives.Dialog.Title>
            <Primitives.Dialog.Description className='sr-only'>{_("description")}</Primitives.Dialog.Description>
            <CropContent
              file={file}
              cropAspect={cropAspect}
              cropShape={cropShape}
              onClose={() => onOpenChange(false)}
              onCropComplete={onCropComplete}
            />
          </Primitives.Dialog.Content>
        </Primitives.Dialog.Portal>
      )}
    </Primitives.Dialog.Root>
  )
}

/**
 * CropContent
 */
type CropContentProps = {
  file: File
  cropAspect: number
  cropShape: "rect" | "round"
  onClose: () => void
  onCropComplete: (croppedFile: File) => void
}

const CropContent: React.FC<CropContentProps> = ({ file, cropAspect, cropShape, onClose, onCropComplete }) => {
  const { _ } = useTranslation(dictionary)

  // Crop state
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  // Image URL
  const imageUrl = React.useMemo(() => URL.createObjectURL(file), [file])

  // Crop callback
  const onCropCompleteCallback: CropperProps["onCropComplete"] = React.useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels)
    },
    []
  )

  // Handle submit
  const handleSubmit = React.useCallback(async () => {
    if (!croppedAreaPixels) return

    setIsProcessing(true)
    try {
      const croppedFile = await createCroppedImage(file, croppedAreaPixels)
      onCropComplete(croppedFile)
      onClose()
    } catch (e) {
      console.error("Error creating cropped image:", e)
      Ui.toast.error(_("error"))
    } finally {
      setIsProcessing(false)
    }
  }, [file, croppedAreaPixels, onCropComplete, onClose, _])

  return (
    <>
      {/* Header with actions */}
      <div className='from-background/80 via-background/50 to-background/0 absolute top-0 right-0 left-0 z-20 flex w-full justify-between bg-gradient-to-b p-4 transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'>
        <div className='ml-auto flex gap-1'>
          <Ui.Button variant='ghost' onClick={handleSubmit} disabled={isProcessing || !croppedAreaPixels}>
            <Check aria-hidden />
            {_("submit")}
          </Ui.Button>
          <Ui.Button icon variant='ghost' onClick={onClose} disabled={isProcessing}>
            <X aria-hidden />
            <Ui.SrOnly>{_("close")}</Ui.SrOnly>
          </Ui.Button>
        </div>
      </div>

      {/* Cropper */}
      <div className='relative flex-1'>
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={cropAspect}
          cropShape={cropShape}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteCallback}
          classes={{
            containerClassName: "bg-zinc-950",
          }}
        />
      </div>

      {/* Zoom control bar */}
      <div className='dark pointer-events-auto absolute bottom-4 left-1/2 z-20 flex h-min w-max -translate-x-1/2 items-center gap-4 rounded-md bg-zinc-800 p-3 text-white shadow-2xl select-none'>
        <span className='flex items-center gap-2 text-sm'>
          <Scaling className='size-4' aria-hidden />
          {_("zoom")}
        </span>
        <Primitives.Slider.Root
          min={1}
          max={3}
          step={0.01}
          value={[zoom]}
          onValueChange={([value]: [number]) => setZoom(value)}
          className='relative flex w-40 shrink-0 touch-none items-center select-none'
        >
          <Primitives.Slider.Track className='bg-zinc-600 relative h-1 w-full grow overflow-hidden rounded-full'>
            <Primitives.Slider.Range className='bg-white absolute h-full' />
          </Primitives.Slider.Track>
          <Primitives.Slider.Thumb
            className={cxm(
              "border-white bg-white block size-3 rounded-full border-2 transition-colors",
              variants.focus(),
              variants.disabled()
            )}
          />
        </Primitives.Slider.Root>
        <span className='text-sm font-medium'>{Math.round(zoom * 100) / 100}</span>
      </div>
    </>
  )
}

/**
 * Helper: Create an image element from URL
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.src = url
  })

/**
 * Helper: Create cropped image using Canvas API
 */
const createCroppedImage = async (
  file: File,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<File> => {
  const image = await createImage(URL.createObjectURL(file))
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("No 2d context")
  }

  canvas.width = cropArea.width
  canvas.height = cropArea.height

  ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"))
        return
      }
      const croppedFile = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      })
      resolve(croppedFile)
    }, file.type)
  })
}

/**
 * dictionaries
 */
const dictionary = {
  fr: {
    title: "Recadrer l'image",
    description: "Ajustez le recadrage de votre image",
    submit: "Valider",
    close: "Fermer",
    zoom: "Zoom",
    error: "Une erreur est survenue lors du recadrage de l'image",
  },
  en: {
    title: "Crop image",
    description: "Adjust the crop of your image",
    submit: "Validate",
    close: "Close",
    zoom: "Zoom",
    error: "An error occurred while cropping the image",
  },
  de: {
    title: "Bild zuschneiden",
    description: "Passen Sie den Zuschnitt Ihres Bildes an",
    submit: "Bestätigen",
    close: "Schließen",
    zoom: "Zoom",
    error: "Beim Zuschneiden des Bildes ist ein Fehler aufgetreten",
  },
} satisfies Translation
