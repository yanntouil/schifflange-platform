import { Ui } from "@compo/ui"
import React from "react"
import { FormA11y, useFormContext } from "./"

/**
 * Form Submit
 */
export const FormSubmit = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Ui.Button>>(
  ({ children, ...props }, ref) => {
    const { id } = useFormContext()
    return (
      <FormA11y.Submit asChild>
        <Ui.Button form={id} {...props} ref={ref}>
          <Ui.ButtonLoading fallback={children}>
            <Ui.Spinner />
          </Ui.ButtonLoading>
        </Ui.Button>
      </FormA11y.Submit>
    )
  }
)
