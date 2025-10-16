import folders from '#config/folders'
import { E_UNLOADED_RELATION } from '#exceptions/models'
import Article from '#models/article'
import Contact from '#models/contact'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MediaFile from '#models/media-file'
import MediaFolder from '#models/media-folder'
import Organisation from '#models/organisation'
import OrganisationCategory from '#models/organisation-category'
import Page from '#models/page'
import User from '#models/user'
import WorkspaceProfile from '#models/workspace-profile'
import WorkspaceTheme from '#models/workspace-theme'
import WorkspaceInvitation from '#models/workspaces-invitation'
import { drive, makePath } from '#services/drive'
import FileService, { type SingleImage } from '#services/files/file'
import { Infer } from '#start/vine'
import { columnJSON } from '#utils/column-json'
import { makeTerms } from '#utils/string'
import { filterWorkspacesValidator, sortWorkspacesByValidator } from '#validators/admin/workspaces'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import { ExtractScopes } from '@adonisjs/lucid/types/model'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  HasOne,
  ManyToMany,
  ManyToManyQueryBuilderContract,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G, S } from '@mobily/ts-belt'
import { DateTime } from 'luxon'
import ArticleCategory from './article-category.js'
import Forward from './forward.js'
import Menu from './menu.js'
import Slug from './slug.js'
import Template from './template.js'
import { makeWorkspaceConfig, type WorkspaceConfig } from './workspace-config.js'

/**
 * Model Workspace
 */
