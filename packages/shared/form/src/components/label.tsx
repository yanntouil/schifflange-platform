import { Primitives, Ui, variants } from "@compo/ui"
import { cxm } from "@compo/utils"
import { VariantProps } from "class-variance-authority"
import React from "react"
import { useFieldContext } from "."

/**
 * FormLabel
 */
export type FormLabelProps = React.ComponentPropsWithoutRef<typeof Primitives.Label.Root> &
  VariantProps<typeof variants.label> & {
    required?: boolean
  }
export const FormLabel = React.forwardRef<React.ElementRef<typeof Primitives.Label.Root>, FormLabelProps>(
  ({ ...props }, ref) => {
    const { id } = useFieldContext()
    return <Ui.Label {...props} ref={ref} htmlFor={id} />
  }
)
FormLabel.displayName = Primitives.Label.Root.displayName

/**
 * Label
 */
export type LabelProps = React.ComponentPropsWithoutRef<typeof Primitives.Label.Root> &
  VariantProps<typeof variants.label> & {
    required?: boolean
  }
const Label = React.forwardRef<React.ElementRef<typeof Primitives.Label.Root>, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <Primitives.Label.Root ref={ref} className={cxm(variants.label(), className)} {...props}>
      {children}
      {required && <span className='ml-2 inline-block text-red-500'>*</span>}
    </Primitives.Label.Root>
  )
)
Label.displayName = Primitives.Label.Root.displayName

export { Label }
