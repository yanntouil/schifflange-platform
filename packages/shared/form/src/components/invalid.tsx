import { cxm } from "@compo/utils"
import React from "react"
import { Form } from "use-a11y-form"
import { useFormContext } from "."

/**
 * FormInvalid
 */
type Props = React.ComponentProps<"p">
export const FormInvalid: React.FC<Props> = ({ className, ...props }) => {
  const ctx = useFormContext()
  return !ctx.isValid ? <Form.Assertive className={cxm("text-sm text-destructive", className)} {...props} /> : null
}
