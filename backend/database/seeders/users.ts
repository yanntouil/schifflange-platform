import Language from '#models/language'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const language = await Language.findByOrFail('code', 'en')
    await User.query().delete()
    await User.create({
      email: 'yann@101.lu',
      password: 'password',
      status: 'active',
      role: 'admin',
      languageId: language.id,
    })
  }
}
