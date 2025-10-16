import folders from '#config/folders'
import { makePath } from '#services/drive'
import FileService, { type SingleImage } from '#services/files/file'
import { columnJSON } from '#utils/column-json'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { beforeCreate, beforeDelete, column } from '@adonisjs/lucid/orm'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'
import ExtendedModel from './extended/extended-model.js'
import Language from './language.js'

/**
 * Model Profile
 */
type Model = UserProfile
export default class UserProfile extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column()
  declare firstname: string
  @column({ serialize: (value) => value })
  declare lastname: string
  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare image: SingleImage
  @column.date()
  declare dob: DateTime | null

  @column()
  declare position: string
  @column()
  declare company: string

  @column(columnJSON<ExtraField[]>([]))
  declare phones: ExtraField[]
  @column(columnJSON<ExtraField[]>([]))
  declare emails: ExtraField[]
  @column(columnJSON<Address>(makeAddress()))
  declare address: Address
  @column(columnJSON<ExtraField[]>([]))
  declare extras: ExtraField[]

  @column({ serializeAs: null })
  declare userId: string

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(profile: Model) {
    profile.address ??= makeAddress()
    profile.image ??= FileService.emptyImage
  }

  @beforeDelete()
  public static async cleanup(profile: Model) {
    await profile.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async createImage(file: MultipartFile) {
    await this.deleteImage()
    this.image = await FileService.makeImage(file, {
      folder: this.makePath('profile'),
      previewSize: [1080, 1080],
      thumbnailSize: [400, 400],
    })
    return this.image
  }

  public async deleteImage() {
    this.image = await FileService.deleteImage(this.image)
    return this.image
  }

  public makePath(key?: Omit<keyof typeof folders.user, 'root'>) {
    if (key) return makePath(folders.user.root, this.userId, key as string)
    return makePath(folders.user.root, this.userId)
  }

  public async cleanup() {
    await this.deleteImage()
  }

  public isLoadedRelation(relation: NonNullable<ExtractModelRelations<Model>>) {
    return !G.isUndefined(D.getUnsafe(this.$preloaded, relation))
  }

  public async getOrLoadRelation<T extends NonNullable<ExtractModelRelations<Model>>>(relation: T) {
    if (!this.isLoadedRelation(relation)) await (this as Model).load(relation)
    return this[relation] as Model[T]
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    language // unused
    return this.serialize()
  }
}

/**
 * utils
 */
export function makeAddress(data: Partial<Address> = {}): Address {
  return {
    street: data.street ?? '',
    city: data.city ?? '',
    state: data.state ?? '',
    zip: data.zip ?? '',
    country: data.country ?? '',
  }
}

/**
 * types
 */
export type ExtraField = {
  name: string
  value: string
  type?:
    | 'phone'
    | 'email'
    | 'url'
    | 'text'
    | 'number'
    | 'boolean'
    | 'date'
    | 'time'
    | 'datetime'
    | 'textarea'
}
export type Address = {
  street: string
  city: string
  state: string
  zip: string
  country: string
}
export type ProfileSerialized = {
  firstname: string
  lastname: string
  image: ReturnType<typeof FileService.serializeImage>
  dob: string | null
  position: string
  company: string
  phones: ExtraField[]
  emails: ExtraField[]
  address: Address
  extras: ExtraField[]
}
