import { useIsFirstRender } from "@compo/hooks"
import { DictionaryFn, Translation, translateDefault, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { A, D, G, VariantProps, cx, cxm } from "@compo/utils"
import { Plus, X } from "lucide-react"
import React from "react"
import {
  FormExtraField,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  FormInputType,
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
  type?: FormInputType
  canAdd?: boolean
  canRemove?: boolean
  size?: VariantProps<typeof variants.input>["size"]
  auto?: {
    name?: FormTypes.Auto | string
    value?: FormTypes.Auto | string
  }
}
export const ExtraFieldsInput: React.FC<ExtraFieldsInputProps> = ({
  auto,
  classNames,
  t = translateDefault,
  size,
  type = "text",
  canAdd = true,
  canRemove = true,
}) => {
  const { _ } = useTranslation(dictionary)
  const { value, setFieldValue, disabled, name } = useFieldContext<FormExtraField[]>()
  const id = name

  const autoFocus = !useIsFirstRender()
  const addButtonRef = React.useRef<HTMLButtonElement>(null)

  const onChange = (newValue: string, index: number, type: keyof FormExtraField) =>
    setFieldValue(
      A.replaceAt(value, index, {
        ...A.getUnsafe(value, index),
        [type]: newValue,
      } as FormExtraField)
    )

  const autoComplete = React.useMemo(
    () =>
      D.map(D.merge({ name: false, value: true }, D.filter(auto ?? {}, G.isNotNullable)), (v) =>
        G.isString(v) ? v : v ? "on" : "off"
      ),
    [auto]
  )

  return (
    <div className={cx("flex w-full flex-col gap-4 @container/input", classNames?.container)}>
      {A.isNotEmpty(value) && (
        <ul className={cx("flex w-full flex-col gap-4", classNames?.list)}>
          {A.mapWithIndex(value, (index, field) => (
            <li className={cx("grid gap-4 @xs/input:grid-cols-3", classNames?.listItem)} key={index}>
              <div className={classNames?.inputLabelWrapper}>
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
              <div className={cx("relative @xs/input:col-span-2", classNames?.inputValueWrapper)}>
                <Ui.SrOnly htmlFor={`${id}-value-${index}`} as='label'>
                  {t("value-placeholder", { defaultValue: _("value-placeholder") })}
                </Ui.SrOnly>
                <input
                  className={variants.input({ size, icon: "right" })}
                  id={`${id}-value-${index}`}
                  name={`${id}-value-${index}`}
                  autoComplete={autoComplete.value}
                  type={type}
                  disabled={disabled}
                  placeholder={t("value-placeholder", { defaultValue: _("value-placeholder") })}
                  autoFocus={autoFocus}
                  value={field.value}
                  onChange={({ target }) => onChange(target.value, index, "value")}
                />
                {canRemove && (
                  <Ui.Button
                    disabled={disabled}
                    variant='ghost'
                    className={cxm(
                      variants.inputIcon({ size, side: "right" }),
                      "text-muted-foreground",
                      classNames?.removeButton
                    )}
                    icon
                    onClick={() => {
                      addButtonRef.current?.focus()
                      setFieldValue(A.removeAt(value, index))
                    }}
                  >
                    <X aria-hidden />
                    <Ui.SrOnly>{t("button-delete", { defaultValue: _("button-delete") })}</Ui.SrOnly>
                  </Ui.Button>
                )}
              </div>
            </li>
          ))}
        </ul>
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
                })
              )
            }
            className={classNames?.addButton}
          >
            <Plus size={16} aria-hidden />
            {t("button-add", { defaultValue: _("button-add") })}
          </Ui.Button>
        </div>
      )}
    </div>
  )
}

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
  },
  en: {
    "name-placeholder": "Name",
    "name-default": "",
    "value-placeholder": "Value",
    "value-default": "",
    "button-add": "Add a new line",
    "button-delete": "Delete this line",
  },
  de: {
    "name-placeholder": "Name",
    "name-default": "",
    "value-placeholder": "Wert",
    "value-default": "",
    "button-add": "Neue Zeile hinzufügen",
    "button-delete": "Zeile löschen",
  },
} satisfies Translation
