import { FormGroupProps } from '@/components/forms/group'
import { FormFileType } from '@/components/forms/types'
import { isFile, isImage, isSynteticFile, normalizeFormFile } from '@/components/forms/utils'
import { Button } from '@/components/ui/button'
import { Translation, useTranslation } from '@/lib/localize'
import {
  acceptToInputAccept,
  checkExtFromFile,
  formatExtList,
  getSizeFromFile,
  useDropZone,
} from '@compo/hooks'
import { Interpolate } from '@compo/localize'

import { humanFileSize, truncateMiddle } from '@compo/utils'
import { A } from '@mobily/ts-belt'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { cx } from 'class-variance-authority'
import { saveAs } from 'file-saver'
import { Download, X } from 'lucide-react'
import { Popover } from 'radix-ui'
import React from 'react'
import selectFiles from 'select-files-capture'
import { Form, useFieldContext } from 'use-a11y-form'

/**
 * FormFiles
 */
export type FormFilesProps = Omit<FieldInputFilesProps, 'classNames'> &
  FormGroupProps & {
    // classNames?: FormGroupClassNames<FieldInputFilesProps['classNames']>
  }

// export const FormFiles = React.forwardRef<HTMLButtonElement, FormFilesProps>(
//   ({ classNames, ...props }, ref) => {
//     return (
//       <FormGroup {...extractGroupProps(props)} classNames={classNames}>
//         <FieldInputFiles {...extractInputProps({ ...props })} ref={ref} classNames={classNames} />
//       </FormGroup>
//     )
//   }
// )

/**
 * FieldInputFiles
 */
type FieldInputFilesProps = Omit<React.ComponentProps<typeof Form.Input>, 'accept'> & {
  accept: string[]
  min?: number
  max: number
  multiple?: boolean
  classNames?: {
    wrapper?: string
    dropZone?: string
  } & DropInnerProps['classNames']
}

