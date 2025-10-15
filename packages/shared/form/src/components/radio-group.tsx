import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import React from "react"
import { FormError, FormItem, FormItemProps, useFieldContext } from "."

export type FormRadioOption = {
  value: string
  disabled?: boolean
  label: React.ReactNode
}

/**
 * FormRadioGroup
 * short component to wrap form item, label and error
 */
export type FormRadioGroupProps = RadioGroupFieldProps &
  FormItemProps & {
    classNames?: {
      item?: string
      error?: string
    } & RadioGroupFieldProps["classNames"]
  }
export const FormRadioGroup: React.FC<React.PropsWithChildren<FormRadioGroupProps>> = ({
  name,
  classNames,
  children,
  ...props
}) => {
  return (
    <FormItem name={name} className={classNames?.item}>
      <RadioGroupField {...props} classNames={classNames} />
      <FormError className={classNames?.error} />
      {children}
    </FormItem>
  )
}

/**
 * RadioGroupField
 */
type RadioGroupFieldProps = {
  label?: React.ReactNode
  disabled?: boolean
  options?: FormRadioOption[]
  classNames?: {
    root?: string
    label?: string
    option?: string
    optionLabel?: string
  }
}
const RadioGroupField: React.FC<React.PropsWithChildren<RadioGroupFieldProps>> = ({ children, ...props }) => {
  const { name, disabled: ctxDisabled, value, setFieldValue } = useFieldContext<string>()
  const { label, classNames, disabled: fieldDisabled, options = [] } = props
  const disabled = fieldDisabled || ctxDisabled

  const handleValueChange = (newValue: string) => {
    setFieldValue(newValue)
  }

  return (
    <div className='space-y-3'>
      {label && (
        <Ui.Label className={cxm("flex min-h-6 items-center justify-between text-sm font-medium", classNames?.label)}>
          {label}
        </Ui.Label>
      )}
      <Ui.RadioGroup.Root
        name={name}
        className={classNames?.root}
        disabled={disabled}
        value={value || ""}
        onValueChange={handleValueChange}
      >
        {options.map((option) => (
          <div key={option.value} className={cxm("flex items-start space-x-2 py-1.5", classNames?.option)}>
            <Ui.RadioGroup.Item
              value={option.value}
              id={`${name}-${option.value}`}
              disabled={option.disabled || disabled}
            />
            <Ui.Label className={cxm("mt-[2px]", classNames?.optionLabel)} htmlFor={`${name}-${option.value}`}>
              {option.label}
            </Ui.Label>
          </div>
        ))}
        {children}
      </Ui.RadioGroup.Root>
    </div>
  )
}
