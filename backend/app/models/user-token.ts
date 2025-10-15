import UidService from '#services/uid'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { Secret, base64, safeEqual } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { createHash } from 'node:crypto'
import User from './user.js'

/**
 * Models UserToken
 */
const prefix = 'oat:'
export default class UserToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare tokenableId: string

  @belongsTo(() => User, { foreignKey: 'tokenableId' })
  declare user: BelongsTo<typeof User>

  @column()
  declare type: string

  @column()
  declare protectedValue: string | null

  @column()
  declare value: string

  @column()
  declare hash: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(token: UserToken) {
    token.id = UidService.generateUid()

    const { secret, hash } = AccessToken.seed(32)
    token.value = `${prefix}${base64.urlEncode(String(token.id))}.${base64.urlEncode(secret.release())}`
    token.hash = hash

    token.protectedValue ??= null

    // by default, the token expires in 1 hour
    token.expiresAt ??= DateTime.now().plus({ hours: 1 })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * STATICS
   */

  static decode(value: string): null | { identifier: string; secret: Secret<string> } {
    return AccessToken.decode(prefix, value)
  }

  static seed(size: number) {
    return AccessToken.seed(size)
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeDelete()
  public static async beforeDelete(ressource: UserToken) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public isExpired() {
    return this.expiresAt && this.expiresAt < DateTime.now()
  }

  public verify(secret: Secret<string>): boolean {
    const newHash = createHash('sha256').update(secret.release()).digest('hex')
    return safeEqual(this.hash, newHash)
  }

  public async cleanup() {
    // nothing to do here
  }
}
