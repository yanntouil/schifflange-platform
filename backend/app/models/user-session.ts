import { columnJSON } from '#utils/column-json'
import { type DeviceInfo, getDeviceName, makeUserAgent } from '#utils/device-parser'
import { beforeDelete, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import ExtendedModel from './extended/extended-model.js'
import User from './user.js'

/**
 * Model: UserSession
 * @description this model contains the user authentication sessions
 */
export default class UserSession extends ExtendedModel {
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
  declare ipAddress: string

  @column(columnJSON<DeviceInfo>(makeUserAgent({})))
  declare deviceInfo: DeviceInfo

  @column()
  declare token: string

  @column.dateTime()
  declare lastActivity: DateTime

  @column({ serialize: (value) => !!value })
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTED
   */

  @computed()
  get deviceName() {
    return getDeviceName(this.deviceInfo)
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeDelete()
  public static async beforeDelete(ressource: UserSession) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // nothing to do here
  }
}
