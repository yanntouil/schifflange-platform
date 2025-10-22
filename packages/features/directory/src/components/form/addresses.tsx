import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "@compo/form"
import { useIsFirstRender } from "@compo/hooks"
import { DictionaryFn, Translation, translateDefault, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { A, VariantProps, cx, cxm } from "@compo/utils"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CopyPlus, Ellipsis, GripHorizontal, MapPin, MinusSquare, Plus } from "lucide-react"
import React from "react"

/**
 * OrganisationAddress type
 */
export type OrganisationAddress = {
  label: string
  type: "physical" | "postal"
  street: string
  postalCode: string
  city: string
  country: string
}

/**
 * FormAddresses
 */
export type FormAddressesProps = AddressesInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<ClassNames>
  }
export const FormAddresses: React.FC<FormAddressesProps> = ({ classNames, t, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <AddressesInput {...extractInputProps({ ...props })} classNames={classNames} t={t} />
    </FormGroup>
  )
}

/**
 * ClassNames
 */
type ClassNames = {
  container?: string
  list?: string
  listItem?: string
  inputsGrid?: string
  inputWrapper?: string
  input?: string
  actionsWrapper?: string
  reorderButton?: string
  addButtonWrapper?: string
  addButton?: string
}

/**
 * Addresses Input
 */
type AddressesInputProps = {
  classNames?: ClassNames
  t?: DictionaryFn
  size?: VariantProps<typeof variants.input>["size"]
}

