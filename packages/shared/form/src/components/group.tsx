import { G, cxm } from "@compo/utils"
import React from "react"
import { FieldError, FieldItem, FormError, FormItem, FormLabel, Label } from "."
import { extractGroupProps } from "./utils"

/**
 * FormGroup
 * short component to wrap form item, label and error
 * use in conjunction with extractGroupProps and extractInputProps
 */
export type FormGroupProps = {
  label?: React.ReactNode
  labelAside?: React.ReactNode
  message?: React.ReactNode
  required?: boolean
  name?: string
  classNames?: FormGroupClassNames
}
export const FormGroup: React.FC<React.PropsWithChildren<FormGroupProps>> = ({ children, ...props }) => {
  const { label, classNames, labelAside, name, required, message } = extractGroupProps(props)
  return (
    <FormItem name={name} className={classNames?.item}>
      {G.isNotNullable(label) && !!label && (
        <div className={cxm("flex min-h-6 items-center justify-between", classNames?.label)}>
          <FormLabel required={required}>{label}</FormLabel>
          {labelAside}
        </div>
      )}
      {children}
      {message && <div className={cxm("text-xs text-muted-foreground", classNames?.message)}>{message}</div>}
      <FormError className={classNames?.error} />
    </FormItem>
  )
}
// ClassNames limited to 3 levels of nested objects to prevent typescript loop overflow
export type ClassNames = Record<string, string | Record<string, string | Record<string, string>>> | undefined
export type FormGroupClassNames<T extends ClassNames = {}> = T & {
  label?: string
  item?: string
  error?: string
  message?: string
}

export const FieldGroup: React.FC<React.PropsWithChildren<FormGroupProps> & { error?: string; id?: string }> = ({
  children,
  classNames,
  error,
  label,
  labelAside,
  message,
  required,
  id,
}) => {
  return (
    <FieldItem className={classNames?.item}>
      {G.isNotNullable(label) && !!label && (
        <div className={cxm("flex min-h-6 items-center justify-between", classNames?.label)}>
          <Label required={required} htmlFor={id}>
            {label}
          </Label>
          {labelAside}
        </div>
      )}
      {children}
      {message && <div className={cxm("text-xs text-muted-foreground", classNames?.message)}>{message}</div>}
      {error && <FieldError className={classNames?.error}>{error}</FieldError>}
    </FieldItem>
  )
}
