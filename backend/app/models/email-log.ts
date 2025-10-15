import ExtendedModel from '#models/extended/extended-model'
import User from '#models/user'
import { columnJSON } from '#utils/column-json'
import { filterEmailLogsValidator } from '#validators/email-logs'
import { beforeDelete, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * Model: EmailLog
 * @description this model contains logs of all emails sent by the application
 */
export default class EmailLog extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string | null
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare email: string

  @column()
  declare template: string

  @column()
  declare subject: string

  @column()
  declare status: EmailStatus

  @column(columnJSON<Record<string, unknown>>({}))
  declare metadata: Record<string, unknown>

  @column()
  declare retryAttempts: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeDelete()
  public static async beforeDelete(ressource: EmailLog) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filterBy: Infer<typeof filterEmailLogsValidator>) => {
    if (D.isEmpty(filterBy)) return query
    const { status, email, template } = filterBy
    if (G.isNotNullable(status)) query.andWhere('status', status)
    if (G.isNotNullable(email)) query.andWhere('email', 'like', `%${email}%`)
    if (G.isNotNullable(template)) query.andWhere('template', template)
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // nothing to do here
  }
}

/**
 * Email status types
 */
export const emailStatuses = ['queued', 'sent', 'failed'] as const
export type EmailStatus = (typeof emailStatuses)[number]
