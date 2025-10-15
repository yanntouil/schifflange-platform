import { localizeConfig } from "./config"
import { makeDictionary } from "./utils"

export type LocalizeConfig = typeof localizeConfig
export type LocalizeLanguage = (typeof localizeConfig)["languages"][number]
export type DefaultLanguage = (typeof localizeConfig)["defaultLanguage"]
export type Dictionary = {
  [key: string]: string | Dictionary
}
export type Translation = Record<LocalizeLanguage, Dictionary> & Record<string, Dictionary>
export type DictionaryFn = ReturnType<typeof makeDictionary>
export type DictionaryReplacements = Record<string, string | number>
export type DictionaryContext = string
