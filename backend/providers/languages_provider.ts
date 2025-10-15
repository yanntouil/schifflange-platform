import Language from '#models/language'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { ApplicationService } from '@adonisjs/core/types'
import { A, D, G } from '@mobily/ts-belt'
import { Option } from '@mobily/ts-belt/Option'

/**
 * languages list in memory cache
 */
export default class LanguagesProvider {
  constructor(protected app: ApplicationService) {}
  static languages: Language[] = []

  register() {}

  async boot() {}

  async start() {}

  async ready() {
    await LanguagesProvider.init()
  }

  async shutdown() {}

  static async init() {
    try {
      LanguagesProvider.languages = await Language.all()
    } catch (e) {
      logger.error('enable to init languages', e)
    }
  }

  static all() {
    return LanguagesProvider.languages
  }

  static current(requestParam?: HttpContext['request']) {
    try {
      const request = requestParam ?? HttpContext.getOrFail().request

      const languages = LanguagesProvider.all()

      // get current language from param
      const languageId = request.param('languageId')
      if (G.isNotNullable(languageId)) {
        const current = A.find(languages, ({ id }) => id === languageId)
        if (G.isNotNullable(current)) return current
      }

      // get current language from request
      const codes = A.filterMap(languages, ({ code }) => code)
      const code = request.language([...codes])
      if (G.isNotNullable(code)) {
        const current = A.find(languages, (language) => language.code === code)
        if (G.isNotNullable(current)) return current
      }

      // get default language
      const current = A.find(languages, D.prop('default'))
      if (G.isNotNullable(current)) return current
    } catch (error) {
      error // unused variable
    }
    return LanguagesProvider.defaultLanguage
  }
  static getOrDefault(language: Option<string>) {
    // check if language is available
    if (G.isNotNullable(language)) {
      const current = A.find(LanguagesProvider.all(), ({ code }) => code === language)
      if (G.isNotNullable(current)) return current
    }
    // return default language
    return LanguagesProvider.defaultLanguage
  }

  static get defaultLanguage() {
    return A.find(LanguagesProvider.all(), D.prop('default')) as Language
  }
}
