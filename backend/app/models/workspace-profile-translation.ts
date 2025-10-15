import Language from '#models/language'
import { Infer } from '#start/vine'
import { updateValidator } from '#validators/workspaces'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { A, D } from '@mobily/ts-belt'
import ExtendedModel from './extended/extended-model.js'

/**
 * Model WorkspaceProfileTranslation
 * this model is used to translate the workspace profile
 */
export default class WorkspaceProfileTranslation extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare profileId: string

  @column()
  declare languageId: string
  @belongsTo(() => Language, { foreignKey: 'languageId' })
  declare language: BelongsTo<typeof Language>

  @column()
  declare welcomeMessage: string

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // nothing to do here - cascade delete is enough
  }
}

/**
 * compare translations
 * @param translations - the translations to compare
 * @param workspaceTranslations - the workspace translations to compare
 * @returns true if the translations are the same, false otherwise
 */
export const compareTranslations = (
  translations: NonNullable<Infer<typeof updateValidator>['profile']['translations']>,
  workspaceTranslations: WorkspaceProfileTranslation[]
) => {
  return A.every(D.toPairs(translations), ([languageId, translation]) => {
    return A.some(D.toPairs(translation), ([key, value]) => {
      const current = A.find(workspaceTranslations, (t) => t.languageId === languageId)
      if (key === 'welcomeMessage') {
        return current?.welcomeMessage !== value
      }
      return false
    })
  })
}
