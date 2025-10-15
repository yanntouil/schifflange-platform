import UidService from '#services/uid'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { ExtendedNamingStrategy } from './extended-naming-strategy.js'

/**
 * ExtendedModel
 * extends BaseModel with extended naming strategy and self-assign primary key
 */
export default class ExtendedModel extends BaseModel {
  // [x: string]: any
  public static namingStrategy = new ExtendedNamingStrategy()
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  public static async initPrimaryKey(ressource: ExtendedModel) {
    ressource.id ??= UidService.generateUid()
  }
}
