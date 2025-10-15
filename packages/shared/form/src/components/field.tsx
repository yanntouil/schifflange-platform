import React from "react"
import { FormA11y } from "."

/**
 * FormField
 */
export const FormField: React.FC<React.ComponentProps<typeof FormA11y.Field>> = ({ name, children }) => {
  return <FormA11y.Field name={name}>{children}</FormA11y.Field>
}
