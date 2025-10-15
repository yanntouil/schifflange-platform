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

type FormDateProps = FieldDateProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }

/**
 * FormDate
 */
export const FormDate: React.FC<FormDateProps> = ({ classNames, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldDate {...extractInputProps({ ...props })} className={classNames?.input} />
    </FormGroup>
  )
}

/**
 * FieldDate
 */
type FieldDateProps = Omit<Ui.DatePickerProps, "onValueChange" | "value" | "id">
const FieldDate: React.FC<FieldDateProps> = ({ disabled: fieldDisabled, ...props }) => {
  const { value, setFieldValue: onValueChange, disabled: ctxDisabled, id } = useFieldContext<Date | null>()
  const disabled = fieldDisabled || ctxDisabled
  return <Ui.DatePicker onValueChange={onValueChange} value={value} id={id} disabled={disabled} {...props} />
}
