import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import Schedule from '#models/schedule'
import { columnJSON, columnJSONDateTimeArray } from '#utils/column-json'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for ScheduleRule (time slot management)
 * ScheduleRule represents a specific time slot for a schedule
 */
type Model = ScheduleRule
export default class ScheduleRule extends ExtendedModel {
  public static table = 'schedule_rules'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  declare scheduleId: string
  @belongsTo(() => Schedule, { foreignKey: 'scheduleId' })
  declare schedule: BelongsTo<typeof Schedule>

  // Schedule time
  @column({ serialize: (value) => !!value })
  declare allDay: boolean

  @column.dateTime({ serialize: (value) => value?.toISODate() ?? null })
  declare startDate: DateTime | null

  @column.dateTime({ serialize: (value) => value?.toISODate() ?? null })
  declare endDate: DateTime | null

  @column.dateTime()
  declare startDateTime: DateTime | null

  @column.dateTime()
  declare endDateTime: DateTime | null

  // Recurrence
  @column({ serialize: (value) => !!value })
  declare isRecurring: boolean

  @column()
  declare freq: RecurringFrequency

  @column()
  declare interval: number

  @column(columnJSON<number[]>([]))
  declare byWeekday: number[]

  @column.dateTime({ serialize: (value) => value?.toISODate() ?? null })
  declare until: DateTime | null

  @column(columnJSONDateTimeArray())
  declare excludedDates: DateTime<true>[]

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async beforeCreateHook(ressource: Model) {
    // Set defaults for fields
    ressource.allDay ??= false
    ressource.startDate ??= null
    ressource.endDate ??= null
    ressource.startDateTime ??= null
    ressource.endDateTime ??= null
    ressource.isRecurring ??= false
    ressource.freq ??= recurringFrequencyDefault
    ressource.interval ??= 1
    ressource.byWeekday ??= []
    ressource.excludedDates ??= []
    ressource.until ??= null
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(_language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), ['scheduleId']),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // Nothing to cleanup for schedules (no related entities)
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
 * Constants and types related to schedules
 */
export const recurringFrequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const
export type RecurringFrequency = (typeof recurringFrequencies)[number]
export const recurringFrequencyDefault = recurringFrequencies[0]

/**
 * preloaders
 */
export const preloadScheduleRule = (query: PreloaderContract<ScheduleRule>) => query
export const withScheduleRules = () => ['rules', preloadScheduleRule] as const
