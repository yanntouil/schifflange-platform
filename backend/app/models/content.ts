import ContentItem from '#models/content-item'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { withFiles } from '#models/media-file'
import { withSlugs } from '#models/slug'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import { createContentItemValidator } from '#validators/contents'
import { beforeDelete, column, hasMany } from '@adonisjs/lucid/orm'
import type {
  ExtractModelRelations,
  HasMany,
  HasManyQueryBuilderContract,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * Model for Content (CMS)
 * content is a cms container for a collection of content items
 */
type Model = Content
export default class Content extends ExtendedModel {
  public static table = 'contents'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @hasMany(() => ContentItem)
  declare items: HasMany<typeof ContentItem>

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
      ...this.serialize(),
      items: A.map(this.items ?? [], (item) => item.publicSerialize(language)),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(A.map(await this.getOrLoadRelation('items'), (item) => item.cleanup()))
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
 * preloader
 */
export const preloadContent = (query: PreloaderContract<Content>) =>
  query.preload('items', preloadContentItems)
export const withContent = () => ['content', preloadContent] as const
export const preloadContentItems = (query: PreloaderContract<ContentItem>) =>
  query
    .preload('translations')
    .preload(...withCreatedBy())
    .preload(...withUpdatedBy())
    .preload(...withFiles())
    .preload(...withSlugs())
export const withContentItems = () => ['items', preloadContentItems] as const

export const preloadContentItem =
  (id: string) => (query: HasManyQueryBuilderContract<typeof ContentItem, any>) =>
    query
      .where('id', id)
      .preload('translations')
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .preload(...withFiles())
      .preload(...withSlugs())
export const withContentItem = () => ['item', preloadContentItem] as const

export const preloadPublicContent = (query: PreloaderContract<Content>) =>
  query.preload('items', preloadPublicContentItems)
export const withPublicContent = () => ['content', preloadPublicContent] as const

export const preloadPublicContentItems = (
  query: HasManyQueryBuilderContract<typeof ContentItem, any>
) =>
  query
    .where('state', 'published')
    .preload('translations')
    .preload('files', (query) => query.preload('translations'))
    .preload(...withSlugs())

/**
 * utils
 */
export const updateContentItemTranslation = async (
  item: ContentItem,
  payload: Infer<typeof createContentItemValidator>['translations']
) => {
  await item.getOrLoadRelation('translations')
  if (G.isNotNullable(payload)) {
    const languages = A.map(await Language.all(), D.prop('id'))
    await Promise.all(
      A.map(D.toPairs(payload), async ([languageId, translation]) => {
        // Step 1 - check if language is supported
        if (!languages.includes(languageId)) return
        // Step 2 - check if translation already exists
        const current = A.find(item.translations, (t) => t.languageId === languageId)
        // Step 3 - update or create translation
        if (G.isNotNullable(current)) return current.merge(translation).save()
        else return item.related('translations').create({ languageId, ...translation })
      })
    )
    await item.load('translations')
  }
}

/**
 * copyContentItems
 * copy content items from one content to another
 */
export const copyContentItems = async (
  original: Content,
  to: Content,
  startOrder: number,
  userId?: string
) => {
  const now = DateTime.now()
  await original.load('items', preloadContentItems)
  await to.load('items', preloadContentItems)
  const sortedItems = A.sortBy(original.items, D.prop('order'))
  await Promise.all(
    A.mapWithIndex(sortedItems, async (index, originalItem) => {
      // create a copy of content item
      const item = await to.related('items').create({
        type: originalItem.type,
        state: originalItem.state,
        order: startOrder + index,
        props: originalItem.props,
        createdAt: now,
        createdById: userId ?? originalItem.createdById,
        updatedAt: now,
        updatedById: userId ?? originalItem.updatedById,
      })
      const translations = A.reduce(originalItem.translations, {}, (acc, translation) =>
        D.set(acc, translation.languageId, {
          props: translation.props,
        })
      )
      await updateContentItemTranslation(item, translations)

      // attach files
      const files = A.map(originalItem.files, D.prop('id'))
      await item.related('files').sync(A.uniq(files))
      // attach slugs
      const slugs = A.map(originalItem.slugs, D.prop('id'))
      await item.related('slugs').sync(A.uniq(slugs))
    })
  )
}
