import { cxm } from "@compo/utils"
import React from "react"
import { FormA11y } from "."

/**
 * FormItem
 */
export type FormItemProps = React.ComponentProps<"div"> & React.ComponentProps<typeof FormA11y.Field>
export const FormItem: React.FC<FormItemProps> = ({ name, ...props }) => {
  return (
    <FormA11y.Field name={name}>
      <FieldItem {...props} />
    </FormA11y.Field>
  )
}

/**
 * FieldItem
 */
export type FieldItemProps = React.ComponentProps<"div">
export const FieldItem = React.forwardRef<HTMLDivElement, FieldItemProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} data-slot='form-item' className={cxm("space-y-2", className)} {...props}>
      {children}
    </div>
  )
})
