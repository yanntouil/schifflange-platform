import { variants } from "@compo/ui"
import { cxm, type VariantProps } from "@compo/utils"
import { CheckCircle, Lightbulb, OctagonX, TriangleAlert } from "lucide-react"
import React from "react"

/**
 * Form.Alert
 */
export type FormAlertProps = React.ComponentProps<"div"> & VariantProps<typeof variants.alert>
export const FormAlert: React.FC<FormAlertProps> = ({ className, children, variant, ...props }) => {
  return (
    <div {...props} className={cxm(variants.alert({ variant }), className)}>
      {variant === "info" && <Lightbulb className='size-5 shrink-0' aria-hidden />}
      {variant === "success" && <CheckCircle className='size-5 shrink-0' aria-hidden />}
      {variant === "warning" && <TriangleAlert className='size-5 shrink-0' aria-hidden />}
      {variant === "destructive" && <OctagonX className='size-5 shrink-0' aria-hidden />}
      {children}
    </div>
  )
}
