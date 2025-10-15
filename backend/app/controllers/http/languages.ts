import Language from '#models/language'
import type { HttpContext } from '@adonisjs/core/http'
import { A } from '@mobily/ts-belt'

/**
 * Controller: LanguagesController
 */
export default class LanguagesController {
  /**
   * all
   * retrieve all languages
   * @get languages
   * @success 200 { languages: Language[] }
   */
  public async all({ response }: HttpContext) {
    const languages = await Language.query().orderBy('name', 'asc')
    return response.ok({
      languages: A.map(languages, (language) => language.serialize()),
    })
  }
}
