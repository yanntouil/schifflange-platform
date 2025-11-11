export * from "./components"
export { useContextualLanguageContext, useLanguagesContext } from "./context"
export { useContextualLanguage, useLanguage, useLanguages } from "./context.hooks"
export type { TranslateFn } from "./context.hooks"
export {
  ContextualLanguageProvider,
  LanguagesProvider,
  type ContextualLanguageProviderProps,
  type LanguagesProviderProps,
} from "./context.provider"
export * from "./store"

/**
 * available languages on frontend
 * @see @backend/app/models/language.ts
 */
export type TranslationLanguage = "fr" | "en" | "de" | "lb"
