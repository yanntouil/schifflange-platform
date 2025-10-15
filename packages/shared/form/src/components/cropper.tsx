import { Translation, useTranslation } from "@compo/localize"
import { Primitives, Ui, variants } from "@compo/ui"
import { N, cx } from "@compo/utils"
import { Patch, evolve } from "evolve-ts"
import { RotateCw, Scaling, UnfoldHorizontal, UnfoldVertical } from "lucide-react"
import React from "react"
import Cropper, { CropperProps } from "react-easy-crop"
import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  FormMediasTransform,
  InputNumber,
  InputQuantity,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "."

/**
 * FormCropper
 */
export type FormCropperProps = FieldInputCropperProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormCropper = React.forwardRef<HTMLDivElement, FormCropperProps>(({ classNames, ...props }, ref) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldInputCropper {...extractInputProps({ ...props })} ref={ref} className={classNames?.input} />
    </FormGroup>
  )
})

/**
 * FormInputCropper
 */
type FieldInputCropperProps = React.ComponentProps<"div">
const FieldInputCropper = React.forwardRef<HTMLDivElement, FieldInputCropperProps>(({ className, ...props }, ref) => {
  const { setFieldValue, value } = useFieldContext<FormCropperType>()

  const setPartial = React.useCallback(
    (patch: Patch<FormCropperType>) => setFieldValue(evolve(patch, value)),
    [setFieldValue, value]
  )

  const onCropComplete: CropperProps["onCropComplete"] = (croppedArea) => {
    setPartial({
      ...value,
      isChange: !compareCropper(original, value.transform.cropper),
      transform: {
        ...croppedArea,
        cropper: value.transform.cropper,
      },
    })
  }
  const [original, setOriginal] = React.useState<FormMediasTransform["cropper"]>(() => value.transform.cropper)
  const onMediaLoaded = (mediaSize: { width: number; height: number }) => {
    // if no aspect ratio is set, set it to the image aspect ratio
    if (value.transform.cropper.aspect.w === 0) {
      const aspect = getImageAspect(mediaSize.width, mediaSize.height)
      const cropper = {
        aspect,
        crop: { x: 0, y: 0 },
        zoom: 1,
      }
      setOriginal(cropper)
      setPartial({
        transform: {
          cropper,
        },
      })
    }
  }
  const aspect = React.useMemo(
    () => value.transform.cropper.aspect.w / value.transform.cropper.aspect.h,
    [value.transform.cropper.aspect]
  )

  const [displayTools, setDisplayTools] = React.useState(false)
  const [transitionEnd, setTransitionEnd] = React.useState(false)
  React.useEffect(() => {
    const timeout = setTimeout(() => setTransitionEnd(true), 300)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={cx("flex min-h-0 flex-col", className)} ref={ref} {...props}>
      <div className='relative h-[250px] shrink-0'>
        {transitionEnd && (
          <div>
            <Cropper
              image={value.url ?? undefined}
              classes={{
                containerClassName: "bg-card",
              }}
              aspect={aspect}
              onCropComplete={onCropComplete}
              onMediaLoaded={onMediaLoaded}
              crop={value.transform.cropper.crop}
              onCropChange={(crop) => setPartial({ transform: { cropper: { crop } } })}
              zoom={value.transform.cropper.zoom}
              onZoomChange={(zoom) => setPartial({ transform: { cropper: { zoom } } })}
              onCropAreaChange={() => setDisplayTools(true)}

              // rotation={value.transform.rotate}
              // onRotationChange={(rotation) => setPartial({ transform: { rotate: rotation } })}
              //initialCroppedAreaPercentages={D.selectKeys(value.transform, ["x", "y", "width", "height"])}
            />
          </div>
        )}
      </div>
      <div className='flex min-h-[116px] flex-col gap-5 border-muted/25 p-5'>
        {displayTools && <CropperBar />}
        {displayTools && <CropperInsetBar />}
      </div>
    </div>
  )
})

/**
 * CropperBar
 */
const CropperBar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { id, value, setFieldValue } = useFieldContext<FormCropperType>()
  const setPartial = React.useCallback(
    (patch: Patch<FormCropperType>) => setFieldValue(evolve(patch, value)),
    [setFieldValue, value]
  )
  const setAspect = (aspect: FormMediasTransform["cropper"]["aspect"]) =>
    setPartial({ transform: { cropper: { aspect } } })
  const aspect = value.transform.cropper.aspect

  // test predefined ratio
  const is169 = React.useMemo(() => {
    const a = getImageAspect(aspect.w, aspect.h)
    return (a.w === 16 && a.h === 9) || (a.w === 9 && a.h === 16)
  }, [aspect])
  const is43 = React.useMemo(() => {
    const a = getImageAspect(aspect.w, aspect.h)
    return (a.w === 4 && a.h === 3) || (a.w === 3 && a.h === 4)
  }, [aspect])
  const isSquare = React.useMemo(() => {
    const a = getImageAspect(aspect.w, aspect.h)
    return a.w === 1 && a.h === 1
  }, [aspect])

  // change aspect ratio
  const toggle43 = () => {
    if (is43) {
      if (N.gt(aspect.h, aspect.w)) setAspect({ w: 4, h: 3 })
      else setAspect({ w: 3, h: 4 })
    } else setAspect({ w: 4, h: 3 })
  }
  const toggle169 = () => {
    if (is169) {
      if (N.gt(aspect.h, aspect.w)) {
        setAspect({ w: 16, h: 9 })
      } else {
        setAspect({ w: 9, h: 16 })
      }
    } else setAspect({ w: 16, h: 9 })
  }
  const setSquare = () => setAspect({ w: 1, h: 1 })
  const reverse = () => setAspect({ w: aspect.h, h: aspect.w })

  const size = "xs" as const

  return (
    <div className='flex flex-wrap justify-between gap-5'>
      <div className='grid grid-cols-[1fr_auto_1fr] gap-2 text-xs'>
        <div className='relative grid w-28'>
          <label htmlFor={`${id}-width`} className={cx(variants.inputIcon({ size, side: "left" }))}>
            <UnfoldHorizontal aria-hidden />
            <Ui.SrOnly>{_("width")}</Ui.SrOnly>
          </label>
          <InputNumber
            id={`${id}-width`}
            size={size}
            icon='left'
            value={aspect.w}
            min={1}
            onValueChange={(value) => setAspect({ ...aspect, w: value })}
          />
        </div>
        <Ui.Button variant='ghost' size={size} icon onClick={reverse}>
          <RotateCw aria-hidden />
          <Ui.SrOnly>{_("reverse")}</Ui.SrOnly>
        </Ui.Button>
        <div className='relative grid w-28'>
          <label className={cx(variants.inputIcon({ size, side: "left" }))} htmlFor={`${id}-height`}>
            <UnfoldVertical aria-hidden />
            <Ui.SrOnly>{_("height")}</Ui.SrOnly>
          </label>
          <InputNumber
            id={`${id}-height`}
            icon='left'
            size={size}
            step={1}
            max={24}
            min={1}
            value={aspect.h}
            onValueChange={(value) => setAspect({ ...aspect, h: value })}
          />
        </div>
      </div>
      <Primitives.ToggleGroup.Root type='single' className='flex gap-2 text-xs'>
        <Primitives.ToggleGroup.Item asChild value='43'>
          <Ui.Button variant={is43 ? "default" : "secondary"} onClick={toggle43} size={size}>
            <RatioIcon className={is43 && N.gt(aspect.h, aspect.w) ? "aspect-[3/4]" : "aspect-[4/3]"} />
            4:3
            <Ui.SrOnly>{_("toggle-4-3")}</Ui.SrOnly>
          </Ui.Button>
        </Primitives.ToggleGroup.Item>
        <Primitives.ToggleGroup.Item asChild value='169'>
          <Ui.Button variant={is169 ? "default" : "secondary"} onClick={toggle169} size={size}>
            <RatioIcon className={is169 && N.gt(aspect.h, aspect.w) ? "aspect-[9/16]" : "aspect-[16/9]"} />
            16:9
            <Ui.SrOnly>{_("toggle-16-9")}</Ui.SrOnly>
          </Ui.Button>
        </Primitives.ToggleGroup.Item>
        <Primitives.ToggleGroup.Item asChild value='square'>
          <Ui.Button variant={isSquare ? "default" : "secondary"} onClick={setSquare} size={size}>
            <RatioIcon className='aspect-square' />
            1:1
            <Ui.SrOnly>{_("toggle-1-1")}</Ui.SrOnly>
          </Ui.Button>
        </Primitives.ToggleGroup.Item>
      </Primitives.ToggleGroup.Root>
    </div>
  )
}

