import { G, cx } from "@compo/utils"
import React from "react"
import { FormA11y, useFormContext } from "."

/**
 * FormAssertive
 */
export type FormAssertiveProps = React.ComponentProps<"p">
export const FormAssertive: React.FC<FormAssertiveProps> = ({ className, ...props }) => {
  const ctx = useFormContext()
  return G.isNotNullable(ctx.alert) || G.isNotNullable(props.children) ? (
    <FormA11y.Assertive className={cx("text-sm text-destructive", className)} {...props} />
  ) : null
}
