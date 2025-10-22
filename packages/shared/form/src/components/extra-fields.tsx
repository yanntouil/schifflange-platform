import { useIsFirstRender } from "@compo/hooks"
import { DictionaryFn, Translation, translateDefault, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { A, D, G, VariantProps, cx, cxm, match } from "@compo/utils"
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, pointerWithin, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  AtSign,
  Calendar,
  CalendarClock,
  Clock,
  Globe,
  GripVertical,
  Hash,
  Phone,
  Plus,
  TextCursorInput,
  Text as TextIcon,
  ToggleLeft,
  X,
  type LucideProps,
} from "lucide-react"
import React from "react"
import {
  FormExtraField,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  FormTypes,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "."

/**
 * FormExtraFields
 */
export type FormExtraFieldsProps = ExtraFieldsInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<ClassNames>
  }
export const FormExtraFields: React.FC<FormExtraFieldsProps> = ({ classNames, t, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <ExtraFieldsInput {...extractInputProps({ ...props })} classNames={classNames} t={t} />
    </FormGroup>
  )
}

/**
 * replacement ClassNames
 */
type ClassNames = {
  container?: string
  list?: string
  listItem?: string
  inputLabelWrapper?: string
  inputLabel?: string
  inputValueWrapper?: string
  inputValue?: string
  actionsWrapper?: string
  reorderButton?: string
  typeButton?: string
  removeButton?: string
  addButtonWrapper?: string
  addButton?: string
}

/**
 * ExtraFields
 */