export const AddressesInput: React.FC<AddressesInputProps> = (props) => {
  const { classNames, t = translateDefault } = props
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled, id } = useFieldContext<OrganisationAddress[]>()

  const addButtonRef = React.useRef<HTMLButtonElement>(null)

  // drag and drop reordering
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const onDragEnd = (event: DragEndEvent) => {
    setActiveIndex(null)
    const { active, over } = event
    if (!(over && active.id !== over.id)) return
    const oldIndex = Number(active.id)
    const newIndex = Number(over.id)
    if (isNaN(oldIndex) || isNaN(newIndex)) return
    setFieldValue(arrayMove(value, oldIndex, newIndex))
  }
  const onDragStart = (event: DragStartEvent) => {
    setActiveIndex(Number(event.active.id))
  }
  const onDragCancel = () => {
    setActiveIndex(null)
  }
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <div className={cx("flex w-full flex-col gap-4 @container/input", classNames?.container)}>
      {A.isNotEmpty(value) && (
        <DndContext
          collisionDetection={pointerWithin}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragCancel={onDragCancel}
          sensors={sensors}
        >
          <SortableContext items={A.mapWithIndex(value, (index) => index)} strategy={verticalListSortingStrategy}>
            <ul className={cx("flex w-full flex-col gap-4", classNames?.list)}>
              {A.mapWithIndex(value, (index, address) => (
                <AddressItem
                  key={index}
                  address={address}
                  index={index}
                  {...props}
                  onDuplicate={() => {
                    setFieldValue(
                      A.insertAt(value, index + 1, {
                        ...address,
                        label: `${address.label} ${index + 1}`,
                      })
                    )
                  }}
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

      <div className={cx("flex", classNames?.addButtonWrapper)}>
        <Ui.Button
          ref={addButtonRef}
          disabled={disabled}
          variant='outline'
          onClick={() =>
            setFieldValue(
              A.append(value, {
                label: t("label-default", { defaultValue: _("label-default") }),
                type: "physical",
                street: "",
                postalCode: "",
                city: "",
                country: "",
              })
            )
          }
          className={classNames?.addButton}
        >
          <Plus className='size-4' aria-hidden />
          {t("button-add", { defaultValue: _("button-add") })}
        </Ui.Button>
      </div>
    </div>
  )
}

/**
 * AddressItem
 */
type AddressItemProps = AddressesInputProps & {
  address: OrganisationAddress
  index: number
  onRemove: () => void
  onDuplicate: () => void
}

const AddressItem: React.FC<AddressItemProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled, id } = useFieldContext<OrganisationAddress[]>()
  const autoFocus = !useIsFirstRender()
  const { address, index, classNames, onRemove, onDuplicate, size } = props

  // drag and drop sortable
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: index,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  // handle onChange
  const onChange = (newValue: string, key: keyof OrganisationAddress) =>
    setFieldValue(
      A.replaceAt(value, index, {
        ...A.getUnsafe(value, index),
        [key]: newValue,
      } as OrganisationAddress)
    )

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cx("flex flex-col gap-4 rounded-lg border p-4", isDragging && "opacity-50", classNames?.listItem)}
    >
      {/* Header with reorder button and remove button */}
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <MapPin size={16} className='text-muted-foreground' aria-hidden />
          <span className='text-sm font-medium'>{address.label || _("address-untitled")}</span>
        </div>
        <div>
          <AddressReorderButton {...listeners} {...attributes} disabled={disabled} classNames={classNames} />
          <Ui.DropdownMenu.Quick
            menu={
              <>
                <Ui.Menu.Item onSelect={onDuplicate}>
                  <CopyPlus aria-hidden />
                  {_("button-duplicate")}
                </Ui.Menu.Item>
                <Ui.Menu.Item onSelect={onRemove}>
                  <MinusSquare aria-hidden />
                  {_("button-delete")}
                </Ui.Menu.Item>
              </>
            }
          >
            <Ui.Button variant='ghost' size='sm' icon>
              <Ellipsis aria-hidden />
              <Ui.SrOnly>{_("button-menu")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.DropdownMenu.Quick>
        </div>
      </div>

      {/* Address fields grid */}
      <div className={cx("grid gap-4 @sm/input:grid-cols-2", classNames?.inputsGrid)}>
        {/* Label */}
        <div className={cx("@sm/input:col-span-2", classNames?.inputWrapper)}>
          <label htmlFor={`${id}-label-${index}`} className='mb-2 block text-sm font-medium'>
            {_("label-label")}
          </label>
          <div className='relative'>
            <input
              className={variants.input({ size, className: classNames?.input })}
              id={`${id}-label-${index}`}
              name={`${id}-label-${index}`}
              type='text'
              disabled={disabled}
              placeholder={_("label-placeholder")}
              autoFocus={autoFocus}
              value={address.label}
              onChange={({ target }) => onChange(target.value, "label")}
            />
            <Ui.Select.Root value={address.type} onValueChange={(value) => onChange(value, "type")}>
              <div className='absolute inset-y-0 right-0 flex items-center'>
                <Ui.SrOnly htmlFor={`${id}-type-${index}`} as='label'>
                  {_("type-label")}
                </Ui.SrOnly>
                <Ui.Select.Trigger
                  id={`${id}-type-${index}`}
                  disabled={disabled}
                  className={cxm("w-max border-none bg-transparent")}
                >
                  <Ui.Select.Value placeholder={_("type-placeholder")} />
                </Ui.Select.Trigger>
              </div>
              <Ui.Select.Content align='end'>
                <Ui.Select.Item value='physical'>{_("type-physical")}</Ui.Select.Item>
                <Ui.Select.Item value='postal'>{_("type-postal")}</Ui.Select.Item>
              </Ui.Select.Content>
            </Ui.Select.Root>
          </div>
        </div>

        {/* Street */}
        <div className={cx("@sm/input:col-span-2", classNames?.inputWrapper)}>
          <label htmlFor={`${id}-street-${index}`} className='mb-2 block text-sm font-medium'>
            {_("street-label")}
          </label>
          <input
            className={variants.input({ size, className: classNames?.input })}
            id={`${id}-street-${index}`}
            name={`${id}-street-${index}`}
            type='text'
            disabled={disabled}
            placeholder={_("street-placeholder")}
            value={address.street}
            onChange={({ target }) => onChange(target.value, "street")}
          />
        </div>

        {/* Postal Code */}
        <div className={classNames?.inputWrapper}>
          <label htmlFor={`${id}-postalCode-${index}`} className='mb-2 block text-sm font-medium'>
            {_("postal-code-label")}
          </label>
          <input
            className={variants.input({ size, className: classNames?.input })}
            id={`${id}-postalCode-${index}`}
            name={`${id}-postalCode-${index}`}
            type='text'
            disabled={disabled}
            placeholder={_("postal-code-placeholder")}
            value={address.postalCode}
            onChange={({ target }) => onChange(target.value, "postalCode")}
          />
        </div>

        {/* City */}
        <div className={classNames?.inputWrapper}>
          <label htmlFor={`${id}-city-${index}`} className='mb-2 block text-sm font-medium'>
            {_("city-label")}
          </label>
          <input
            className={variants.input({ size, className: classNames?.input })}
            id={`${id}-city-${index}`}
            name={`${id}-city-${index}`}
            type='text'
            disabled={disabled}
            placeholder={_("city-placeholder")}
            value={address.city}
            onChange={({ target }) => onChange(target.value, "city")}
          />
        </div>

        {/* Country */}
        <div className={cx("@sm/input:col-span-2", classNames?.inputWrapper)}>
          <label htmlFor={`${id}-country-${index}`} className='mb-2 block text-sm font-medium'>
            {_("country-label")}
          </label>
          <input
            className={variants.input({ size, className: classNames?.input })}
            id={`${id}-country-${index}`}
            name={`${id}-country-${index}`}
            type='text'
            disabled={disabled}
            placeholder={_("country-placeholder")}
            value={address.country}
            onChange={({ target }) => onChange(target.value, "country")}
          />
        </div>
      </div>
    </li>
  )
}

