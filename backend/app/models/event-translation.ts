import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { columnJSON } from '#utils/column-json'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, PreloaderContract } from '@adonisjs/lucid/types/relations'
import { D } from '@mobily/ts-belt'

/**
 * Translatable fields in Event
 */
type Model = EventTranslation
export default class EventTranslation extends ExtendedModel {
  public static table = 'event_translations'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column()
  declare languageId: string
  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @column()
  declare eventId: string

  // props of the event translation defined by the frontend
  @column(columnJSON<Record<string, unknown>>({}))
  declare props: Record<string, unknown>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    language // unused
    return D.deleteKeys(this.serialize(), ['languageId', 'eventId'])
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async beforeCreateHook(ressource: Model) {
    ressource.props ??= {}
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    //
  }
}

/**
 * preloaders
 */
export const preloadEventTranslation = (query: PreloaderContract<EventTranslation>) => query
export const withEventTranslations = () => ['translations', preloadEventTranslation] as const
