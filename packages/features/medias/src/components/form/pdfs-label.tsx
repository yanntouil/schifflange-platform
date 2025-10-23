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
import { A, D, F, G, O, cx, cxm, delay, match } from "@compo/utils"
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useElementSize } from "@reactuses/core"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { FileDown, FileMinus, FileText, Info, MoreVertical, Plus } from "lucide-react"
import React from "react"
import { FileInfoDialog } from "../dialogs/file-info"
import { SelectFilesDialog } from "../files/select"

/**
 * FormMediaPdfs
 */
type FormMediaPdfsProps = FieldMediaPdfsProps & {
  noWrapper?: boolean
} & FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormMediaPdfsLabel: React.FC<FormMediaPdfsProps> = ({
  classNames,
  className,
  noWrapper = false,
  ...props
}) =>
  noWrapper ? (
    <Form.Fields name={props.name}>
      <FieldMediaPdfs {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </Form.Fields>
  ) : (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldMediaPdfs {...extractInputProps({ ...props })} className={cx(classNames?.input, className)} />
    </FormGroup>
  )

/**
 * FieldMediaPdfs
 */
type FieldMediaPdfsProps = {
  ratio?: string
  className?: string
  persistedKey?: string
}
const FieldMediaPdfs: React.FC<FieldMediaPdfsProps> = ({ ...props }) => {
  const { setFieldValue, value, id } = useFieldContext<MediaFileWithLabel[]>()
  return <InputMediaPdfs value={value} onValueChange={setFieldValue} id={id} {...props} />
}

/**
 * InputMediasPdfs
 */
type InputMediaPdfsProps = FieldMediaPdfsProps & {
  value: MediaFileWithLabel[]
  onValueChange: (value: MediaFileWithLabel[]) => void
  onOpenChange?: (open: boolean) => void
  id?: string
}
const InputMediaPdfs: React.FC<InputMediaPdfsProps> = ({
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

  // add pdfs
  const [selectFile, selectFileProps] = Ui.useQuickDialog({
    onCloseAutoFocus: () => focusRef.current?.focus(),
    onOpenChange,
  })

  const onSelect = (files: Api.MediaFileWithRelations[]) => {
    // check if files is already in the list before append
    const valueIds = A.map(value, D.prop("id"))
    const appendableFiles: MediaFileWithLabel[] = A.filterMap(files, (file) =>
      !valueIds.includes(file.id) ? { ...file, label: "" } : O.None
    )
    onValueChange([...value, ...appendableFiles])
  }

  // remove a pdf
  const onRemove = (file: Api.MediaFileWithRelations) => {
    onValueChange(A.reject(value, ({ id }) => id === file.id))
    delay(10).then(() => focusRef.current?.focus())
  }

  // replace a pdf by another
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
    onValueChange(A.map(value, (file) => (file.id === originalId ? { ...replacement, label: file.label } : file)))
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
    (e: React.KeyboardEvent<HTMLButtonElement>, file: MediaFileWithLabel) => {
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

  const onLabelChange = (file: MediaFileWithLabel, label: string) => {
    onValueChange(A.map(value, (f) => (f.id === file.id ? { ...f, label } : f)))
  }
  return (
    <div className={cxm(className)}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={value} strategy={rectSortingStrategy}>
          <ul className='grid grid-cols-3 gap-2'>
            {A.map(value, (file) => (
              <MediaPdf
                key={file.id}
                {...{ file, onChange, onLabelChange, onRemove, onKeyDown, onOpenInfo, focusId, setFocusId }}
              />
            ))}
            <li className='aspect-[3/4] max-h-full w-auto max-w-full'>
              <button
                ref={focusRef}
                className={cxm(variants.buttonField({ className: "size-full" }))}
                id={id}
                type='button'
                onClick={() => selectFile(true)}
              >
                <Plus className='size-12 stroke-[0.8]' aria-hidden />
                <Ui.SrOnly>{_("add")}</Ui.SrOnly>
              </button>
            </li>
          </ul>
        </SortableContext>
      </DndContext>
      <SelectFilesDialog
        {...selectFileProps}
        type='pdf'
        onSelect={onSelect}
        persistedKey={persistedKey}
        disabledIds={A.map(value, D.prop("id")) as string[]}
        multiple
      />
      <SelectFilesDialog
        {...replaceFileProps}
        type='pdf'
        onSelect={replaceBy}
        persistedKey={persistedKey}
        disabledIds={A.map(value, D.prop("id")) as string[]}
      />
      <FileInfoDialog {...fileInfoProps} />
    </div>
  )
}

/**
 * MediaPdf
 */
type MediaPdfProps = {
  file: MediaFileWithLabel
  focusId: string | null
  setFocusId: (fileId: string | null) => void
  onChange: (file: MediaFileWithLabel) => void
  onLabelChange: (file: MediaFileWithLabel, label: string) => void
  onRemove: (file: MediaFileWithLabel) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, file: MediaFileWithLabel) => void
  onOpenInfo: (file: MediaFileWithLabel) => void
}
const MediaPdf: React.FC<MediaPdfProps> = ({
  file,
  focusId,
  setFocusId,
  onChange,
  onLabelChange,
  onRemove,
  onKeyDown,
  onOpenInfo,
}) => {
  const { _ } = useTranslation(dictionnary)
  const { translate } = useLanguage()
  const {
    service: { makePath },
  } = useDashboardService()
  const translated = translate(file, servicePlaceholder.mediaFile)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const focusRef = React.useRef<HTMLButtonElement>(null)

  // focus on the pdf when focus is ask from the parent
  React.useEffect(() => {
    if (focusId === file.id) {
      focusRef.current?.focus()
      setFocusId(null)
    }
  }, [focusId, file.id, setFocusId])

  // PDF preview refs
  const pdfRef = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(pdfRef)

  const pdf = (
    <Ui.PdfThumbnail
      data={{
        id: file.id,
        type: "pdf",
        src: makePath(file.url, true),
        downloadUrl: makePath(file.url, true),
        downloadFilename: translated.name,
      }}
      maxWidth={Math.min(size[0] || 150, 200)}
      maxHeight={Math.min(size[1] || 200, 267)}
    />
  )

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cx("flex flex-col gap-2 transition-opacity", isDragging ? "z-20 opacity-75" : "opacity-100")}
    >
      <div className='border-input bg-primary/5 pb-7 relative flex aspect-[3/4] max-h-full w-auto max-w-full items-center justify-center rounded-md border'>
        {/* Background blur effect */}
        <div className='absolute inset-0 grid size-full overflow-hidden rounded-md opacity-25 blur-[2px]' aria-hidden>
          <div className='flex scale-[200%] items-center justify-center'>{pdf}</div>
        </div>

        {/* Fallback when no preview */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <FileText className='text-muted-foreground/50 size-16' aria-hidden />
        </div>

        {/* Main PDF preview */}
        <div
          ref={pdfRef}
          className='relative flex size-full max-h-full max-w-full items-center justify-center overflow-hidden p-4'
        >
          <div className='flex max-h-full max-w-full items-center justify-center'>{pdf}</div>
        </div>

        {/* Drag handle */}
        <button
          className={cx("absolute inset-0 h-full w-full rounded-md", variants.focus())}
          {...listeners}
          {...attributes}
          type='button'
          onKeyDown={(e) => onKeyDown(e, file)}
        >
          <Ui.SrOnly>{_("drag")}</Ui.SrOnly>
        </button>

        {/* Menu */}
        <Ui.DropdownMenu.Quick
          menu={
            <>
              <Ui.Menu.Item onClick={() => onOpenInfo(file)}>
                <Info aria-hidden />
                {_("info")}
              </Ui.Menu.Item>
              <Ui.Menu.Item onClick={() => onRemove(file)}>
                <FileMinus aria-hidden />
                {_("remove")}
              </Ui.Menu.Item>
              <Ui.Menu.Item onClick={() => onChange(file)}>
                <FileDown aria-hidden />
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
        <input
          type='text'
          value={file.label}
          onChange={(e) => onLabelChange(file, e.target.value)}
          className={cxm(variants.input(), "absolute inset-x-1 bottom-1 w-[calc(100%-0.5rem)]")}
          placeholder={_("label")}
        />
      </div>
    </li>
  )
}

/**
 * types
 */
type MediaFileWithLabel = Api.MediaFileWithRelations & {
  label: string
}

/**
 * translations
 */
const dictionnary = {
  fr: {
    add: "Ajouter un PDF",
    drag: "Déplacer le PDF",
    info: "Informations sur le fichier",
    remove: "Supprimer le PDF",
    change: "Changer le PDF",
    more: "Plus d'options",
    label: "Libellé du PDF",
  },
  en: {
    add: "Add a PDF",
    change: "Change PDF",
    remove: "Remove PDF",
    drag: "Move PDF",
    info: "File information",
    more: "More options",
    label: "PDF label",
  },
  de: {
    add: "PDF hinzufügen",
    change: "PDF ändern",
    remove: "PDF entfernen",
    drag: "PDF verschieben",
    info: "Dateiinformationen",
    more: "Mehr Optionen",
    label: "PDF-Bezeichnung",
  },
}
