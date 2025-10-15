import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import React from "react"
import { FormError, FormItem, FormItemProps, useFieldContext } from "."

/**
 * FormCheckbox
 * short component to wrap form item, label and error
 * use in conjunction with extractCheckboxProps and extractInputProps
 */
export type FormCheckboxProps = CheckboxFieldProps &
  FormItemProps & {
    classNames?: {
      item?: string
      error?: string
    } & CheckboxFieldProps["classNames"]
  }
export const FormCheckbox: React.FC<React.PropsWithChildren<FormCheckboxProps>> = ({
  name,
  classNames,
  children,
  ...props
}) => {
  return (
    <FormItem name={name} className={classNames?.item}>
      <CheckboxField {...props} classNames={classNames} />
      <FormError className={classNames?.error} />
    </FormItem>
  )
}

/**
 * CheckboxField
 */
type CheckboxFieldProps = {
  label?: React.ReactNode
  disabled?: boolean
  classNames?: {
    checkbox?: string
    label?: string
  }
}
const CheckboxField: React.FC<React.PropsWithChildren<CheckboxFieldProps>> = ({ children, ...props }) => {
  const { name, disabled: ctxDisabled, id, value, setFieldValue } = useFieldContext<boolean>()
  const { label, classNames, disabled: fieldDisabled } = props
  const disabled = fieldDisabled || ctxDisabled

  const handleCheckedChange = (checked: boolean) => {
    setFieldValue(checked)
  }

  return (
    <div className='flex items-start space-x-2 py-[3px]'>
      <Ui.Checkbox
        name={name}
        className={classNames?.checkbox}
        id={id}
        disabled={disabled}
        checked={value || false}
        onCheckedChange={handleCheckedChange}
      />
      <Ui.Label className={cxm("mt-[3px]", classNames?.label)} htmlFor={id}>
        {label}
      </Ui.Label>
      {children}
    </div>
  )
}
