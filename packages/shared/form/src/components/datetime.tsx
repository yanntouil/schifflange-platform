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

type FormDatetimeProps = FieldDatetimeProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }

/**
 * FormDatetime
 */
export const FormDatetime: React.FC<FormDatetimeProps> = ({ classNames, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldDatetime {...extractInputProps({ ...props })} className={classNames?.input} />
    </FormGroup>
  )
}

/**
 * FieldDate
 */
type FieldDatetimeProps = Omit<Ui.DateTimePickerProps, "onValueChange" | "value" | "id">
const FieldDatetime: React.FC<FieldDatetimeProps> = ({ disabled: fieldDisabled, ...props }) => {
  const { value, setFieldValue: onValueChange, disabled: ctxDisabled, id } = useFieldContext<Date | null>()
  const disabled = fieldDisabled || ctxDisabled
  return <Ui.DateTimePicker onValueChange={onValueChange} value={value} id={id} disabled={disabled} {...props} />
}
