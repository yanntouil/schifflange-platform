import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MediaFile, { preloadFiles } from '#models/media-file'
import SeoTranslation from '#models/seo-translation'
import User, { preloadProfile } from '#models/user'
import {
  afterCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  ManyToMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for SEO (CMS)
 * seo is a cms container for SEO, it can be used in pages, articles or any other ressource to display meta tags formatted for SEO
 */
type Model = Seo
export default class Seo extends ExtendedModel {
  public static table = 'seos'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  // translations of the item
  @hasMany(() => SeoTranslation)
  declare translations: HasMany<typeof SeoTranslation>

  // related files of the seo
  @manyToMany(() => MediaFile, {
    localKey: 'id',
    pivotForeignKey: 'seo_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'file_id',
    pivotTable: 'seos_media_files',
  })
  declare files: ManyToMany<typeof MediaFile>

  @column({ serializeAs: null })
  declare updatedById: string | null
  @belongsTo(() => User, { foreignKey: 'updatedById' })
  declare updatedBy: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const languages = await Language.all()
    await Promise.all(
      A.map(languages, async (language) => {
        await ressource.related('translations').create({ languageId: language.id })
      })
    )
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'updatedById',
        'updatedBy',
        'updatedAt',
        'createdById',
        'createdBy',
        'createdAt',
      ]),
      files: A.map(this.files ?? [], (file) => file.publicSerialize(language)),
      translations: A.find(
        this.translations,
        (translation) => translation.languageId === language.id
      )?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(await this.getOrLoadRelation('translations'), (translation) => translation.cleanup())
    )
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
export const preloadSeo = (query: PreloaderContract<Seo>) =>
  query
    .preload('translations', (query) => query.preload('image', preloadFiles))
    .preload('files', preloadFiles)
    .preload('updatedBy', preloadProfile)
export const preloadPublicSeo = (query: PreloaderContract<Seo>) =>
  query
    .preload('translations', (query) => query.preload('image', preloadFiles))
    .preload('files', (query) => query.preload('translations'))
export const withSeo = () => ['seo', preloadSeo] as const
export const withPublicSeo = () => ['seo', preloadPublicSeo] as const
