import {
  Form,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "@compo/form"
import { useIsMobile } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, D, F, G, cx, cxm, delay, match } from "@compo/utils"
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { ImageDown, ImageMinus, ImagePlus, Info, MoreVertical } from "lucide-react"
import React from "react"
import { FileInfoDialog } from "../dialogs"
import { SelectFilesDialog } from "../files"

/**
 * FormMediaImages
 */
export type FormMediaImagesProps = FieldMediaImagesProps & {
  noWrapper?: boolean
} & FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormMediaImages: React.FC<FormMediaImagesProps> = ({
  classNames,
  className,
  noWrapper = false,
  ...props
}) =>
  noWrapper ? (
    <Form.Fields name={props.name}>
      <FieldMediaImages {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </Form.Fields>
  ) : (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldMediaImages {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </FormGroup>
  )

/**
 * FieldMediasImages
 */
type FieldMediaImagesProps = {
  ratio?: string
  className?: string
  fit?: string
  persistedKey?: string
}
const FieldMediaImages: React.FC<FieldMediaImagesProps> = ({ ...props }) => {
  const { setFieldValue, value, id } = useFieldContext<Api.MediaFileWithRelations[]>()
  return <InputMediaImages value={value} onValueChange={setFieldValue} id={id} {...props} />
}

/**
 * InputMediasImages
 */
type InputMediaImagesProps = FieldMediaImagesProps & {
  value: Api.MediaFileWithRelations[]
  onValueChange: (value: Api.MediaFileWithRelations[]) => void
  onOpenChange?: (open: boolean) => void
  id?: string
}
const InputMediaImages: React.FC<InputMediaImagesProps> = ({
  className,
  persistedKey,
  value,
  onValueChange,
  id,
  onOpenChange = F.ignore,
}) => {
  const { _ } = useTranslation(dictionnary)

  // display file info dialog
  const [onOpenInfo, fileInfoProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>()

  // add images
  const [selectFile, selectFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  const onSelect = (files: Api.MediaFileWithRelations[]) => {
    // check if files is already in the list before append
    const valueIds = A.map(value, D.prop("id"))
    onValueChange([...value, ...A.filter(files, (file) => !valueIds.includes(file.id))])
  }

  // remove an image
  const onRemove = (file: Api.MediaFileWithRelations) => {
    onValueChange(A.reject(value, ({ id }) => id === file.id) as Api.MediaFileWithRelations[])
    delay(10).then(() => focusRef.current?.focus())
  }

  // replace an image by another
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
  const isMobile = useIsMobile()
  const byRow = isMobile ? 2 : 3

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
        .with("ArrowUp", () => (index - byRow < 0 ? null : index - byRow))
        .with("ArrowDown", () => (index + byRow >= value.length ? null : index + byRow))
        .with("ArrowLeft", () => (index - 1 < 0 ? null : index - 1))
        .with("ArrowRight", () => (index + 1 >= value.length ? null : index + 1))
        .otherwise(() => null)
      if (G.isNullable(newIndex)) return
      onValueChange(arrayMove(value, index, newIndex))
    },
    [value, onValueChange, byRow]
  )

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const focusRef = React.useRef<HTMLButtonElement>(null)
  const [focusId, setFocusId] = React.useState<string | null>(null)

  return (
    <div className={cxm(className)}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={value} strategy={rectSortingStrategy}>
          <ul className='grid grid-cols-3 gap-2'>
            {A.map(value, (file) => (
              <MediaImage key={file.id} {...{ file, onChange, onRemove, onKeyDown, onOpenInfo, focusId, setFocusId }} />
            ))}
            <li className='aspect-square max-h-full w-auto max-w-full'>
              <button
                ref={focusRef}
                className={cxm(variants.buttonField({ className: "size-full" }))}
                id={id}
                type='button'
                onClick={() => selectFile(true)}
              >
                <ImagePlus className='size-12 stroke-[0.8]' aria-hidden />
                <Ui.SrOnly>{_("add")}</Ui.SrOnly>
              </button>
            </li>
          </ul>
        </SortableContext>
      </DndContext>
      <SelectFilesDialog
        {...selectFileProps}
        type='image'
        onSelect={onSelect}
        persistedKey={persistedKey}
        disabledIds={A.map(value, D.prop("id")) as string[]}
        multiple
      />
      <SelectFilesDialog
        {...replaceFileProps}
        type='image'
        onSelect={replaceBy}
        persistedKey={persistedKey}
        disabledIds={A.map(value, D.prop("id")) as string[]}
      />
      <FileInfoDialog {...fileInfoProps} />
    </div>
  )
}

/**
 * MediaImage
 */
type MediaImageProps = {
  file: Api.MediaFileWithRelations
  focusId: string | null
  setFocusId: (fileId: string | null) => void
  onChange: (file: Api.MediaFileWithRelations) => void
  onRemove: (file: Api.MediaFileWithRelations) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, file: Api.MediaFileWithRelations) => void
  onOpenInfo: (file: Api.MediaFileWithRelations) => void
}
const MediaImage: React.FC<MediaImageProps> = ({
  file,
  focusId,
  setFocusId,
  onChange,
  onRemove,
  onKeyDown,
  onOpenInfo,
}) => {
  const { _ } = useTranslation(dictionnary)
  const { translate } = useLanguage()
  const {
    service: { getImageUrl },
  } = useDashboardService()
  const translated = translate(file, servicePlaceholder.mediaFile)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

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
        "border-input relative flex aspect-square max-h-full w-auto max-w-full items-center justify-center rounded-md border transition-opacity",
        isDragging ? "z-20 opacity-75" : "opacity-100"
      )}
    >
      <Ui.Image
        src={getImageUrl(file, "thumbnail") ?? ""}
        alt={translated.name}
        classNames={{ wrapper: "size-full rounded-md" }}
        className={cx("size-full rounded-md object-cover object-center")}
      />

      <button
        className={cx("absolute inset-0 h-full w-full rounded-md", variants.focus())}
        {...listeners}
        {...attributes}
        type='button'
        onKeyDown={(e) => onKeyDown(e, file)}
      >
        <Ui.SrOnly>{_("drag")}</Ui.SrOnly>
      </button>

      <Ui.DropdownMenu.Quick
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
        align='start'
        side='left'
      >
        <Ui.Button ref={focusRef} variant='overlay' size='xxs' icon className='absolute top-2 right-2'>
          <MoreVertical aria-hidden />
          <Ui.SrOnly>{_("more")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.DropdownMenu.Quick>
    </li>
  )
}

const dictionnary = {
  fr: {
    add: "Ajouter une image",
    drag: "Déplacer l'image",
    info: "Informations sur le fichier",
    remove: "Supprimer l'image",
    change: "Changer l'image",
    more: "Plus d'options",
  },
  en: {
    add: "Add an image",
    change: "Change image",
    remove: "Remove image",
    info: "File information",
    more: "More options",
  },
  de: {
    add: "Bild hinzufügen",
    change: "Bild ändern",
    remove: "Bild entfernen",
    info: "Dateiinformationen",
    more: "Mehr Optionen",
  },
}
