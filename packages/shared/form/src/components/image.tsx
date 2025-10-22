import { acceptToInputAccept, checkExtFromFile, formatExtList, getSizeFromFile, useDropZone } from "@compo/hooks"
import { Interpolate, Translation, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { A, G, cxm, pipe } from "@compo/utils"
import { ImageOff, MoreHorizontal, X } from "lucide-react"
import React from "react"
import selectFiles from "select-files-capture"
import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  FormSimpleFileType,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "."
import { config } from "../config"

/**
 * default config
 */
const defaultAccept = config.acceptImageExtensions
const defaultAspect = "aspect-video"
const defaultFit = "object-cover"

/**
 * FormImage
 */
export type FormImageProps = ImageInputProps &
  Omit<FormGroupProps, "classNames"> & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormImage: React.FC<FormImageProps> = ({ ...props }) => (
  <FormGroup {...extractGroupProps(props)}>
    <ImageInput {...extractInputProps<FormGroupProps>(props)} className={props.classNames?.input} />
  </FormGroup>
)

/**
 * FormInputImage
 */
type ImageInputProps = React.ComponentProps<"div"> & {
  aspect?: string
  placeholder?: string
  disabled?: boolean
  fit?: string
  accept?: string[]
  min?: number
  max?: number
}
const ImageInput = React.forwardRef<HTMLDivElement, ImageInputProps>((props, ref) => {
  const { _ } = useTranslation(dictionary)
  const {
    aspect = defaultAspect,
    fit = defaultFit,
    accept = defaultAccept,
    min = 0,
    max = config.maxUploadFile,
    placeholder = _("placeholder"),
    className,
    children,
    ...rest
  } = props
  const { setFieldValue, value, name, id, disabled: disabledField } = useFieldContext<FormSimpleFileType>()
  const disabled = props.disabled || disabledField

  // drop files handler
  const onDropFiles = (files: File[]) => {
    const file = A.head(files)
    if (G.isNullable(file)) return
    setFieldValue({ ...value, file })
  }

  // click on drop zone handler
  const onClickDropZone = async (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    const fileList = await selectFiles({ accept: acceptToInputAccept(accept) })
    const allFiles = fileList ? Array.from(fileList) : []
    const files = A.slice(allFiles, 0, 1)
    if (!A.some(files, (file) => min <= getSizeFromFile(file) && max >= getSizeFromFile(file)))
      return onError("TOOLARGE")
    if (!A.some(files, (file) => checkExtFromFile(file, accept))) return onError("UNACCEPTED")
    onDropFiles(files)
  }

  // click on remove button handler
  const onClickRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (G.isNotNullable(value.file)) return setFieldValue({ ...value, file: null, delete: false })
    setFieldValue({ ...value, file: null, delete: true })
  }

  // handle when file is not accepted or too large
  const onError = (code: "UNACCEPTED" | "TOOLARGE") => {
    Ui.toast.error(_(code))
  }

  // prepare drop zone
  const { bindDropZone, dragOver } = useDropZone({
    accept,
    min,
    max,
    multiple: false,
    onDropFiles,
    onError,
  })

  // memo formated extensions from props
  const acceptedExtensions = React.useMemo(() => formatExtList(accept), [accept])

  // memo image path from file url or url
  const imagePath = React.useMemo(() => {
    if (G.isNotNullable(value.file)) return URL.createObjectURL(value.file)
    if (value.delete) return null
    return value.url
  }, [value])

  return (
    <div
      className={cxm(
        "relative flex w-full items-center justify-center",
        "rounded-sm",
        variants.inputRounded(),
        variants.inputBorder({ variant: "dashed" }),
        variants.inputBackground({ active: dragOver }),
        variants.inputShadow(),
        variants.focusWithin(),
        aspect,
        "transition-colors duration-200 ease-in-out",
        dragOver && "border-primary",
        className
      )}
      ref={ref}
      {...bindDropZone}
      {...rest}
    >
      {G.isNotNullable(imagePath) ? (
        <>
          <div className='absolute inset-0' aria-hidden>
            <Ui.Image src={imagePath} className={cxm("h-full w-full rounded-sm bg-muted", fit)}>
              <ImageOff strokeWidth={0.8} className='size-1/4 text-muted-foreground' />
            </Ui.Image>
          </div>
          {!disabled && (
            <>
              <Ui.Button variant='overlay' size='xxs' icon className='absolute right-2 top-2' onClick={onClickRemove}>
                <X size={16} aria-hidden aria-label={_("button-delete")} />
              </Ui.Button>
              <Ui.Button
                className='absolute bottom-2 right-2'
                variant='overlay'
                id={id}
                size='xxs'
                onClick={onClickDropZone}
              >
                {_("button-change")}
              </Ui.Button>
            </>
          )}
        </>
      ) : children ? (
        <button
          type='button'
          className='flex size-full items-center justify-center outline-none'
          onClick={onClickDropZone}
        >
          {children}
        </button>
      ) : (
        <div className='space-x-1.5 p-4 text-center leading-tight text-muted-foreground'>
          <p className='text-sm'>
            <Interpolate
              text={placeholder}
              replacements={{
                browse: (children) => (
                  <button id={id} type='button' className={variants.link()} onClick={onClickDropZone}>
                    {children}
                  </button>
                ),
              }}
            />
          </p>
          <p className='text-xs'>
            <Interpolate
              text={_("accept")}
              replacements={{
                extensions: (children) => (
                  <>
                    {pipe(acceptedExtensions, A.take(5), A.join(", "))}
                    {acceptedExtensions.length > 5 && (
                      <>
                        <Ui.Tooltip.Quick tooltip={`${children} ${A.join(acceptedExtensions, ", ")}`}>
                          <MoreHorizontal className='ml-1.5 inline-block size-3' />
                        </Ui.Tooltip.Quick>
                      </>
                    )}
                  </>
                ),
              }}
            />
          </p>
        </div>
      )}
    </div>
  )
})

/**
 * dictionaries
 */
const dictionary = {
  fr: {
    placeholder: "Glissez-déposez ou {{browse:parcourir les fichiers}} pour télécharger",
    "button-change": "Changer l'image",
    "button-delete": "Supprimer l'image",
    accept: "Extensions supportées : {{extensions:Liste complète des extensions supportées}}",
    UNACCEPTED: "L'extension du fichier n'est pas acceptée",
    TOOLARGE: "Le fichier est trop volumineux pour être téléchargé",
  },
  en: {
    placeholder: "Drag and drop or {{browse:browse files}} to upload",
    "button-change": "Change image",
    "button-delete": "Delete image",
    accept: "Supported extensions: {{extensions:List of supported extensions}}",
    UNACCEPTED: "The file extension is not supported",
    TOOLARGE: "The file is too large to be uploaded",
  },
  de: {
    placeholder: "Ziehen Sie Ihre Dateien hierher oder {{button:durchsuchen}} Ihre Dateien.",
    "button-change": "Bild ändern",
    "button-delete": "Bild löschen",
    accept: "Unterstützte Dateitypen: {{extensions:Liste der unterstützten Dateitypen}}",
    UNACCEPTED: "Die Dateierweiterung ist nicht unterstützt",
    TOOLARGE: "Die Datei ist zu groß zum Hochladen",
  },
} satisfies Translation
