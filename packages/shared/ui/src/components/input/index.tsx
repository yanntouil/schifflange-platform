import { cn, VariantProps } from "@compo/utils"
import * as React from "react"
import { inputVariants } from "../../variants/input"

/**
 * Input
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, size, icon, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ size, icon, className }))} ref={ref} {...props} />
})
Input.displayName = "Input"
export { Input }
