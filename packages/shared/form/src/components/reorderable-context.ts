import React from "react"

/**
 * types
 */
export type FormReorderableContext = {
  items: string[]
  item: string | undefined
  setItem: (item: string | undefined) => void
}

/**
 * contexts
 */
export const FormReorderableContext = React.createContext<FormReorderableContext | null>(null)

/**
 * hooks
 */
export const useFormReorderableContext = () => {
  const context = React.useContext(FormReorderableContext)
  if (!context) throw new Error("useFormReorderableContext must be used within a FormReorderableContext")
  return context
}
