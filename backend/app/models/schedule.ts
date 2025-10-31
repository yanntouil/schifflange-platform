import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { beforeDelete, column, hasMany } from '@adonisjs/lucid/orm'
import type {
  ExtractModelRelations,
  HasMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import ScheduleRule, { withScheduleRules } from './schedule-rule.js'

/**
 * Model for Schedule (time slot manager)
 * Schedule is a container for schedule rules
 */
type Model = Schedule
export default class Schedule extends ExtendedModel {
  public static table = 'schedules'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @hasMany(() => ScheduleRule, { foreignKey: 'scheduleId' })
  declare rules: HasMany<typeof ScheduleRule>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...this.serialize(),
      rules: A.map(this.rules ?? [], (rule) => rule.publicSerialize(language)),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(A.map(await this.getOrLoadRelation('rules'), (rule) => rule.cleanup()))
  }

  public isLoadedRelation(relation: NonNullable<ExtractModelRelations<Model>>) {
    return !G.isUndefined(D.getUnsafe(this.$preloaded, relation))
  }

  public async getOrLoadRelation<T extends NonNullable<ExtractModelRelations<Model>>>(relation: T) {
    if (!this.isLoadedRelation(relation)) await (this as Model).load(relation)
    return this[relation] as Model[T]
  }
}

/**
 * preloaders
 */
export const preloadSchedule = (query: PreloaderContract<Schedule>) =>
  query.preload(...withScheduleRules())
export const withSchedule = () => ['schedule', preloadSchedule] as const
