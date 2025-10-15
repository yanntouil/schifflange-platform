import { Form, FormCropperType, InputNumber, useFieldContext, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Primitives, Ui, variants } from "@compo/ui"
import { cx, cxm, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { evolve, Patch } from "evolve-ts"
import { Copy, Crop, RatioIcon, RotateCw, Scaling, Undo, UnfoldHorizontal, UnfoldVertical, X } from "lucide-react"
import React from "react"
import Cropper, { CropperProps, MediaSize } from "react-easy-crop"
import { useMediasService } from "../../service.context"

/**
 * CropFileDialog
 */
export const CropFileDialog: React.FC<
  Ui.QuickDialogProps<Api.MediaFileWithRelations> & { append?: (value: Api.MediaFileWithRelations) => Promise<void> }
> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)

  return (
    <Primitives.Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      {item !== false && (
        <Primitives.Dialog.Portal>
          <Primitives.Dialog.Overlay className='fixed inset-0 size-full bg-black/40' />
          <Primitives.Dialog.Content
            data-state-ui={"visible"}
            className='dark group/dia-content animate-appear bg-background text-foreground fixed inset-0 isolate flex w-full flex-col overflow-hidden transition-all duration-300 data-[state-ui=visible]:top-12 data-[state-ui=visible]:rounded-t-3xl'
          >
            <Primitives.Dialog.Title className='sr-only'>{_("title")}</Primitives.Dialog.Title>
            <Primitives.Dialog.Description className='sr-only'>{_("description")}</Primitives.Dialog.Description>
            <Content item={item} {...props} />
          </Primitives.Dialog.Content>
        </Primitives.Dialog.Portal>
      )}
    </Primitives.Dialog.Root>
  )
}

const Content: React.FC<
  Ui.QuickDialogSafeProps<Api.MediaFileWithRelations> & {
    append?: (value: Api.MediaFileWithRelations) => Promise<void>
  }
> = ({ item, close, mutate, append }) => {
  const { _ } = useTranslation(dictionary)

  const { service, makePath } = useMediasService()
  const serviceFile = service.files.id(item.id)
  const transform = "cropper" in item.transform ? item.transform : initialTransform
  const hasTransform = transform.cropper.aspect.w !== 0

  const initialValues = {
    file: {
      url: makePath(item.originalUrl),
      isChange: false,
      transform,
    },
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values: { file } }) => {
      const { isChange, transform } = file
      close()
      if (!isChange) return
      match(await serviceFile.crop({ transform }))
        .with({ failed: true }, async () => Ui.toast.error(_("error")))
        .otherwise(async ({ data: { file } }) => {
          Ui.toast.success(_("success"))
          if (mutate) await mutate(file)
        })
    },
  })

  const unCrop = async () => {
    close()
    match(await serviceFile.uncrop())
      .with({ failed: true }, async () => Ui.toast.error(_("error")))
      .otherwise(async ({ data: { file } }) => {
        Ui.toast.success(_("success"))
        if (mutate) await mutate(file)
      })
  }

  const cropAs = async () => {
    close()
    match(await serviceFile.cropAs({ transform: form.values.file.transform }))
      .with({ failed: true }, async () => Ui.toast.error(_("error")))
      .otherwise(async ({ data: { file } }) => {
        Ui.toast.success(_("success"))
        if (append) await append(file)
      })
  }

  return (
    <Form.Root form={form}>
      <div className='from-background/80 via-background/50 to-background/0 absolute top-0 right-0 left-0 z-20 flex w-full justify-between bg-gradient-to-b p-4 transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'>
        <div className='ml-auto flex gap-1'>
          {hasTransform && (
            <Ui.Button variant='ghost' onClick={unCrop}>
              <Undo aria-hidden />
              {_("undo")}
            </Ui.Button>
          )}
          {form.values.file.isChange && (
            <>
              <Form.Submit variant='ghost'>
                <Crop aria-hidden />
                {_("submit")}
              </Form.Submit>
              <Ui.Button variant='ghost' onClick={cropAs}>
                <Copy aria-hidden />
                {_("copy-and-crop")}
              </Ui.Button>
            </>
          )}
          <Ui.Button icon variant='ghost' onClick={close}>
            <X aria-hidden />
            <Ui.SrOnly>{_("close")}</Ui.SrOnly>
          </Ui.Button>
        </div>
      </div>

      <Form.Field name='file'>
        <FormCrooper />
      </Form.Field>
    </Form.Root>
  )
}

