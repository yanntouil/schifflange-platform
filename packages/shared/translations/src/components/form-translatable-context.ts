import { A, D } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLanguages } from "../context.hooks"

/**
 * types
 */
export type FormTranslatableContext = {
  language: Api.Language["id"]
  current: Api.Language
  setLanguage: (language: Api.Language["id"]) => void
}

/**
 * contexts
 */
export const FormTranslatableContext = React.createContext<FormTranslatableContext | null>(null)

/**
 * hooks
 */
export const useFormTranslatableContext = () => {
  const context = React.useContext(FormTranslatableContext)
  if (!context) throw new Error("useFormTranslatableContext must be used within a FormTranslatableContext")
  return context
}
export const useFormTranslatable = <L extends { languageId: string } & Api.TranslatableValues, P extends Partial<L>>(
  item: L[],
  placeholder: P
) => {
  const { languages } = useLanguages()
  return makeFormTranslatable(item, placeholder, languages)
}

/**
 * utils
 */
export const makeFormTranslatable = <L extends { languageId: string } & Api.TranslatableValues, P extends Partial<L>>(
  item: L[],
  placeholder: P,
  languages: Api.Language[]
) => {
  const pick = D.keys(placeholder) as (keyof L)[]
  const translatableValues = D.fromPairs(
    A.map(languages, ({ id }) => {
      const values = { ...placeholder, ...(A.find(item, ({ languageId }) => languageId === id) ?? {}) }
      return [id, D.selectKeys(values, pick)]
    })
  )
  return translatableValues as Record<string, P>
}