/**
 * AddressReorderButton
 */
type AddressReorderButtonProps = {
  disabled?: boolean
  classNames?: ClassNames
} & React.HTMLAttributes<HTMLButtonElement>

const AddressReorderButton: React.FC<AddressReorderButtonProps> = ({ disabled, classNames, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Button
      {...props}
      disabled={disabled}
      variant='ghost'
      size='sm'
      icon
      className={cxm("cursor-grab text-muted-foreground active:cursor-grabbing", classNames?.reorderButton)}
    >
      <GripHorizontal className='size-4' aria-hidden />
      <Ui.SrOnly>{_("button-reorder")}</Ui.SrOnly>
    </Ui.Button>
  )
}

/**
 * Default dictionary
 */
const dictionary = {
  fr: {
    "label-label": "Label",
    "label-placeholder": "ex: Bureau principal",
    "label-default": "",
    "type-label": "Type d'adresse",
    "type-placeholder": "Sélectionnez un type",
    "type-physical": "Physique",
    "type-postal": "Postale",
    "street-label": "Rue",
    "street-placeholder": "Nom et numéro de rue",
    "postal-code-label": "Code postal",
    "postal-code-placeholder": "L-1234",
    "city-label": "Ville",
    "city-placeholder": "Nom de la ville",
    "country-label": "Pays",
    "country-placeholder": "Luxembourg",
    "button-add": "Ajouter une adresse",
    "button-delete": "Supprimer cette adresse",
    "button-duplicate": "Dupliquer cette adresse",
    "button-reorder": "Réordonner",
    "button-menu": "Menu des actions",
    "address-untitled": "Adresse sans nom",
  },
  en: {
    "label-label": "Label",
    "label-placeholder": "e.g., Main office",
    "label-default": "",
    "type-label": "Address type",
    "type-placeholder": "Select a type",
    "type-physical": "Physical",
    "type-postal": "Postal",
    "street-label": "Street",
    "street-placeholder": "Street name and number",
    "postal-code-label": "Postal code",
    "postal-code-placeholder": "L-1234",
    "city-label": "City",
    "city-placeholder": "City name",
    "country-label": "Country",
    "country-placeholder": "Luxembourg",
    "button-add": "Add address",
    "button-delete": "Delete this address",
    "button-duplicate": "Duplicate this address",
    "button-reorder": "Reorder",
    "button-menu": "Actions menu",
    "address-untitled": "Untitled address",
  },
  de: {
    "label-label": "Bezeichnung",
    "label-placeholder": "z.B. Hauptbüro",
    "label-default": "",
    "type-label": "Adresstyp",
    "type-placeholder": "Typ auswählen",
    "type-physical": "Physisch",
    "type-postal": "Postal",
    "street-label": "Straße",
    "street-placeholder": "Straßenname und Nummer",
    "postal-code-label": "Postleitzahl",
    "postal-code-placeholder": "L-1234",
    "city-label": "Stadt",
    "city-placeholder": "Stadtname",
    "country-label": "Land",
    "country-placeholder": "Luxemburg",
    "button-add": "Adresse hinzufügen",
    "button-delete": "Diese Adresse löschen",
    "button-duplicate": "Diese Adresse duplizieren",
    "button-reorder": "Reihenfolge ändern",
    "button-menu": "Aktionsmenü",
    "address-untitled": "Unbenannte Adresse",
  },
} satisfies Translation
