import ExtendedModel from '#models/extended/extended-model'
import User from '#models/user'
import { beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

/**
 * Model: RegistrationAttempt
 * @description this model contains the registration attempts
 * ?RGPD: clean-architecture
 */
export default class RegistrationAttempt extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare email: string

  @column()
  declare ipAddress: string

  @column()
  declare userAgent: string

  @column()
  declare success: boolean

  @column()
  declare notificationSent: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeDelete()
  public static async beforeDelete(ressource: RegistrationAttempt) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // nothing to do here
  }
}
