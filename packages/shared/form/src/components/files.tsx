import { acceptToInputAccept, checkExtFromFile, formatExtList, getSizeFromFile, useDropZone } from "@compo/hooks"
import { Interpolate, Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, humanFileSize, truncateMiddle } from "@compo/utils"
import { A } from "@mobily/ts-belt"
import { saveAs } from "file-saver"
import { Download, X } from "lucide-react"
import React from "react"
import selectFiles from "select-files-capture"
import { Form } from "use-a11y-form"
import {
  FormFileType,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  isFile,
  isImage,
  isSynteticFile,
  normalizeFormFile,
  useFieldContext,
} from "."
import { config } from "../config"

/**
/**
 * FormFiles
 */
export type FormFilesProps = Omit<FieldInputFilesProps, "classNames"> &
  FormGroupProps & {
    classNames?: FormGroupClassNames<FieldInputFilesProps["classNames"]>
  }
export const FormFiles = React.forwardRef<HTMLButtonElement, FormFilesProps>(({ classNames, ...props }, ref) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldInputFiles {...extractInputProps({ ...props })} ref={ref} classNames={classNames} />
    </FormGroup>
  )
})

/**
 * FieldInputFiles
 */
type FieldInputFilesProps = Omit<React.ComponentProps<typeof Form.Input>, "accept"> & {
  accept?: string[]
  min?: number
  max?: number
  multiple?: boolean
  classNames?: {
    wrapper?: string
    dropZone?: string
  } & DropInnerProps["classNames"]
}
const FieldInputFiles = React.forwardRef<HTMLButtonElement, FieldInputFilesProps>(
  (
    { accept = config.acceptedFileExtensions, min = 0, max = config.maxUploadFile, multiple = true, classNames },
    ref
  ) => {
    const { _ } = useTranslation(dictionary)
    const { setFieldValue, value, id } = useFieldContext<FormFileType[]>()

    // manage file picker and drop zone
    const onDropFiles = (files: File[]) => {
      if (A.isNotEmpty(files)) {
        multiple ? setFieldValue([...value, ...files]) : setFieldValue(files)
      }
    }
    const onError = (code: "TOOLARGE" | "UNACCEPTED") => {
      Ui.toast.error(_(code))
    }
    const onClickDropZone = async () => {
      const fileList = await selectFiles({ accept: acceptToInputAccept(accept), multiple })
      const files = fileList ? Array.from(fileList) : []
      if (!A.some(files, (file) => min <= getSizeFromFile(file) && max >= getSizeFromFile(file)))
        return onError("TOOLARGE")
      if (!A.some(files, (file) => checkExtFromFile(file, accept))) return onError("UNACCEPTED")
      onDropFiles(files)
    }
    const { bindDropZone, dragOver } = useDropZone({
      accept,
      min,
      max,
      multiple,
      onDropFiles,
      onError,
    })

    // manage files
    const removeFile = (index: number) => {
      const current = A.getUnsafe(value, index)
      if (isSynteticFile(current)) {
        return setFieldValue(A.replaceAt(value, index, { ...current, delete: true }))
      }
      setFieldValue(A.removeAt(value, index))
    }

    return (
      <div className={cxm("flex flex-col gap-2", classNames?.wrapper)}>
        <div
          className={cxm(
            "relative flex w-full items-center justify-center rounded-md",
            "focus-within:border-accent-dark border border-dashed border-input transition-colors",
            dragOver ? "border-accent-dark bg-accent/5" : "bg-card",
            classNames?.dropZone
          )}
          {...bindDropZone}
        >
          <DropInner ref={ref} {...{ id, accept, min, max, onClickDropZone }} classNames={classNames} />
        </div>
        <FilesList files={value} removeFile={removeFile} />
      </div>
    )
  }
)

/**
 * DropInner
 */
type DropInnerProps = {
  id: string
  accept: string[]
  min?: number
  max: number
  multiple?: boolean
  onClickDropZone: React.MouseEventHandler<HTMLButtonElement>
  classNames?: {
    inner?: string
    placeholder?: string
    browse?: string
    secondary?: string
    accepted?: {
      trigger?: string
      content?: string
      title?: string
      list?: string
    }
  }
}
const DropInner = React.forwardRef<HTMLButtonElement, DropInnerProps>(
  ({ id, onClickDropZone, max, accept, classNames }, ref) => {
    const { _ } = useTranslation(dictionary)
    const acceptedExtensions = React.useMemo(() => formatExtList(accept), [accept])
    return (
      <div className={cxm("flex min-h-[10rem] flex-col items-center justify-center gap-1 p-4", classNames?.inner)}>
        <p className={cxm("text-sm max-sm:text-center", classNames?.placeholder)}>
          <Interpolate
            text={_("placeholder")}
            replacements={{
              button: (content) => (
                <Ui.Button
                  variant='link'
                  size='leading'
                  onClick={onClickDropZone}
                  className={classNames?.browse}
                  ref={ref}
                  id={id}
                >
                  {content}
                </Ui.Button>
              ),
            }}
          />
        </p>
        <p className={cxm("text-xs text-muted-foreground max-sm:text-center", classNames?.secondary)}>
          <Interpolate
            text={_("secondary")}
            replacements={{
              maxsize: () => <strong>{humanFileSize(max)}</strong>,
              accepted: (content) => (
                <Ui.Popover.Root>
                  <Ui.Popover.Trigger asChild>
                    <Ui.Button variant='link' size='leading' className={classNames?.accepted?.trigger}>
                      {content}
                    </Ui.Button>
                  </Ui.Popover.Trigger>
                  <Ui.Popover.Content className={cxm("w-full max-w-sm", classNames?.accepted?.content)}>
                    <p className={cxm("inline-block pb-2 text-base font-medium", classNames?.accepted?.title)}>
                      {_("accept-extensions")}
                    </p>
                    <p className={cxm("text-sm text-muted-foreground", classNames?.accepted?.list)}>
                      {A.join(acceptedExtensions, ", ")}
                    </p>
                  </Ui.Popover.Content>
                </Ui.Popover.Root>
              ),
            }}
          />
        </p>
      </div>
    )
  }
)