const FormCrooper: React.FC = () => {
  const { setFieldValue, value } = useFieldContext<FormCropperType>()
  const setPartial = React.useCallback(
    (patch: Patch<FormCropperType>) => setFieldValue(evolve(patch, value)),
    [setFieldValue, value]
  )

  const onCropComplete: CropperProps["onCropComplete"] = (croppedArea) => {
    const cropper = { zoom, crop, aspect }
    setPartial({
      ...value,
      isChange: !compareCropper(original, cropper),
      transform: {
        ...croppedArea,
        cropper,
      },
    })
  }
  // initial value from transform or by default
  const [original, setOriginal] = React.useState<Api.Cropper>(() => value.transform.cropper)

  // original image size
  const [imageSize, setImageSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 })

  // loaded state
  const [loaded, setLoaded] = React.useState(false)

  // on media loaded
  const onMediaLoaded = (mediaSize: MediaSize) => {
    const hasAllreadyTransform = value.transform.cropper.aspect.w !== 0
    setLoaded(true)
    setImageSize({ width: mediaSize.naturalWidth, height: mediaSize.naturalHeight })

    // keep last transform set by default in state
    if (hasAllreadyTransform) return

    // take default values
    const defaultAspect = getImageAspect(mediaSize.naturalWidth, mediaSize.naturalHeight)
    const cropper = { aspect: defaultAspect, crop: { x: 0, y: 0 }, zoom: 1 }
    setOriginal(cropper)
    setZoom(cropper.zoom)
    setCrop(cropper.crop)
    setAspect(cropper.aspect)
  }

  // wait animation to be finished before showing the cropper
  const [transitionEnd, setTransitionEnd] = React.useState(false)
  React.useEffect(() => {
    const timeout = setTimeout(() => setTransitionEnd(true), 300)
    return () => clearTimeout(timeout)
  }, [])

  // cropper values
  const [zoom, setZoom] = React.useState(() => value.transform.cropper.zoom)
  const [crop, setCrop] = React.useState(() => value.transform.cropper.crop)
  const [aspect, setAspect] = React.useState(() => value.transform.cropper.aspect)
  const cropperAspect = React.useMemo(() => aspect.w / aspect.h, [aspect])

  return (
    <div>
      {transitionEnd && (
        <div>
          <Cropper
            image={value.url ?? undefined}
            classes={{
              containerClassName: "bg--card",
            }}
            aspect={cropperAspect}
            onCropComplete={onCropComplete}
            onMediaLoaded={onMediaLoaded}
            crop={crop}
            onCropChange={setCrop}
            zoom={zoom}
            onZoomChange={setZoom}
          />
          {loaded && <CropperBar {...{ zoom, setZoom, aspect, setAspect, imageSize }} />}
        </div>
      )}
    </div>
  )
}

/**
 * CropperBar
 */
