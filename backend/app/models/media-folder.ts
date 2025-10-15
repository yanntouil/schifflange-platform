import ExtendedModel from '#models/extended/extended-model'
import MediaFile from '#models/media-file'
import User from '#models/user'
import { filterByValidator, sortByValidator } from '#validators/medias'
import { beforeCreate, beforeDelete, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations, HasMany } from '@adonisjs/lucid/types/relations'
import { A, D, G, O } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * Model Folder
 */
type Model = MediaFolder
export default class MediaFolder extends ExtendedModel {
  public static table = 'media_folders'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ serialize: (value) => !!value })
  declare lock: boolean

  @column({ serializeAs: null })
  declare workspaceId: string | null

  @column()
  declare parentId: string | null
  @belongsTo(() => MediaFolder, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof MediaFolder>

  @hasMany(() => MediaFolder, {
    foreignKey: 'parentId',
  })
  declare folders: HasMany<typeof MediaFolder>

  @hasMany(() => MediaFile, {
    foreignKey: 'folderId',
  })
  declare files: HasMany<typeof MediaFile>

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

  @beforeCreate()
  public static initResource(ressource: Model) {
    ressource.parentId ??= null
    ressource.name ??= ''
    ressource.lock ??= false
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

  public static relatedToWorkspace = scope((query, workspaceId: string | null) => {
    if (G.isNullable(workspaceId)) query.whereNull('workspaceId')
    else query.where('workspaceId', workspaceId)
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public static async inTree(folders?: MediaFolder[]) {
    return populateTree(null, folders ?? (await MediaFolder.all()))
  }

  public async isParentOf(id: string, allFolders?: MediaFolder[]) {
    allFolders ??= await MediaFolder.all()
    return isInTree(id, populateTree(this.id, allFolders))
  }

  public async isChildOf(id: string, allFolders?: MediaFolder[]) {
    const all =
      allFolders ??
      (await MediaFolder.query().withScopes((scope) => scope.relatedToWorkspace(this.workspaceId)))
    return isInTree(this.id, populateTree(id, all))
  }

  public async cleanup() {
    await Promise.all([
      ...A.map(await this.getOrLoadRelation('files'), (file) => file.cleanup()),
      ...A.map(await this.getOrLoadRelation('folders'), (folder) => folder.cleanup()),
    ])
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
 * helpers
 */
const populateTree = (id: string | null, folders: MediaFolder[]): FoldersTree =>
  A.filterMap(folders, (folder) =>
    folder.parentId === id
      ? {
          id: folder.id,
          parentId: id,
          folders: populateTree(folder.id, folders),
        }
      : O.None
  )
const isInTree = (id: string, tree: FoldersTree): boolean =>
  A.some(tree, (folder) =>
    folder.id === id ? true : A.isNotEmpty(folder.folders) ? isInTree(id, folder.folders) : false
  )

/**
 * types
 */
type FoldersTree = { id: string; parentId: string | null; folders: FoldersTree }[]