export const FieldInputFiles = React.forwardRef<HTMLButtonElement, FieldInputFilesProps>(
  ({ accept, min = 0, max, multiple = true, classNames }, ref) => {
    const { _ } = useTranslation(dictionary)
    const { setFieldValue, value, id } = useFieldContext<FormFileType[]>()

    // manage file picker and drop zone
    const onDropFiles = (files: File[]) => {
      if (A.isNotEmpty(files)) {
        multiple ? setFieldValue([...value, ...files]) : setFieldValue(files)
      }
    }

    const onError = (code: 'TOOLARGE' | 'UNACCEPTED') => {
      // toas.error(_(code))
    }

    const onClickDropZone = async () => {
      const fileList = await selectFiles({ accept: acceptToInputAccept(accept), multiple })
      const files = fileList ? Array.from(fileList) : []
      if (!A.some(files, file => min <= getSizeFromFile(file) && max >= getSizeFromFile(file)))
        return onError('TOOLARGE')
      if (!A.some(files, file => checkExtFromFile(file, accept))) return onError('UNACCEPTED')
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
      <div className={cx('flex flex-col gap-2', classNames?.wrapper)}>
        <div
          className={cx(
            'relative flex w-full items-center justify-center rounded-[22px] bg-pampas',
            // dragOver ? 'border-accent-dark bg-accent/5' : 'bg-card',
            classNames?.dropZone
          )}
          {...bindDropZone}
        >
          <DropInner
            ref={ref}
            {...{ id, accept, min, max, onClickDropZone }}
            classNames={classNames}
          />
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
      <div className={cx('flex w-full justify-start gap-x-5 px-6 py-5', classNames?.inner)}>
        <button
          type='button'
          className='flex size-10 justify-center items-center rounded-lg bg-white icon:size-5 cursor-pointer'
          onClick={onClickDropZone}
        >
          <PlusIcon />
        </button>

        <div className='flex flex-col gap-1.5 flex-1'>
          <p className={cx('text-sm max-sm:text-center text-default/60', classNames?.placeholder)}>
            <Interpolate
              text={_('placeholder')}
              replacements={{
                button: content => (
                  <button
                    onClick={onClickDropZone}
                    type='button'
                    className={cx(
                      'text-default/90 underline underline-offset-2 cursor-pointer',
                      classNames?.browse
                    )}
                    ref={ref}
                    id={id}
                  >
                    {content}
                  </button>
                ),
              }}
            />
          </p>

          <p
            className={cx(
              'text-xs text-muted-foreground max-sm:text-center',
              classNames?.secondary
            )}
          >
            <Interpolate
              text={_('secondary')}
              replacements={{
                maxsize: () => <strong>{humanFileSize(max)}</strong>,
                accepted: content => (
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        className={cx(
                          'underline underline-offset-2 text-default/90 cursor-pointer',
                          classNames?.accepted?.trigger
                        )}
                      >
                        {content}
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        align='start'
                        sideOffset={6}
                        side='bottom'
                        className={cx(
                          'rounded-3xl bg-white shadow-lg w-[300px] py-3.5 px-5 z-50',
                          classNames?.accepted?.content
                        )}
                      >
                        <p
                          className={cx(
                            'inline-block pb-2 text-base font-medium',
                            classNames?.accepted?.title
                          )}
                        >
                          {_('accept-extensions')}
                        </p>
                        <p
                          className={cx(
                            'text-sm text-muted-foreground',
                            classNames?.accepted?.list
                          )}
                        >
                          {A.join(acceptedExtensions, ', ')}
                        </p>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                ),
              }}
            />
          </p>
        </div>
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
    <div className='flex flex-col gap-2 px-3.5 mt-1'>
      {A.mapWithIndex(files, (index, formFile) => (
        <FilesItem formFile={formFile} remove={() => removeFile(index)} key={index} />
      ))}
    </div>
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
    <div className='flex w-full items-center gap-x-3 rounded-[22px] px-3.5 py-3 border-(length:--thin) border-almond/50'>
      <div className='block'>
        <Button scheme='ghost' variant='icon' size='sm' onClick={remove}>
          <X aria-hidden />
          <span className='sr-only'>{_('remove-file', { file: file.name })}</span>
        </Button>
      </div>

      <div className='flex flex-col justify-center space-y-1.5 flex-1'>
        <p className='font-base text-sm/none'>{truncateMiddle(file.name, 36)}</p>
        <p className='flex items-center gap-2 text-xs/4 text-muted-foreground'>
          {humanFileSize(file.size)}
        </p>
      </div>
    </div>
  ) : null
}

/**
 * dictionaries
 */

const dictionary = {
  en: {
    placeholder: 'Drag and drop your files here or {{button:browse}} your files.',
    secondary: '(max file size: {{maxsize:size}}, {{accepted:list of accepted file types}})',
    'download-file': 'Download {{file}}',
    'remove-file': 'Remove {{file}}',
    'accept-extensions': 'List of accepted extensions:',
    TOOLARGE: 'The file is too big.',
    UNACCEPTED: 'The file type is not allowed.',
  },
  fr: {
    placeholder: 'Déposez vos fichiers ici ou {{button:parcourir}} vos fichiers.',
    secondary:
      '(taille maximale du fichier: {{maxsize:size}}, {{accepted:liste des types de fichiers acceptés}})',
    'download-file': 'Télécharger {{file}}',
    'remove-file': 'Supprimer {{file}}',
    'accept-extensions': 'Liste des extensions acceptées:',
    TOOLARGE: 'Le fichier est trop grand.',
    UNACCEPTED: "Le type de fichier n'est pas autorisé.",
  },
  de: {
    placeholder: 'Ziehen Sie Ihre Dateien hierher oder {{button:durchsuchen}} Ihre Dateien.',
    secondary:
      '(Maximale Dateigröße: {{maxsize:size}}, {{accepted:Liste der akzeptierten Dateitypen}})',
    'download-file': 'Datei {{file}} herunterladen',
    'remove-file': 'Datei {{file}} entfernen',
    'accept-extensions': 'Liste der akzeptierten Dateitypen:',
    TOOLARGE: 'Die Datei ist zu groß.',
    UNACCEPTED: 'Der Dateityp ist nicht erlaubt.',
  },
} satisfies Translation
