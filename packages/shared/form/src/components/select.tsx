import { Ui, variants } from "@compo/ui"
import { A, cxm } from "@compo/utils"
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
export type FormSelectProps = SelectInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<ClassNames>
  }
export const FormSelect: React.FC<FormSelectProps> = ({ classNames, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <SelectInput {...extractInputProps({ ...props })} classNames={classNames} />
    </FormGroup>
  )
}

type ClassNames = {
  trigger?: string
  content?: string
  item?: string
}

type SelectInputProps = {
  lang?: string
  placeholder?: string
  options?: FormSelectOption[]
  classNames?: ClassNames
  disabled?: boolean
  children?: React.ReactNode
}

const SelectInput: React.FC<SelectInputProps> = ({
  placeholder,
  options = [],
  classNames,
  disabled,
  children,
  lang,
}) => {
  const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<string>()

  return (
    <Ui.Select.Root disabled={disabled || ctxDisabled} defaultValue={value} value={value} onValueChange={setFieldValue}>
      <Ui.Select.Trigger className={cxm(variants.inputBackground(), variants.inputBorder(), classNames?.trigger)}>
        <Ui.Select.Value placeholder={placeholder} lang={lang} />
      </Ui.Select.Trigger>
      <Ui.Select.Content className={classNames?.content}>
        {children ||
          A.map(options, (option) => (
            <Ui.Select.Item key={option.value} {...option} className={classNames?.item} lang={lang}>
              {option.label}
            </Ui.Select.Item>
          ))}
      </Ui.Select.Content>
    </Ui.Select.Root>
  )
}

/**
 * types
 */
export type FormSelectOption = React.ComponentPropsWithoutRef<typeof Ui.Select.Item> & {
  label: React.ReactNode
}
