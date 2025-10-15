import { VariantProps } from "class-variance-authority"
import React from "react"
import { fieldRootVariants } from "./field.variants"

/**
 * types
 */
export type FieldContextType = VariantProps<typeof fieldRootVariants> & {
  //
}

/**
 * context
 */
export const FieldContext = React.createContext<FieldContextType>({})

/**
 * hooks
 */
export const useField = () => React.useContext(FieldContext)
