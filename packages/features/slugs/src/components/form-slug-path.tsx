import {
  extractGroupProps,
  extractInputProps,
  FormA11y,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  useFieldContext,
} from "@compo/form"
import { Ui, variants } from "@compo/ui"
import { cxm, type VariantProps } from "@compo/utils"
import { TextCursorInput } from "lucide-react"
import React from "react"
import { slugify } from "../utils"

/**
 * FormSlugPath
 */
export type FormSlugPathProps = FieldInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
export const FormSlugPath: React.FC<FormSlugPathProps> = ({ classNames, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldInput {...extractInputProps({ ...props })} className={classNames?.input} />
    </FormGroup>
  )
}

/**
 * FieldInputProps
 */
type FieldInputProps = React.ComponentProps<typeof FormA11y.Input> & {
  type?: "text"
  labelIcon?: React.ReactNode
} & VariantProps<typeof variants.input>
const FieldInput: React.FC<FieldInputProps> = ({ type = "text", icon, size, labelIcon, className, ...props }) => {
  const { id, value, setFieldValue } = useFieldContext<string>()
  const iconSide = labelIcon ? "both" : "right"
  const ref = React.useRef<HTMLInputElement>(null)
  const format = () => {
    setFieldValue(slugify(value))
    ref.current?.focus()
  }
  return (
    <div className='relative'>
      {labelIcon && (
        <label
          className={cxm(variants.inputIcon({ size, side: "left", className: "text-muted-foreground" }), className)}
          htmlFor={id}
        >
          {labelIcon}
        </label>
      )}
      <FormA11y.Input
        {...extractInputProps({ ...props })}
        ref={ref}
        type={type}
        className={variants.input({ icon: iconSide, size, className })}
      />
      <Ui.Button
        icon
        variant='ghost'
        className={cxm(variants.inputIcon({ size, side: "right", className: "text-muted-foreground" }), className)}
        onClick={format}
      >
        <TextCursorInput aria-hidden />
      </Ui.Button>
    </div>
  )
}
