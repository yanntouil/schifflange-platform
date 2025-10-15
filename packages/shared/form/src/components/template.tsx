import { Primitives, Ui, variants } from "@compo/ui"
import { cxm } from "@compo/utils"
import { A } from "@mobily/ts-belt"
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
 * FormTemplate
 */
export type FormTemplateProps = FormGroupProps &
  TemplateInputProps & {
    classNames?: FormGroupClassNames<TemplateInputProps["classNames"]>
  }
export const FormTemplate: React.FC<FormTemplateProps> = ({ classNames, options, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <TemplateInput {...extractInputProps({ ...props })} classNames={classNames} options={options} />
    </FormGroup>
  )
}

/**
 * TemplateInput
 */
type TemplateInputProps = {
  options: {
    label: string
    content: React.ReactNode
    value: string
  }[]
  disabled?: boolean
  classNames?: {
    trigger?: string
    placeholder?: string
    content?: string
    counter?: string
  }
  className?: string
}
const TemplateInput: React.FC<TemplateInputProps> = ({ options, classNames, className, ...props }) => {
  const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<string>()
  const disabled = props.disabled || ctxDisabled
  return (
    <Ui.ToggleGroup.Root
      className={cxm("grid grid-cols-3 gap-2", className)}
      value={value}
      onValueChange={(value) => value && setFieldValue(value)}
      type='single'
      disabled={disabled}
    >
      {A.map(options, (option) => (
        <Primitives.ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cxm(
            "relative flex flex-col overflow-hidden rounded-md p-2 pb-0 outline-none transition-colors duration-300 ease-in-out focus-within:bg-gray-500/25 hover:bg-gray-500/25",
            "transition-colors duration-300 ease-in-out focus-within:bg-gray-500/10 hover:bg-gray-500/10",
            variants.disabled(),
            classNames?.trigger
          )}
        >
          <span
            className={cxm(
              "relative aspect-video max-h-full w-full max-w-full overflow-hidden rounded-md border border-input",
              value === option.value ? "ring-2 ring-primary" : "border-input"
            )}
          >
            {option.content}
          </span>
          <div className='w-full py-2 text-sm/tight font-medium text-muted-foreground'>
            <span className='line-clamp-1'>{option.label}</span>
          </div>
        </Primitives.ToggleGroup.Item>
      ))}
    </Ui.ToggleGroup.Root>
  )
}
