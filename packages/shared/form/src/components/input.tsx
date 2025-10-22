import { variants } from "@compo/ui"
import { A, cxm, VariantProps } from "@compo/utils"
import React from "react"
import {
  extractGroupProps,
  extractInputProps,
  FormA11y,
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  useFieldContext,
} from "."

/**
 * FormInput
 */
export type FormInputProps = FieldInputProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
    }>
  }
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({ classNames, ...props }, ref) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldInput {...extractInputProps({ ...props })} ref={ref} className={classNames?.input} />
    </FormGroup>
  )
})
FormInput.displayName = "FormInput"
export { FormInput }

/**
 * FieldInputProps
 */
export type FieldInputProps = React.ComponentProps<typeof FormA11y.Input> & {
  type?: FormInputType
  labelIcon?: React.ReactNode
} & VariantProps<typeof variants.input>
export const FieldInput = React.forwardRef<HTMLInputElement, FieldInputProps>(
  ({ type = "text", icon, size, labelIcon, className, ...props }, ref) => {
    const { id } = useFieldContext()
    const iconSide = labelIcon ? (A.includes(["right", "both"], icon) ? "both" : "left") : icon
    if (labelIcon)
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
        </div>
      )
    return (
      <FormA11y.Input
        {...extractInputProps({ ...props })}
        ref={ref}
        type={type}
        className={variants.input({ icon, size, className })}
      />
    )
  }
)

/**
 * FormInputType
 */
export type FormInputType =
  | "text"
  | "email"
  | "phone"
  | "date"
  | "datetime-local"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "time"
  | "week"
  | "url"
