import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import FileTranslation from '#models/media-file-translation'
import MediaFolder from '#models/media-folder'
import User from '#models/user'
import { driveDeleteSafe } from '#services/drive'
import { type FileExif } from '#services/files/exif'
import { columnJSON } from '#utils/column-json'
import { filterByValidator, sortByValidator } from '#validators/medias'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
  hasMany,
  scope,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import path from 'path'

/**
 *  Model MediaFile
 */
type Model = MediaFile
export default class MediaFile extends ExtendedModel {
  public static table = 'media_files'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @hasMany(() => FileTranslation, { foreignKey: 'fileId' })
  declare translations: HasMany<typeof FileTranslation>

  @column()
  declare size: number
  @column()
  declare width: number | null
  @column()
  declare height: number | null
  @column()
  declare extension: string
  @column()
  declare originalName: string
  @column(columnJSON<Partial<FileExif>>({}))
  declare exif: Partial<FileExif>

  @column()
  declare copyright: string
  @column()
  declare copyrightLink: string

  @column({ serializeAs: null })
  declare path: string
  @column()
  declare url: string

  @column({ serializeAs: null })
  declare thumbnailPath: string
  @column()
  declare thumbnailUrl: string

  @column({ serializeAs: null })
  declare previewPath: string
  @column()
  declare previewUrl: string

  @column({ serializeAs: null })
  declare originalPath: string
  @column()
  declare originalUrl: string
  @column(columnJSON<Transform | {}>({}))
  declare transform: Transform | {}

  @column({ serializeAs: null })
  declare workspaceId: string

  @column()
  declare folderId: string | null
  @belongsTo(() => MediaFolder, { foreignKey: 'folderId' })
  declare folder: BelongsTo<typeof MediaFolder>

  @column()
  declare createdById: string | null
  @belongsTo(() => User, { foreignKey: 'createdById' })
  declare createdBy: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare updatedById: string | null
  @belongsTo(() => User, { foreignKey: 'updatedById' })
  declare updatedBy: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTED
   */

  // translatable fields
  @computed()
  get name() {
    return Language.findIn(this.translations)?.name
  }
  @computed()
  get alt() {
    return Language.findIn(this.translations)?.alt
  }
  @computed()
  get caption() {
    return Language.findIn(this.translations)?.caption
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static initResource(ressource: Model) {
    ressource.folderId ??= null
    ressource.originalPath ??= ressource.path
    ressource.originalUrl ??= ressource.url
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const languages = await Language.all()
    const name = path.parse(ressource.originalName).name
    await Promise.all(
      A.map(languages, async (language) => {
        await ressource.related('translations').create({ languageId: language.id, name })
      })
    )
  }

  @beforeDelete()
  public static async cleanup(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filterBy: Infer<typeof filterByValidator>) => {
    if (D.isEmpty(filterBy)) return query
    return query.andWhere((query) => {
      if (filterBy.isTemplate !== undefined) query.where('is_template', filterBy.isTemplate)
    })
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortByValidator>) => {
    const { field = 'createdAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static search = scope((query, search: string | undefined) => {
    if (G.isNullable(search)) return query
    return query.andWhere('name', 'like', `%${search}%`)
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'name',
        'alt',
        'caption',
        'originalName',
        'transform',
        'exif',
        'folderId',
        'originalUrl',
        'updatedById',
        'updatedBy',
        'updatedAt',
        'createdById',
        'createdBy',
        'createdAt',
      ]),
      translations: A.find(
        this.translations,
        (translation) => translation.languageId === language.id
      )?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async mergeTranslations(translations: {
    [K: string]: { name?: string; caption?: string; alt?: string }
  }) {
    const fileTranslations = await this.getOrLoadRelation('translations')
    await Promise.all(
      A.map(D.toPairs(translations), async ([languageId, translation]) => {
        const current = A.find(fileTranslations, (t) => t.languageId === languageId)
        if (G.isNotNullable(current)) return current.merge(translation).save()
      })
    )
  }

  public async deleteFiles() {
    return Promise.all([
      driveDeleteSafe(this.originalPath),
      driveDeleteSafe(this.path),
      driveDeleteSafe(this.thumbnailPath),
      driveDeleteSafe(this.previewPath),
    ])
  }

  public async cleanup() {
    await Promise.all([this.deleteFiles()])
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
 * Transform
 */
export type Transform = Size &
  Coord & {
    rotate: number
    cropper: {
      zoom: number
      crop: Coord
      aspect: Aspect
    }
  }
type Coord = {
  x: number
  y: number
}
type Size = {
  width: number
  height: number
}
type Aspect = {
  w: number
  h: number
}

/**
 * preloader
 */
export const preloadFiles = (query: PreloaderContract<MediaFile>) =>
  query
    .preload('translations')
    .preload('createdBy', (query) => query.preload('profile'))
    .preload('updatedBy', (query) => query.preload('profile'))