type ExtraFieldsInputProps = {
  classNames?: ClassNames
  t?: DictionaryFn
  type?: FieldType
  types?: FieldType[]
  canChangeType?: boolean
  canAdd?: boolean
  canRemove?: boolean
  size?: VariantProps<typeof variants.input>["size"]
  auto?: {
    name?: FormTypes.Auto | string
    value?: FormTypes.Auto | string
  }
}
export const ExtraFieldsInput: React.FC<ExtraFieldsInputProps> = (props) => {
  const { classNames, t = translateDefault, type = "text", canAdd = true } = props
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled, id } = useFieldContext<FormExtraField[]>()
  const addButtonRef = React.useRef<HTMLButtonElement>(null)

  // drag and drop reordering
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!(over && active.id !== over.id)) return
    const oldIndex = Number(active.id)
    const newIndex = Number(over.id)
    if (isNaN(oldIndex) || isNaN(newIndex)) return
    setFieldValue(arrayMove(value, oldIndex, newIndex))
  }
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <div className={cx("flex w-full flex-col gap-4 @container/input", classNames?.container)}>
      {A.isNotEmpty(value) && (
        <DndContext collisionDetection={pointerWithin} onDragEnd={onDragEnd} sensors={sensors}>
          <SortableContext items={A.mapWithIndex(value, (index) => index)} strategy={verticalListSortingStrategy}>
            <ul className={cx("flex w-full flex-col gap-4", classNames?.list)}>
              {A.mapWithIndex(value, (index, field) => (
                <ExtraFieldItem
                  key={index}
                  field={field}
                  index={index}
                  {...props}
                  onRemove={() => {
                    addButtonRef.current?.focus()
                    setFieldValue(A.removeAt(value, index))
                  }}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      {canAdd && (
        <div className={cx("flex", classNames?.addButtonWrapper)}>
          <Ui.Button
            ref={addButtonRef}
            disabled={disabled}
            variant='outline'
            onClick={() =>
              setFieldValue(
                A.append(value, {
                  name: t("name-default", { defaultValue: _("name-default") }),
                  value: t("value-default", { defaultValue: _("value-default") }),
                  type: type || undefined,
                })
              )
            }
            className={classNames?.addButton}
          >
            <Plus className='size-4' aria-hidden />
            {t("button-add", { defaultValue: _("button-add") })}
          </Ui.Button>
        </div>
      )}
    </div>
  )
}

/**
 * ExtraFieldItem
 */
type ExtraFieldItemProps = ExtraFieldsInputProps & {
  field: FormExtraField
  index: number
  onRemove: () => void
}
const ExtraFieldItem: React.FC<ExtraFieldItemProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled, id } = useFieldContext<FormExtraField[]>()
  const autoFocus = !useIsFirstRender()
  const {
    t = translateDefault,
    field,
    index,
    classNames,
    onRemove,
    type,
    size,
    auto,
    canChangeType = false,
    canRemove = true,
  } = props

  // drag and drop sortable
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: index,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  // handle onChange
  const onChange = (newValue: string | FormExtraField["type"], index: number, key: keyof FormExtraField) =>
    setFieldValue(
      A.replaceAt(value, index, {
        ...A.getUnsafe(value, index),
        [key]: newValue,
      } as FormExtraField)
    )

  // generate autoComplete
  const autoComplete = React.useMemo(
    () =>
      D.map(D.merge({ name: false, value: true }, D.filter(auto ?? {}, G.isNotNullable)), (v) =>
        G.isString(v) ? v : v ? "on" : "off"
      ),
    [auto]
  )
  const getFieldType = (field: FormExtraField) => field.type ?? type ?? "text"
  const fieldType = getFieldType(field)

  return (
    <li ref={setNodeRef} style={style} className={cx("flex gap-1", isDragging && "opacity-20", classNames?.listItem)}>
      <div className='flex items-center justify-center'>
        <ExtraFieldReorderButton {...listeners} {...attributes} disabled={disabled} classNames={classNames} />
      </div>
      <div className='grid gap-4 @xs/input:grid-cols-[1fr_2fr] grow'>
        <div className={cx(classNames?.inputLabelWrapper)}>
          <Ui.SrOnly htmlFor={`${id}-name-${index}`} as='label'>
            {t("name-placeholder", { defaultValue: _("name-placeholder") })}
          </Ui.SrOnly>
          <input
            className={variants.input({ size, className: classNames?.inputLabel })}
            id={`${id}-name-${index}`}
            name={`${id}-name-${index}`}
            autoComplete={autoComplete.name}
            type='text'
            disabled={disabled}
            placeholder={t("name-placeholder", { defaultValue: _("name-placeholder") })}
            value={field.name}
            onChange={({ target }) => onChange(target.value, index, "name")}
          />
        </div>
        <div className={cx("relative isolate", classNames?.inputValueWrapper)}>
          <Ui.SrOnly htmlFor={`${id}-value-${index}`} as='label'>
            {t("value-placeholder", { defaultValue: _("value-placeholder") })}
          </Ui.SrOnly>
          <input
            className={variants.input({ size, icon: "right", className: classNames?.inputValue })}
            id={`${id}-value-${index}`}
            name={`${id}-value-${index}`}
            autoComplete={autoComplete.value}
            type='text'
            disabled={disabled}
            placeholder={t("value-placeholder", { defaultValue: _("value-placeholder") })}
            autoFocus={autoFocus}
            value={field.value}
            onChange={({ target }) => onChange(target.value, index, "value")}
          />
          <div className={cx("absolute inset-y-0 right-0 flex items-center gap-1 pr-1", classNames?.actionsWrapper)}>
            {(!type || canChangeType) && (
              <ExtraFieldTypeDropdown
                {...props}
                fieldType={fieldType}
                onChange={(newType) => onChange(newType, index, "type")}
              />
            )}
            {canRemove && <ExtraFieldRemoveButton {...props} onClick={onRemove} />}
          </div>
        </div>
      </div>
    </li>
  )
}

/**
 * ExtraFieldTypeDropdown
 */
type ExtraFieldTypeDropdownProps = ExtraFieldsInputProps & {
  fieldType: FieldType
  onChange: (type: FormExtraField["type"]) => void
}
const ExtraFieldTypeDropdown: React.FC<ExtraFieldTypeDropdownProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { disabled } = useFieldContext<FormExtraField[]>()
  const { fieldType, types = FIELD_TYPES, classNames, t = translateDefault, onChange } = props
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button
          disabled={disabled}
          variant='ghost'
          className={cxm("size-7 rounded-sm p-0 text-muted-foreground hover:text-foreground", classNames?.typeButton)}
          icon
        >
          <FieldTypeIcon type={fieldType} />
          <Ui.SrOnly>{t("button-change-type", { defaultValue: _("button-change-type") })}</Ui.SrOnly>
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content align='end'>
        {A.map([...types], (key) => (
          <Ui.DropdownMenu.CheckboxItem
            key={key}
            className='gap-2'
            onCheckedChange={() => onChange(key as FormExtraField["type"])}
            checked={fieldType === key}
            side='right'
          >
            <FieldTypeIcon type={key} className='size-4' />
            <span>{t(`type-${key}`, { defaultValue: _(`type-${key}`) })}</span>
          </Ui.DropdownMenu.CheckboxItem>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * ExtraFieldRemoveButton
 */
type ExtraFieldRemoveButtonProps = ExtraFieldsInputProps & {
  onClick: () => void
}
const ExtraFieldRemoveButton: React.FC<ExtraFieldRemoveButtonProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { disabled } = useFieldContext<FormExtraField[]>()
  const { types = FIELD_TYPES, classNames, t = translateDefault, onClick } = props
  return (
    <Ui.Button
      disabled={disabled}
      variant='ghost'
      className={cxm("size-7 rounded-sm p-0 text-muted-foreground hover:text-destructive", classNames?.removeButton)}
      icon
      onClick={onClick}
    >
      <X aria-hidden />
      <Ui.SrOnly>{t("button-delete", { defaultValue: _("button-delete") })}</Ui.SrOnly>
    </Ui.Button>
  )
}

/**
 * ExtraFieldReorderButton
 */
type ExtraFieldReorderButtonProps = {
  disabled?: boolean
  classNames?: ClassNames
} & React.HTMLAttributes<HTMLButtonElement>
const ExtraFieldReorderButton: React.FC<ExtraFieldReorderButtonProps> = ({ disabled, classNames, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Button
      {...props}
      disabled={disabled}
      variant='ghost'
      size='sm'
      icon
      className={cxm("cursor-grab text-muted-foreground active:cursor-grabbing w-6", classNames?.reorderButton)}
    >
      <GripVertical aria-hidden />
      <Ui.SrOnly>{_("button-reorder")}</Ui.SrOnly>
    </Ui.Button>
  )
}

/**
 * Field type icon
 */
const FieldTypeIcon: React.FC<LucideProps & { type: FieldType }> = ({ type, className, ...props }) => {
  const commonProps = { className, ...props, "aria-hidden": true }
  return match(type)
    .with("text", () => <TextIcon {...commonProps} />)
    .with("email", () => <AtSign {...commonProps} />)
    .with("phone", () => <Phone {...commonProps} />)
    .with("url", () => <Globe {...commonProps} />)
    .with("number", () => <Hash {...commonProps} />)
    .with("boolean", () => <ToggleLeft {...commonProps} />)
    .with("date", () => <Calendar {...commonProps} />)
    .with("time", () => <Clock {...commonProps} />)
    .with("datetime", () => <CalendarClock {...commonProps} />)
    .with("textarea", () => <TextCursorInput {...commonProps} />)
    .otherwise(() => <span className={className} aria-hidden />)
}

/**
 * Field type configuration
 */
const FIELD_TYPES = [
  "text",
  "email",
  "phone",
  "url",
  "number",
  "boolean",
  "date",
  "time",
  "datetime",
  "textarea",
] as const
type FieldType = (typeof FIELD_TYPES)[number]

/**
 * default dictionary
 */
const dictionary = {
  fr: {
    "name-placeholder": "Nom",
    "name-default": "",
    "value-placeholder": "Valeur",
    "value-default": "",
    "button-add": "Ajouter une nouvelle ligne",
    "button-delete": "Supprimer cette ligne",
    "button-change-type": "Changer le type de champ",
    "button-reorder": "Réordonner",
    "type-text": "Texte",
    "type-email": "E-mail",
    "type-phone": "Téléphone",
    "type-url": "URL",
    "type-number": "Nombre",
    "type-boolean": "Booléen",
    "type-date": "Date",
    "type-time": "Heure",
    "type-datetime": "Date et heure",
    "type-textarea": "Zone de texte",
  },
  en: {
    "name-placeholder": "Name",
    "name-default": "",
    "value-placeholder": "Value",
    "value-default": "",
    "button-add": "Add a new line",
    "button-delete": "Delete this line",
    "button-change-type": "Change field type",
    "button-reorder": "Reorder",
    "type-text": "Text",
    "type-email": "Email",
    "type-phone": "Phone",
    "type-url": "URL",
    "type-number": "Number",
    "type-boolean": "Boolean",
    "type-date": "Date",
    "type-time": "Time",
    "type-datetime": "Date and time",
    "type-textarea": "Text area",
  },
  de: {
    "name-placeholder": "Name",
    "name-default": "",
    "value-placeholder": "Wert",
    "value-default": "",
    "button-add": "Neue Zeile hinzufügen",
    "button-delete": "Zeile löschen",
    "button-change-type": "Feldtyp ändern",
    "button-reorder": "Reihenfolge ändern",
    "type-text": "Text",
    "type-email": "E-Mail",
    "type-phone": "Telefon",
    "type-url": "URL",
    "type-number": "Zahl",
    "type-boolean": "Boolean",
    "type-date": "Datum",
    "type-time": "Zeit",
    "type-datetime": "Datum und Zeit",
    "type-textarea": "Textbereich",
  },
} satisfies Translation
