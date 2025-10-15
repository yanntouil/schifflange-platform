import { columnJSON } from '#utils/column-json'
import { beforeCreate, beforeDelete, column } from '@adonisjs/lucid/orm'
import ExtendedModel from './extended/extended-model.js'
import { NotificationType } from './notification.js'

/**
 * Model UserConfig
 */
type Model = UserConfig
export default class UserConfig extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column()
  declare userId: string

  @column(columnJSON<NotificationsConfig>({}))
  declare notifications: NotificationsConfig

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(config: Model) {
    config.notifications ??= {}
  }

  @beforeDelete()
  public static async cleanup(profile: Model) {
    await profile.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // do nothing atm
  }
}

export type NotificationsConfig = Partial<Record<NotificationType, NotificationConfig>>
export type NotificationConfig = {
  email: boolean
  push: boolean
}
