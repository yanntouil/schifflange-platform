import { Dashboard } from "@compo/dashboard"
import {
  Form,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, D, F, G, N, cx, cxm, delay, humanFileSize, makeBreakable, match } from "@compo/utils"
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { FilePlus, ImageDown, ImageMinus, Info } from "lucide-react"
import React from "react"
import { FilesType } from "../../types"
import { FileInfoDialog } from "../dialogs/file-info"
import { FilePreview } from "../files/icon"
import { SelectFilesDialog } from "../files/select"

/**
 * FormMediaFiles
 */
type FormMediaFilesProps = FieldMediaFilesProps & {
  noWrapper?: boolean
} & FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormMediaFiles: React.FC<FormMediaFilesProps> = ({
  classNames,
  className,
  noWrapper = false,
  ...props
}) =>
  noWrapper ? (
    <Form.Fields name={props.name}>
      <FieldMediaFiles {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </Form.Fields>
  ) : (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldMediaFiles {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </FormGroup>
  )

/**
 * FieldMediaFiles
 */
type FieldMediaFilesProps = {
  ratio?: string
  className?: string
  fit?: string
  persistedKey?: string
  type?: FilesType
  max?: number
}
const FieldMediaFiles: React.FC<FieldMediaFilesProps> = ({ ...props }) => {
  const { setFieldValue, value, id } = useFieldContext<Api.MediaFileWithRelations[]>()
  return <InputMediaFiles value={value} onValueChange={setFieldValue} id={id} {...props} />
}

/**
 * MediaFilesInput
 */
type InputMediaFilesProps = FieldMediaFilesProps & {
  value: Api.MediaFileWithRelations[]
  onValueChange: (value: Api.MediaFileWithRelations[]) => void
  onOpenChange?: (open: boolean) => void
  id?: string
}
const InputMediaFiles: React.FC<InputMediaFilesProps> = ({
  className,
  persistedKey,
  value,
  onValueChange,
  id,
  onOpenChange = F.ignore,
  type,
  max = Infinity,
}) => {
  const { _ } = useTranslation(dictionnary)

  // display file info dialog
  const [onOpenInfo, fileInfoProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>()

  // add files
  const [selectFile, selectFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  const onSelect = (files: Api.MediaFileWithRelations[]) => {
    // check if files is already in the list before append
    const valueIds = A.map(value, D.prop("id"))
    onValueChange(
      A.take([...value, ...A.filter(files, (file) => !valueIds.includes(file.id))], max) as Api.MediaFileWithRelations[]
    )
  }

  // remove a file
  const onRemove = (file: Api.MediaFileWithRelations) => {
    onValueChange(A.reject(value, ({ id }) => id === file.id) as Api.MediaFileWithRelations[])
    delay(10).then(() => focusRef.current?.focus())
  }

  // replace a file by another
  const [replaceFile, replaceFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => setFocusId(replaceId),
    onOpenChange,
  })
  const [replaceId, setReplaceId] = React.useState<string | null>(null)
  const onChange = (file: Api.MediaFileWithRelations) => {
    setReplaceId(file.id)
    replaceFile(true)
  }
  const replaceBy = (files: Api.MediaFileWithRelations[]) => {
    replaceFileProps.close()
    const originalId = replaceId
    setReplaceId(null)
    const replacement = A.head(files)
    if (G.isNullable(replacement)) return
    onValueChange(A.map(value, (file) => (file.id === originalId ? replacement : file)) as Api.MediaFileWithRelations[])
    setFocusId(replacement.id)
  }

  // drag and drop reordering
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (active.id !== over?.id) {
        const oldIndex = A.getIndexBy(value, ({ id }) => id === active.id)
        const newIndex = A.getIndexBy(value, ({ id }) => id === over!.id)
        if (G.isNullable(oldIndex) || G.isNullable(newIndex)) return
        onValueChange(arrayMove(value, oldIndex, newIndex))
      }
    },
    [value, onValueChange]
  )

  // keyboard accessibility reordering
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, file: Api.MediaFileWithRelations) => {
      const keyCode = e.key
      if (!A.includes(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], keyCode)) return
      e.preventDefault()
      const index = A.getIndexBy(value, ({ id }) => id === file.id)
      if (G.isNullable(index)) return
      const newIndex = match(keyCode)
        .with("ArrowUp", () => (index - 1 < 0 ? null : index - 1))
        .with("ArrowDown", () => (index + 1 >= value.length ? null : index + 1))
        .with("ArrowLeft", () => (index - 1 < 0 ? null : index - 1))
        .with("ArrowRight", () => (index + 1 >= value.length ? null : index + 1))
        .otherwise(() => null)
      if (G.isNullable(newIndex)) return
      onValueChange(arrayMove(value, index, newIndex))
    },
    [value, onValueChange]
  )

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const focusRef = React.useRef<HTMLButtonElement>(null)
  const [focusId, setFocusId] = React.useState<string | null>(null)

  const multiple = N.gt(max, 1)

  return (
    <div className={cxm(className)}>
      <ul className='grid grid-cols-1 gap-2'>
        {multiple ? (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={value} strategy={rectSortingStrategy}>
              {A.map(value, (file) => (
                <MediaFile
                  key={file.id}
                  {...{ file, max, onChange, onRemove, onKeyDown, onOpenInfo, focusId, setFocusId }}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          A.map(value, (file) => (
            <MediaFile
              key={file.id}
              {...{ file, max, onChange, onRemove, onKeyDown, onOpenInfo, focusId, setFocusId }}
            />
          ))
        )}
        {N.lt(A.length(value), max) && (
          <li>
            <button
              ref={focusRef}
              className={cxm(variants.buttonField({ className: "h-12 w-full" }))}
              id={id}
              type='button'
              onClick={() => selectFile(true)}
            >
              <FilePlus className='size-6 stroke-[1.3]' aria-hidden />
              <Ui.SrOnly>{_("add")}</Ui.SrOnly>
            </button>
          </li>
        )}
      </ul>
      <SelectFilesDialog
        {...selectFileProps}
        type={type}
        onSelect={onSelect}
        persistedKey={persistedKey}
        hiddenIds={A.map(value, D.prop("id")) as string[]}
        multiple
      />
      <SelectFilesDialog
        {...replaceFileProps}
        type={type}
        onSelect={replaceBy}
        persistedKey={persistedKey}
        hiddenIds={A.map(value, D.prop("id")) as string[]}
      />
      <FileInfoDialog {...fileInfoProps} />
    </div>
  )
}

/**
 * MediaFile
 */
type MediaFileProps = {
  file: Api.MediaFileWithRelations
  max: number
  focusId: string | null
  setFocusId: (fileId: string | null) => void
  onChange: (file: Api.MediaFileWithRelations) => void
  onRemove: (file: Api.MediaFileWithRelations) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, file: Api.MediaFileWithRelations) => void
  onOpenInfo: (file: Api.MediaFileWithRelations) => void
}
const MediaFile: React.FC<MediaFileProps> = ({
  file,
  max,
  focusId,
  setFocusId,
  onChange,
  onRemove,
  onKeyDown,
  onOpenInfo,
}) => {
  const { _ } = useTranslation(dictionnary)
  const { translate } = useLanguage()
  const translated = translate(file, servicePlaceholder.mediaFile)

  const multiple = N.gt(max, 1)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.id,
  })
  const style = multiple ? { transform: CSS.Transform.toString(transform), transition } : undefined

  const focusRef = React.useRef<HTMLButtonElement>(null)

  // focus on the image when focus is ask from the parent
  React.useEffect(() => {
    if (focusId === file.id) {
      focusRef.current?.focus()
      setFocusId(null)
    }
  }, [focusId, file.id, setFocusId])

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cx(
        "bg-card relative flex items-center gap-4 border p-2 transition-all select-none",
        multiple && isDragging ? "z-20 opacity-75" : "z-10 opacity-100"
      )}
    >
      {multiple && (
        <button
          className={cx("absolute inset-0 h-full w-full rounded-md", variants.focus())}
          {...listeners}
          {...attributes}
          type='button'
          onKeyDown={(e) => onKeyDown(e, file)}
        >
          <Ui.SrOnly>{_("drag")}</Ui.SrOnly>
        </button>
      )}
      <FilePreview file={file} />
      <Dashboard.Row.Header>
        <Dashboard.Row.Title className='line-clamp-1'>{makeBreakable(translated.name, 5)}</Dashboard.Row.Title>
        <Dashboard.Row.Description>
          {humanFileSize(file.size)} - {file.extension}
        </Dashboard.Row.Description>
      </Dashboard.Row.Header>
      <Dashboard.Row.Menu
        className='relative'
        menu={
          <>
            <Ui.Menu.Item onClick={() => onOpenInfo(file)}>
              <Info aria-hidden />
              {_("info")}
            </Ui.Menu.Item>
            <Ui.Menu.Item onClick={() => onRemove(file)}>
              <ImageMinus aria-hidden />
              {_("remove")}
            </Ui.Menu.Item>
            <Ui.Menu.Item onClick={() => onChange(file)}>
              <ImageDown aria-hidden />
              {_("change")}
            </Ui.Menu.Item>
          </>
        }
      />
    </li>
  )
}

const dictionnary = {
  fr: {
    add: "Ajouter un fichier",
    drag: "Déplacer le fichier",
    info: "Informations sur le fichier",
    remove: "Supprimer le fichier",
    change: "Changer le fichier",
    more: "Plus d'options",
  },
  en: {
    add: "Add a file",
    change: "Change file",
    remove: "Remove file",
    info: "File information",
    more: "More options",
  },
  de: {
    add: "Datei hinzufügen",
    change: "Datei ändern",
    remove: "Datei entfernen",
    info: "Dateiinformationen",
    more: "Mehr Optionen",
  },
}
