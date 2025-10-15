import Language from '#models/language'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

const languages = [
  { name: 'English', code: 'en', locale: 'en-US', default: true },
  { name: 'French', code: 'fr', locale: 'fr-FR' },
]

export default class extends BaseSeeder {
  async run() {
    // clean database table
    await Language.query().delete()
    // create each languages
    await Promise.all(languages.map(async (language) => await Language.create(language)))
  }
}