/**
 * CropperInsetBar
 */
const CropperInsetBar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { id, value, setFieldValue } = useFieldContext<FormCropperType>()
  const setPartial = React.useCallback(
    (patch: Patch<FormCropperType>) => setFieldValue(evolve(patch, value)),
    [setFieldValue, value]
  )
  const roundedZoom = Math.round(value.transform.cropper.zoom * 100) / 100
  return (
    <div className='grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-sm'>
      <label htmlFor={`${id}-zoom`} className='[&>svg]:h-4 [&>svg]:w-4'>
        <Scaling aria-hidden />
        <Ui.SrOnly>{_("zoom")}</Ui.SrOnly>
      </label>
      <Ui.Slider
        id={`${id}-zoom`}
        value={[value.transform.cropper.zoom]}
        onValueChange={([value]: [number]) => setPartial({ transform: { cropper: { zoom: value } } })}
        min={1}
        max={3}
        step={0.01}
        className='grow'
      />
      <div className='grid w-28'>
        <InputQuantity
          id={`${id}-zoom`}
          className={cx(variants.input({ size: "xs" }))}
          type='number'
          value={roundedZoom}
          min={1}
          step={0.01}
          size='xs'
          onValueChange={(value) => setPartial({ transform: { cropper: { zoom: value } } })}
        />
      </div>
    </div>
  )
}