/**
 * FilesList
 */
type FilesListProps = {
  files: FormFileType[]
  removeFile: (index: number) => void
}
const FilesList: React.FC<FilesListProps> = ({ files, removeFile }) => {
  return A.isNotEmpty(files) ? (
    <Ui.AnimateHeight>
      <div className='flex flex-col gap-2'>
        {A.mapWithIndex(files, (index, formFile) => (
          <FilesItem formFile={formFile} remove={() => removeFile(index)} key={index} />
        ))}
      </div>
    </Ui.AnimateHeight>
  ) : null
}

/**
 * FilesItem
 */
type FilesItemProps = {
  formFile: FormFileType
  remove: React.MouseEventHandler<HTMLButtonElement>
}
const FilesItem: React.FC<FilesItemProps> = ({ formFile, remove }) => {
  const { _ } = useTranslation(dictionary)
  const file = normalizeFormFile(formFile)
  return file.delete === false ? (
    <div className='grid w-full grid-cols-[auto_1fr_auto] gap-x-4 rounded-sm border border-transparent p-2.5 transition-colors duration-300 ease-in-out focus-within:border-muted/30 focus-within:bg-muted/10 hover:border-muted/30 hover:bg-muted/10'>
      <FilePreview file={formFile} />
      <div className='flex flex-col justify-center space-y-1.5'>
        <p className='font-base text-sm/none'>{truncateMiddle(file.name, 36)}</p>
        <p className='flex items-center gap-2 text-xs/4 text-muted-foreground'>
          {humanFileSize(file.size)}
          {isSynteticFile(formFile) || (
            <Ui.Button variant='link' size='leading' className='size-4' onClick={() => saveAs(file.url, file.name)}>
              <Download aria-hidden className='size-3' />
              <Ui.SrOnly>{_("download-file", { file: file.name })}</Ui.SrOnly>
            </Ui.Button>
          )}
        </p>
      </div>
      <div className='block'>
        <Ui.Button variant='ghost' icon size='xs' onClick={remove}>
          <X aria-hidden />
          <Ui.SrOnly>{_("remove-file", { file: file.name })}</Ui.SrOnly>
        </Ui.Button>
      </div>
    </div>
  ) : null
}

/**
 * FileIcon
 */
type FilePreviewProps = {
  file: FormFileType
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  // Utiliser l'extension pour déterminer le type de fichier
  const fileExtension = React.useMemo(() => {
    if (isFile(file)) return file.name.split(".").pop()?.toLowerCase() ?? ""
    return file.extension
  }, [file])

  // display preview image
  if (isImage(file)) {
    return (
      <Ui.Image
        src={isFile(file) ? URL.createObjectURL(file) : file.url}
        alt={file.name}
        className='h-10 w-10 rounded object-cover object-center'
      />
    )
  }
  // display file icon
  const { background, foreground, icon } = Ui.getExtensionColors(fileExtension) || {}
  return (
    <div
      className='relative flex size-10 items-center justify-center rounded pb-1'
      style={{ backgroundColor: background, color: foreground }}
    >
      {Ui.isFileExtensionIcon(fileExtension) && (
        <Ui.FileIcon extension={fileExtension} style={{ color: icon }} className='size-4 stroke-[1]' />
      )}
      <div className='absolute bottom-0 left-0 right-0 flex items-center justify-center text-[9px]/[1.6] font-medium'>
        {fileExtension}
      </div>
    </div>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    placeholder: "Drag and drop your files here or {{button:browse}} your files.",
    secondary: "(max file size: {{maxsize:size}}, {{accepted:list of accepted file types}})",
    "download-file": "Download {{file}}",
    "remove-file": "Remove {{file}}",
    "accept-extensions": "List of accepted extensions:",
    TOOLARGE: "The file is too big.",
    UNACCEPTED: "The file type is not allowed.",
  },
  fr: {
    placeholder: "Déposez vos fichiers ici ou {{button:parcourir}} vos fichiers.",
    secondary: "(taille maximale du fichier: {{maxsize:size}}, {{accepted:liste des types de fichiers acceptés}})",
    "download-file": "Télécharger {{file}}",
    "remove-file": "Supprimer {{file}}",
    "accept-extensions": "Liste des extensions acceptées:",
    TOOLARGE: "Le fichier est trop grand.",
    UNACCEPTED: "Le type de fichier n'est pas autorisé.",
  },
  de: {
    placeholder: "Ziehen Sie Ihre Dateien hierher oder {{button:durchsuchen}} Ihre Dateien.",
    secondary: "(Maximale Dateigröße: {{maxsize:size}}, {{accepted:Liste der akzeptierten Dateitypen}})",
    "download-file": "Datei {{file}} herunterladen",
    "remove-file": "Datei {{file}} entfernen",
    "accept-extensions": "Liste der akzeptierten Dateitypen:",
    TOOLARGE: "Die Datei ist zu groß.",
    UNACCEPTED: "Der Dateityp ist nicht erlaubt.",
  },
} satisfies Translation