const CropperBar: React.FC<{
  zoom: Api.Cropper["zoom"]
  setZoom: (zoom: Api.Cropper["zoom"]) => void
  aspect: Api.Cropper["aspect"]
  imageSize: { width: number; height: number }
  setAspect: (aspect: Api.Cropper["aspect"]) => void
}> = ({ zoom, setZoom, aspect, setAspect, imageSize }) => {
  const { _ } = useTranslation(dictionary)
  const { id } = useFieldContext<FormCropperType>()

  // manage aspect ratio
  const ratio = React.useMemo(() => {
    return getImageAspect(aspect.w, aspect.h)
  }, [aspect])
  const originalRatio = React.useMemo(() => {
    return getImageAspect(imageSize.width, imageSize.height)
  }, [imageSize])
  const ratioValue = React.useMemo(() => {
    if ((ratio.w === 16 && ratio.h === 9) || (ratio.w === 9 && ratio.h === 16)) return "16:9"
    if ((ratio.w === 4 && ratio.h === 3) || (ratio.w === 3 && ratio.h === 4)) return "4:3"
    if (ratio.w === 1 && ratio.h === 1) return "1:1"
    if (ratio.w === originalRatio.w && ratio.h === originalRatio.h) return "original"
    return "custom"
  }, [ratio, originalRatio])
  const setRatioValue = (value: string) => {
    if (value === "16:9") setAspect({ w: 16, h: 9 })
    if (value === "4:3") setAspect({ w: 4, h: 3 })
    if (value === "1:1") setAspect({ w: 1, h: 1 })
    if (value === "original") setAspect(originalRatio)
  }
  const reverse = () => setAspect({ w: aspect.h, h: aspect.w })

  // zoom
  const roundedZoom = Math.round(zoom * 100) / 100

  return (
    <div className='dark pointer-events-auto absolute bottom-4 left-1/2 z-20 flex h-min w-max -translate-x-1/2 flex-col gap-2 rounded-md bg-zinc-800 p-1.5 text-white shadow-2xl select-none'>
      <div className='flex items-center justify-center gap-4'>
        <span className='flex w-20 items-center gap-2 text-sm'>
          <RatioIcon className='size-4' aria-hidden />
          {_("ratio")}
        </span>
        <Primitives.ToggleGroup.Root
          type='single'
          className='flex gap-2'
          value={ratioValue}
          onValueChange={setRatioValue}
        >
          <Primitives.ToggleGroup.Item asChild value='4:3'>
            <Ui.Button variant={ratioValue === "4:3" ? "default" : "secondary"} size='sm'>
              4:3
            </Ui.Button>
          </Primitives.ToggleGroup.Item>
          <Primitives.ToggleGroup.Item asChild value='16:9'>
            <Ui.Button variant={ratioValue === "16:9" ? "default" : "secondary"} size='sm'>
              16:9
            </Ui.Button>
          </Primitives.ToggleGroup.Item>
          <Primitives.ToggleGroup.Item asChild value='1:1'>
            <Ui.Button variant={ratioValue === "1:1" ? "default" : "secondary"} size='sm'>
              1:1
            </Ui.Button>
          </Primitives.ToggleGroup.Item>
          <Primitives.ToggleGroup.Item asChild value='original'>
            <Ui.Button variant={ratioValue === "original" ? "default" : "secondary"} size='sm'>
              {_("original")}
            </Ui.Button>
          </Primitives.ToggleGroup.Item>
          <Ui.Popover.Quick
            classNames={{ content: "dark bg-zinc-900" }}
            align='end'
            side='top'
            asChild
            content={
              <div className='space-y-4'>
                <h3 className='text-sm leading-none font-medium'>{_("custom-title")}</h3>
                <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-4'>
                  <div className='relative grid'>
                    <label htmlFor={`${id}-width`} className={cx(variants.inputIcon({ size: "sm", side: "left" }))}>
                      <UnfoldHorizontal aria-hidden />
                      <Ui.SrOnly>{_("width")}</Ui.SrOnly>
                    </label>
                    <InputNumber
                      id={`${id}-width`}
                      size='sm'
                      icon='left'
                      value={aspect.w}
                      min={1}
                      decimalPrecision={0}
                      placeholder='0'
                      className='text-center'
                      onValueChange={(value) => setAspect({ ...aspect, w: value })}
                    />
                  </div>
                  <Ui.Button variant='ghost' size='xxs' icon onClick={reverse}>
                    <RotateCw aria-hidden />
                    <Ui.SrOnly>{_("reverse")}</Ui.SrOnly>
                  </Ui.Button>
                  <div className='relative grid'>
                    <label className={cx(variants.inputIcon({ size: "sm", side: "left" }))} htmlFor={`${id}-height`}>
                      <UnfoldVertical aria-hidden />
                      <Ui.SrOnly>{_("height")}</Ui.SrOnly>
                    </label>
                    <InputNumber
                      id={`${id}-height`}
                      icon='left'
                      size='sm'
                      step={1}
                      min={1}
                      value={aspect.h}
                      className='text-center'
                      onValueChange={(value) => setAspect({ ...aspect, h: value })}
                    />
                  </div>
                </div>
              </div>
            }
          >
            <Primitives.ToggleGroup.Item asChild value='custom'>
              <Ui.Button variant={ratioValue === "custom" ? "default" : "secondary"} size='sm'>
                {_("custom")}
              </Ui.Button>
            </Primitives.ToggleGroup.Item>
          </Ui.Popover.Quick>
        </Primitives.ToggleGroup.Root>
      </div>
      <div className='grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-sm'>
        <span className='flex w-20 items-center gap-2 text-sm'>
          <Scaling className='size-4' aria-hidden />
          {_("zoom")}
        </span>
        <Primitives.Slider.Root
          min={1}
          max={3}
          step={0.01}
          value={[zoom]}
          onValueChange={([value]: [number]) => setZoom(value)}
          className='relative flex shrink-0 touch-none items-center select-none'
        >
          <Primitives.Slider.Track className='bg-secondary relative h-1 w-full grow overflow-hidden rounded-full'>
            <Primitives.Slider.Range className='bg-primary-foreground absolute h-full' />
          </Primitives.Slider.Track>
          <Primitives.Slider.Thumb
            className={cxm(
              "border-primary-foreground bg-foreground ring-offset-background block size-3 rounded-full border-2 transition-colors",
              variants.focus(),
              variants.disabled()
            )}
          />
        </Primitives.Slider.Root>
        <span className={Ui.badgeVariants({ variant: "secondary" })}>{roundedZoom}</span>
      </div>
    </div>
  )
}

