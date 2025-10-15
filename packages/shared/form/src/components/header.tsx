import { cxm } from "@compo/utils"
import React from "react"
/**
 * FormHeader
 */
export type FormHeaderProps = {
  title?: string
  description?: string
  classNames?: {
    container?: string
    title?: string
    description?: string
  }
} & React.ComponentProps<"div">
export const FormHeader: React.FC<FormHeaderProps> = ({ title, description, className, classNames, ...props }) => {
  if (!title && !description) return null
  return (
    <div {...props} className={cxm("space-y-1.5 pt-2", classNames?.container, className)}>
      {title && <h4 className={cxm("text-base/relaxed font-medium tracking-wide", classNames?.title)}>{title}</h4>}
      {description && (
        <p className={cxm("text-sm/tight text-muted-foreground", classNames?.description)}>{description}</p>
      )}
    </div>
  )
}
