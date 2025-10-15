import { languages } from "."

/**
 * define the language type use to describe the language in the api
 */
export type Language = {
  id: string
  name: string
  code: string
  locale: string
  default: boolean
  isDefault: boolean
}
export type LanguagesService = ReturnType<typeof languages>
