import { Ui } from "@compo/ui"
import { cxm, VariantProps } from "@compo/utils"
import { G } from "@mobily/ts-belt"
import React from "react"
import {
  extractGroupProps,
  extractInputProps,
  FormA11y,
  FormError,
  FormGroupClassNames,
  FormGroupProps,
  FormItem,
  FormLabel,
  useFieldContext,
} from "."

/**
 * FormExtraFields
 */
export type FormSwitchProps = SwitchInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<ClassNames>
  }
export const FormSwitch: React.FC<FormSwitchProps> = ({ ...props }) => {
  const { label, classNames, labelAside, name, required, message } = extractGroupProps(props)
  return (
    <FormItem name={name} className={classNames?.item}>
      <div className={cxm("flex min-h-6 items-center justify-between", classNames?.label)}>
        <div className='flex items-center gap-2'>
          <FormLabel required={required}>{label}</FormLabel>
          {G.isNotNullable(labelAside) && <div className='text-xs text-muted-foreground'>{labelAside}</div>}
        </div>
        <SwitchInput {...extractInputProps({ ...props })} classNames={classNames} />
      </div>
      {message && <div className={cxm("text-xs text-muted-foreground", classNames?.message)}>{message}</div>}
      <FormError className={classNames?.error} />
    </FormItem>
  )
}
export const FormSimpleSwitch: React.FC<FormSwitchProps> = ({ ...props }) => {
  const { classNames, name } = extractGroupProps(props)
  return (
    <FormA11y.Field name={name}>
      <SwitchInput {...extractInputProps({ ...props })} classNames={classNames} />
    </FormA11y.Field>
  )
}

type ClassNames = Record<string, string> & {
  switch?: string
}
type SwitchInputProps = Pick<Ui.SwitchProps, "disabled"> &
  VariantProps<typeof Ui.switchVariants> & { classNames?: ClassNames }
const SwitchInput: React.FC<SwitchInputProps> = ({ disabled, classNames, ...props }) => {
  const { value, setFieldValue, disabled: ctxDisabled, id } = useFieldContext<boolean>()
  return (
    <Ui.Switch
      {...props}
      disabled={disabled || ctxDisabled}
      checked={value}
      onCheckedChange={setFieldValue}
      id={id}
      className={classNames?.switch}
    />
  )
}
