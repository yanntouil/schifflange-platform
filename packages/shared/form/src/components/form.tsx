import React from "react"
import { Form as FormAlly } from "use-a11y-form"

/**
 * Form
 */
export type FormProps = React.ComponentPropsWithoutRef<typeof FormAlly>
const FormRoot = React.forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  return (
    <FormAlly
      {...props}
      ref={ref}
      id={props.form.id}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        //props.form.submit(e)
      }}
    />
  )
})
FormRoot.displayName = "Form"
export { FormRoot }