/**
 * RatioIcon
 */
const RatioIcon: React.FC<{ className: string }> = ({ className }) => (
  <span className={cx("inline-block h-3 border-[1.5px] border-current", className)} aria-hidden />
)

/**
 * types
 */
export type FormCropperType = {
  url: string | null
  isChange: boolean
  transform: FormMediasTransform
}

/**
 * helpers
 */
// Fonction pour calculer le PGCD
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b)
}

// Fonction pour obtenir le ratio d'une image
const getImageAspect = (width: number, height: number) => {
  const divisor = gcd(width, height)
  return {
    w: width / divisor,
    h: height / divisor,
  }
}
const compareCropper = (a: FormMediasTransform["cropper"], b: FormMediasTransform["cropper"]) => {
  return a.aspect.w === b.aspect.w && a.aspect.h === b.aspect.h && a.crop.x === b.crop.x && a.crop.y === b.crop.y
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    width: "Width",
    height: "Height",
    reverse: "Reverse width and height",
    "toggle-4-3": "Toggle 4:3 ratio",
    "toggle-16-9": "Toggle 16:9 ratio",
    "toggle-1-1": "Toggle 1:1 ratio",
    rotation: "Rotation",
    zoom: "Zoom",
  },
  fr: {
    width: "Largeur",
    height: "Hauteur",
    reverse: "Inverser largeur et hauteur",
    "toggle-4-3": "Basculer 4:3",
    "toggle-16-9": "Basculer 16:9",
    "toggle-1-1": "Basculer 1:1",
    rotation: "Rotation",
    zoom: "Zoom",
  },
  de: {
    width: "Breite",
    height: "Höhe",
    reverse: "Breite und Höhe umkehren",
    "toggle-4-3": "4:3 umstellen",
    "toggle-16-9": "16:9 umstellen",
    "toggle-1-1": "1:1 umstellen",
    rotation: "Rotation",
    zoom: "Zoom",
  },
} satisfies Translation
