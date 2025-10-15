import { Ui } from "@compo/ui"
import React from "react"
import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "."

/**
 * FormExtraFields
 */
export type FormSelectMultipleProps = SelectMultipleInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<ClassNames>
  }
export const FormSelectMultiple: React.FC<FormSelectMultipleProps> = ({ classNames, options, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <SelectMultipleInput {...extractInputProps({ ...props })} classNames={classNames} options={options} />
    </FormGroup>
  )
}

type ClassNames = SelectMultipleInputProps["classNames"] & Record<string, string>
type SelectMultipleInputProps = Pick<
  Ui.Select.MultipleProps,
  "options" | "placeholder" | "disabled" | "maxDisplayedItems" | "displayClear" | "displaySelectAll" | "classNames"
>
const SelectMultipleInput: React.FC<SelectMultipleInputProps> = ({ disabled, ...props }) => {
  const { value, setFieldValue, disabled: ctxDisabled, id } = useFieldContext<string[]>()
  return (
    <Ui.Select.Multiple
      {...props}
      disabled={disabled || ctxDisabled}
      value={value}
      onValueChange={setFieldValue}
      id={id}
    />
  )
}