type Model = Workspace
export default class Workspace extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare image: SingleImage

  @column()
  declare status: WorkspaceStatus

  @column()
  declare type: WorkspaceType

  @column(columnJSON<WorkspaceConfig>(makeWorkspaceConfig(), makeWorkspaceConfig))
  declare config: WorkspaceConfig

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * RELATED MODELS
   */

  @column()
  declare themeId: string | null
  @belongsTo(() => WorkspaceTheme, { foreignKey: 'themeId' })
  declare theme: BelongsTo<typeof WorkspaceTheme>

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'workspace_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'workspaces_members',
    pivotColumns: ['role', 'created_at'],
  })
  declare members: ManyToMany<typeof User>

  @manyToMany(() => Language, {
    localKey: 'id',
    pivotForeignKey: 'workspace_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'language_id',
    pivotTable: 'workspaces_languages',
  })
  declare languages: ManyToMany<typeof Language>

  @hasOne(() => WorkspaceProfile, { foreignKey: 'workspaceId' })
  declare profile: HasOne<typeof WorkspaceProfile>

  @hasMany(() => WorkspaceInvitation)
  declare invitations: HasMany<typeof WorkspaceInvitation>

  @hasMany(() => MediaFolder)
  declare folders: HasMany<typeof MediaFolder>

  @hasMany(() => MediaFile)
  declare files: HasMany<typeof MediaFile>

  @hasMany(() => Slug)
  declare slugs: HasMany<typeof Slug>

  @hasMany(() => Forward)
  declare forwards: HasMany<typeof Forward>

  @hasMany(() => Menu)
  declare menus: HasMany<typeof Menu>

  @hasMany(() => Template)
  declare templates: HasMany<typeof Template>

  @hasMany(() => Page)
  declare pages: HasMany<typeof Page>

  @hasMany(() => Article)
  declare articles: HasMany<typeof Article>

  @hasMany(() => ArticleCategory)
  declare articleCategories: HasMany<typeof ArticleCategory>

  @hasMany(() => Organisation)
  declare organisations: HasMany<typeof Organisation>

  @hasMany(() => OrganisationCategory)
  declare organisationCategories: HasMany<typeof OrganisationCategory>

  @hasMany(() => Contact)
  declare contacts: HasMany<typeof Contact>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(workspace: Model) {
    workspace.status ??= workspaceDefaultStatus
    workspace.type ??= workspaceDefaultType
    workspace.themeId ??= null
    workspace.image ??= FileService.emptyImage
  }

  @beforeDelete()
  public static async cleanup(workspace: Model) {
    await workspace.cleanup()
  }

  @afterCreate()
  public static async initRelations(workspace: Model) {
    await workspace.related('profile').create({})
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static inActive = scope((query) => {
    return query.where('status', 'active')
  })

  public static inCurrent = scope((query, workspaceId: string) => {
    return query.where((query) =>
      query.where('workspaces.id', workspaceId).andWhere('status', 'active')
    )
  })

  public static filterBy = scope((query, filters: Infer<typeof filterWorkspacesValidator>) => {
    if (filters.status) {
      query.where('status', filters.status)
    }
    if (filters.type) {
      query.where('type', filters.type)
    }
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortWorkspacesByValidator>) => {
    const { field = 'updatedAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static search = scope((query, search: Option<string>) => {
    if (G.isNullable(search) || S.isEmpty(search)) return
    const terms = makeTerms(search)
    if (A.isNotEmpty(terms)) {
      query.where((query) => {
        for (const term of terms) {
          query.where((query) => {
            query.whereRaw('LOWER(workspaces.name) LIKE ?', [`%${term}%`])
          })
        }
      })
      query.select('workspaces.*')
    }
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public serializeMember() {
    return {
      totalMembers: this.$extras.totalMembers,
      memberRole: this.$extras.pivot_role,
      memberCreatedAt: this.$extras.pivot_created_at,
    }
  }
  public serializeMembers() {
    if (!this.isLoadedRelation('members'))
      throw new E_UNLOADED_RELATION(
        'you need to preload members relation before using serializeMembers in Workspace model'
      )
    return {
      members: A.map(this.members, (member) => ({
        ...member.serialize(),
        workspaceRole: member.$extras.pivot_role,
        workspaceCreatedAt: member.$extras.pivot_created_at,
      })),
    }
  }
  public serializeAs() {
    return this.serialize() as WorkspaceSerialized
  }

  public serializeInWorkspaceFor(user: User) {
    const authMember = A.find(this.members, (member) => member.id === user.id)
    return {
      ...this.serialize(),
      ...this.serializeMembers(),
      totalMembers: this.members.length,
      memberRole: authMember?.$extras.pivot_role,
      memberCreatedAt: authMember?.$extras.pivot_created_at,
    }
  }
  public serializeInAdmin() {
    return {
      ...this.serialize(),
      theme: this.theme?.serialize(),
      profile: this.profile?.serialize(),
      ...this.serializeMembers(),
      invitations: A.map(this.invitations, (invitation) => invitation.serialize()),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public isActive() {
    return this.status === 'active'
  }

  public isNotActive() {
    return this.status !== 'active'
  }

  public async createImage(file: MultipartFile) {
    this.image = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080],
      thumbnailSize: [400],
    })
  }

  public async deleteImage() {
    this.image = await FileService.deleteImage(this.image)
  }

  public makePath(key?: Omit<keyof typeof folders.workspace, 'root'>) {
    if (key) return makePath(folders.workspace.root, this.id, key as string)
    return makePath(folders.workspace.root, this.id)
  }

  public async cleanup() {
    // cleanup hasOne relations
    await Promise.all(
      A.map(['profile'] as const, async (related) =>
        (await this.getOrLoadRelation(related)).cleanup()
      )
    )
    // cleanup hasMany simple relations (cleanup is enough)
    await Promise.all(
      A.map(['invitations'] as const, async (related) => {
        const children = await this.getOrLoadRelation(related)
        await Promise.all(children.map((child) => child.cleanup()))
      })
    )
    // cleanup hasMany complex relations (need to delete)
    await Promise.all(
      A.map(
        [
          'articleCategories',
          'articles',
          'pages',
          'templates',
          'organisationCategories',
          'organisations',
          'contacts',
        ] as const,
        async (related) => {
          const children = await this.getOrLoadRelation(related)
          await Promise.all(children.map((child) => child.delete()))
        }
      )
    )
    // cleanup medias
    await Promise.all(
      A.map(
        await this.getOrLoadRelation('folders'),
        (folder) => G.isNullable(folder.parentId) && folder.cleanup()
      )
    )
    await Promise.all(
      A.map(
        await this.getOrLoadRelation('files'),
        (file) => G.isNullable(file.folderId) && file.cleanup() // folder cleanup is done need only do the root
      )
    )
    // remove the workspace folder
    await drive.deleteAll(this.makePath())
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
 * constants
 */
export const workspaceRoles = ['member', 'admin', 'owner'] as const
export const workspaceDefaultRole = workspaceRoles[0]
export type WorkspaceRoles = (typeof workspaceRoles)[number]

export const workspaceStatuses = ['active', 'deleted', 'suspended'] as const
export const workspaceDefaultStatus = workspaceStatuses[0]
export type WorkspaceStatus = (typeof workspaceStatuses)[number]

export const workspaceTypes = ['schifflange-website'] as const
export const workspaceDefaultType = workspaceTypes[0]
export type WorkspaceType = (typeof workspaceTypes)[number]

/**
 * scopes
 */

export const inCurrentWorkspace =
  (workspaceId: string) => (scopes: ExtractScopes<typeof Workspace>) =>
    scopes.inCurrent(workspaceId)

export const inActiveWorkspace = () => (scopes: ExtractScopes<typeof Workspace>) =>
  scopes.inActive()

/**
 * loaders
 */

export const withWorkspaceProfile = [
  'profile',
  (query: PreloaderContract<WorkspaceProfile>) => query.preload('translations'),
] as const
export const withWorkspaceMembers = [
  'members',
  (query: ManyToManyQueryBuilderContract<typeof User, any>) =>
    query.withScopes((scopes) => scopes.isActive()).preload('profile'),
] as const
export const withWorkspaceMembersForAdmin = [
  'members',
  (query: ManyToManyQueryBuilderContract<typeof User, any>) =>
    query
      .withScopes((scopes) => scopes.isActive())
      .preload('profile')
      .preload('language')
      .preload('sessions'),
] as const
export const withWorkspaceInvitations = [
  'invitations',
  (query: ManyToManyQueryBuilderContract<typeof WorkspaceInvitation, any>) =>
    query.preload('createdBy', (query) => query.preload('profile')),
] as const

/**
 * maxRoleAssignable
 * return the max role assignable to the member related to the workspace role
 */
export const maxRoleAssignable = (
  workspaceRole: WorkspaceRoles,
  memberRole: WorkspaceRoles
): WorkspaceRoles => {
  const workspaceRoleIndex = workspaceRoles.indexOf(workspaceRole)
  const memberRoleIndex = workspaceRoles.indexOf(memberRole)
  if (workspaceRoleIndex >= memberRoleIndex) return memberRole
  else return workspaceRole
}

/**
 * getAssignableRoles
 * return an array of assignable roles related to the user role
 */
export const getAssignableRoles = (
  userRole: WorkspaceRoles,
  targetCurrentRole: WorkspaceRoles
): WorkspaceRoles[] => {
  // set assignable roles to an array related to the user role
  if (userRole === 'owner') {
    return ['owner', 'admin', 'member'] // owner can assign owner, admin, member
  } else if (userRole === 'admin') {
    if (targetCurrentRole === 'owner') {
      return [] // admin cannot change owner role
    }
    return ['admin', 'member'] // admin can assign admin or member if the target role is not owner
  } else {
    return [] // member cannot assign any role
  }
}

/**
 * canIAssign
 * return true if the user can assign the option role to the target role
 */
export const canIAssign = (
  userRole: WorkspaceRoles,
  targetCurrentRole: WorkspaceRoles,
  optionRole: WorkspaceRoles
): boolean => {
  const assignableRoles = getAssignableRoles(userRole, targetCurrentRole)
  return assignableRoles.includes(optionRole) // Disabled if the role is not in the assignable roles
}

/**
 * canIRemove
 * return true if the user can remove the target role
 */
export const canIRemove = (
  userRole: WorkspaceRoles,
  targetCurrentRole: WorkspaceRoles
): boolean => {
  if (userRole === 'owner') {
    return true // owner can remove any role
  } else if (userRole === 'admin') {
    return targetCurrentRole === 'admin' || targetCurrentRole === 'member' // admin can remove admin or member
  } else {
    return false // member cannot remove any role
  }
}

/**
 * serialized
 */
export type WorkspaceSerialized = {
  id: string
  name: string
  image: ReturnType<typeof FileService.serializeImage>
  status: WorkspaceStatus
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}
