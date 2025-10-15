import Content from '#models/content'
import ContentItemTranslation from '#models/content-item-translation'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MediaFile from '#models/media-file'
import Slug from '#models/slug'
import User from '#models/user'
import { columnJSON } from '#utils/column-json'
import { beforeDelete, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  ManyToMany,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for Content Item (CMS)
 * content item is a cms container for a collection of content items
 */
type Model = ContentItem
export default class ContentItem extends ExtendedModel {
  public static table = 'content_items'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  // related content
  @column({ serializeAs: null })
  declare contentId: string
  @belongsTo(() => Content, { foreignKey: 'contentId', serializeAs: null })
  declare content: BelongsTo<typeof Content>

  // state of publication
  @column()
  declare state: ContentItemState

  // order of the item in the content
  @column()
  declare order: number

  // kind of the content item defined by the frontend
  @column()
  declare type: string

  // props of the content item defined by the frontend
  @column(columnJSON<Record<string, unknown>>({}))
  declare props: Record<string, unknown>

  // translations of the item
  @hasMany(() => ContentItemTranslation)
  declare translations: HasMany<typeof ContentItemTranslation>

  // related files of the item
  @manyToMany(() => MediaFile, {
    localKey: 'id',
    pivotForeignKey: 'item_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'file_id',
    pivotTable: 'content_items_files',
  })
  declare files: ManyToMany<typeof MediaFile>

  // related slugs of the item
  @manyToMany(() => Slug, {
    localKey: 'id',
    pivotForeignKey: 'item_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'slug_id',
    pivotTable: 'content_items_slugs',
  })
  declare slugs: ManyToMany<typeof Slug>

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
   * HOOKS
   */

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
        'state',
        'updatedById',
        'updatedBy',
        'updatedAt',
        'createdById',
        'createdBy',
        'createdAt',
      ]),
      files: A.map(this.files ?? [], (file) => file.publicSerialize(language)),
      slugs: A.map(this.slugs ?? [], (slug) => slug.publicSerialize(language)),
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
    await Promise.all(A.map(await this.getOrLoadRelation('translations'), (item) => item.cleanup()))
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
 * constants and types related to content items
 */
export const contentItemStates = ['draft', 'published'] as const
export type ContentItemState = (typeof contentItemStates)[number]
export const contentItemDefaultState = contentItemStates[0]
