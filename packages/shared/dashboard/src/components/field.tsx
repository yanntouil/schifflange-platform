import { Api } from "@services/dashboard"
import { A, cxm, G, Merge } from "@compo/utils"
import { VariantProps } from "class-variance-authority"
import React from "react"
import { FieldContext, useField } from "./field.context"
import { fieldItemVariants, fieldRootVariants } from "./field.variants"

/**
 * Fields
 */
export type FieldRootProps = React.ComponentPropsWithoutRef<"ul"> & VariantProps<typeof fieldRootVariants>
const FieldRoot = React.forwardRef<HTMLUListElement, FieldRootProps>(
  ({ className, variant, size, divider, stretch, ...props }, ref) => {
    const variants = { variant, size, divider, stretch }
    return (
      <FieldContext.Provider value={{ ...variants }}>
        <ul className={cxm(fieldRootVariants(variants), className)} ref={ref} {...props} />
      </FieldContext.Provider>
    )
  }
)

/**
 * Field
 */
type FieldItemProps = Merge<
  React.ComponentPropsWithoutRef<"li">,
  {
    name: React.ReactNode
    icon?: React.ReactNode
    value?: React.ReactNode
    classNames?: {
      li?: string
      name?: string
      value?: string
    }
  }
>
const FieldItem = React.forwardRef<HTMLLIElement, FieldItemProps>(
  ({ name, icon, value, className, children, classNames, ...props }, ref) => {
    const variants = useField()

    return (
      <li className={cxm(fieldItemVariants({ ...variants }), classNames?.li, className)} ref={ref} {...props}>
        <span className={cxm("flex items-center font-medium [&>svg]:mr-2 [&>svg]:size-4", classNames?.name)}>
          {icon}
          {name}
        </span>
        <span className={cxm("flex items-center", classNames?.value)}>
          {G.isNotNullable(icon) && (
            <span className='@lg/fields:none invisible [&>svg]:mr-2 [&>svg]:size-4' aria-hidden>
              {icon}
            </span>
          )}
          {value ?? children}
        </span>
      </li>
    )
  }
)

/**
 * FieldsItemExtra
 */
const FieldExtra: React.FC<{
  fields: Api.ExtraField[]
  icon?: React.ReactNode
  wrapper?: (value: string) => React.ReactNode
}> = ({ fields, icon = null, wrapper = (value) => value }) =>
  A.isNotEmpty(fields) ? (
    <>
      {A.mapWithIndex(fields, (index, { name, value }) => (
        <FieldItem name={name} value={wrapper(value)} icon={icon} key={index} />
      ))}
    </>
  ) : null

/**
 * exports
 */
export { FieldExtra as Extra, FieldItem as Item, FieldRoot as Root }