/**
 * initialTransform
 */
const initialTransform: Api.Transform = {
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  rotate: 0,
  cropper: {
    crop: {
      x: 0,
      y: 0,
    },
    zoom: 1,
    aspect: {
      w: 0,
      h: 9,
    },
  },
}

/**
 * utils
 */
// take the greatest common divisor of two numbers
const gcd = (a: number, b: number): number => {
  // Ensure inputs are non-negative integers
  if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error("Inputs must be integers.")
  if (a < 0 || b < 0) throw new Error("Inputs must be non-negative.")
  // Euclidean algorithm
  return b === 0 ? a : gcd(b, a % b)
}

// take the aspect ratio of an image
const getImageAspect = (width: number, height: number) => {
  const divisor = gcd(Math.round(width), Math.round(height))
  return {
    w: Math.round(width) / divisor,
    h: Math.round(height) / divisor,
  }
}

// compare two croppers
const compareCropper = (a: Api.Cropper, b: Api.Cropper) => {
  return a.aspect.w === b.aspect.w && a.aspect.h === b.aspect.h && a.crop.x === b.crop.x && a.crop.y === b.crop.y
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Crop image by selecting area you want to keep",
    description: "You can crop the image by selecting the area you want to keep.",
    undo: "Restore",
    submit: "Save",
    "copy-and-crop": "Save as new",
    success: "File has been successfully updated.",
    error: "Error occurred during file update.",
    ratio: "Ratio",
    original: "Original",
    custom: "Custom",
    "custom-title": "Select a custom ratio",
    width: "Width",
    reverse: "Reverse width and height",
    height: "Height",
    zoom: "Zoom",
  },
  fr: {
    title: "Recadrer l'image en sélectionnant la zone que vous souhaitez conserver",
    description: "Vous pouvez recadrer l'image en sélectionnant la zone que vous souhaitez conserver.",
    undo: "Restaurer",
    submit: "Enregistrer",
    "copy-and-crop": "Enregistrer en tant que nouvelle",
    success: "Le fichier a été mis à jour avec succès.",
    error: "Une erreur est survenue lors de la mise à jour du fichier.",
    ratio: "Ratio",
    original: "Original",
    custom: "Personnalisé",
    "custom-title": "Sélectionnez un ratio personnalisé",
    width: "Largeur",
    reverse: "Inverser largeur et hauteur",
    height: "Hauteur",
    zoom: "Zoom",
  },
  de: {
    title: "Bild zuschneiden durch Auswahl des zu behaltenden Bereichs",
    description: "Sie können das Bild zuschneiden, indem Sie den zu behaltenden Bereich auswählen.",
    undo: "Wiederherstellen",
    submit: "Speichern",
    "copy-and-crop": "Als neu speichern",
    success: "Datei wurde erfolgreich aktualisiert.",
    error: "Fehler beim Aktualisieren der Datei.",
    ratio: "Verhältnis",
    original: "Original",
    custom: "Benutzerdefiniert",
    "custom-title": "Benutzerdefiniertes Verhältnis auswählen",
    width: "Breite",
    reverse: "Breite und Höhe umkehren",
    height: "Höhe",
    zoom: "Zoom",
  },
}
