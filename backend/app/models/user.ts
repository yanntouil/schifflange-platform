import { E_WORKSPACE_MEMBER_REQUIRED } from '#exceptions/workspaces'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import UserConfig from '#models/user-config'
import UserProfile from '#models/user-profile'
import UserSession from '#models/user-session'
import UserToken from '#models/user-token'
import Workspace, {
  withWorkspaceInvitations,
  withWorkspaceMembers,
  withWorkspaceProfile,
  WorkspaceRoles,
} from '#models/workspace'
import LanguagesProvider from '#providers/languages_provider'
import { makeTerms } from '#utils/string'
import { filterUsersValidator, sortUsersByValidator } from '#validators/admin/users'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'
import hash from '@adonisjs/core/services/hash'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
  hasMany,
  hasOne,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  HasOne,
  ManyToMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G, S } from '@mobily/ts-belt'
import { Option } from '@mobily/ts-belt/Option'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import Notification from './notification.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

/**
 * Model: User
 * @description this model contains the user authentication data
 */
type Model = User
export default class User extends compose(ExtendedModel, AuthFinder) {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: UserStatus

  @column()
  declare role: UserRole

  @hasMany(() => UserToken, { foreignKey: 'tokenableId', serializeAs: null })
  declare tokens: HasMany<typeof UserToken>

  @hasMany(() => UserSession, { foreignKey: 'userId', serializeAs: null })
  declare sessions: HasMany<typeof UserSession>

  @hasOne(() => UserProfile, { foreignKey: 'userId' })
  declare profile: HasOne<typeof UserProfile>

  @hasOne(() => UserConfig, { foreignKey: 'userId' })
  declare config: HasOne<typeof UserConfig>

  @column()
  declare languageId: string | null
  @belongsTo(() => Language, { foreignKey: 'languageId' })
  declare language: BelongsTo<typeof Language>

  @column()
  declare workspaceId: string | null
  @belongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  declare workspace: BelongsTo<typeof Workspace>

  @manyToMany(() => Workspace, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'workspace_id',
    pivotTable: 'workspaces_members',
    pivotColumns: ['role', 'created_at'],
  })
  declare workspaces: ManyToMany<typeof Workspace>

  @hasMany(() => Notification, { foreignKey: 'userId' })
  declare notifications: HasMany<typeof Notification>

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTED
   */

  @computed()
  public get isAdmin() {
    return ['admin', 'superadmin'].includes(this.role)
  }

  @computed()
  public get isSuperAdmin() {
    return this.role === 'superadmin'
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(user: User) {
    user.password ??= string.random(24)
    user.email ??= null
    user.role ??= userDefaultRole
    user.status ??= userDefaultStatus
    user.languageId ??= LanguagesProvider.current().id
  }

  @afterCreate()
  public static async createInitialRelations(ressource: Model) {
    await Promise.all([
      ressource.related('profile').create({}),
      ressource.related('config').create({}),
    ])
  }

  @beforeDelete()
  public static async beforeDelete(ressource: User) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static isActive = scope((query) => {
    return query.where((query) => query.where('status', 'active'))
  })

  public static filterBy = scope((query, filters: Infer<typeof filterUsersValidator>) => {
    if (filters.status) {
      query.where('status', filters.status)
    }
    if (filters.role) {
      query.whereIn('role', filters.role)
    }
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortUsersByValidator>) => {
    const { field = 'updatedAt', direction = 'desc' } = sortBy
    if (field === 'firstname' || field === 'lastname') {
      return query
        .leftJoin('user_profiles', 'users.id', 'user_profiles.user_id')
        .orderBy(`user_profiles.${field}`, direction)
        .select('users.*')
    }
    return query.orderBy(field, direction)
  })

  public static search = scope((query, search: Option<string>) => {
    if (G.isNullable(search) || S.isEmpty(search)) return
    const terms = makeTerms(search)
    if (A.isNotEmpty(terms)) {
      query.leftJoin('user_profiles', 'users.id', 'user_profiles.user_id')
      query.where((query) => {
        for (const term of terms) {
          query.where((query) => {
            query.whereRaw('LOWER(users.email) LIKE ?', [`%${term}%`])
            query.orWhereRaw('LOWER(user_profiles.firstname) LIKE ?', [`%${term}%`])
            query.orWhereRaw('LOWER(user_profiles.lastname) LIKE ?', [`%${term}%`])
          })
        }
      })

      query.select('users.*')
    }
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * PRELOADER
   */

  public async preloadMe() {
    const user = this as Model
    await user.load((query) =>
      query
        .preload('language')
        .preload('sessions')
        .preload('profile')
        .preload('config')
        .preload('workspace', (query) => {
          query
            .preload(...withWorkspaceMembers)
            .preload(...withWorkspaceInvitations)
            .preload(...withWorkspaceProfile)
            .preload('theme')
            .preload('languages')
        })
    )
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZER
   */

  public serializeMe() {
    return {
      ...this.serialize(),
      language: this.language?.serialize(),
      profile: this.profile?.serialize(),
      sessions: this.sessions?.map((session) => session.serialize()),
      workspace: this.workspace?.serializeInWorkspaceFor(this),
    }
  }

  public serializeInAdmin() {
    return {
      ...this.serialize(),
      language: this.language?.serialize(),
      profile: this.profile?.serialize(),
      sessions: this.sessions?.map((session) => session.serialize()),
    }
  }

  public publicSerialize(language: Language) {
    return {
      id: this.id,
      profile: this.profile?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public getRoleInWorkspace(workspace: Workspace) {
    // get the member to update
    const member = A.find(workspace.members, (member) => member.id === this.id)
    const memberRole = member?.$extras.pivot_role as Option<WorkspaceRoles>
    if (G.isNullable(memberRole)) throw new E_WORKSPACE_MEMBER_REQUIRED()
    return {
      role: memberRole,
      isOwner: memberRole === 'owner',
      isAdmin: memberRole === 'admin' || memberRole === 'owner',
      isMember: memberRole === 'member' || memberRole === 'admin' || memberRole === 'owner',
    }
  }

  public isActive() {
    return this.status === 'active'
  }

  public isSuspended() {
    return this.status === 'suspended'
  }

  public isDeleted() {
    return this.status === 'deleted'
  }

  public isNotActive() {
    return this.status !== 'active'
  }

  public emailCompare(email: string) {
    if (this.email) return S.trim(S.toLowerCase(email)) === S.trim(S.toLowerCase(this.email))
    return false
  }

  public async passwordCompare(password: string) {
    return await hash.use('scrypt').verify(this.password, password)
  }

  public async cleanup() {
    await Promise.all([
      (await this.getOrLoadRelation('profile')).cleanup(),
      (await this.getOrLoadRelation('config')).cleanup(),
      A.map(await this.getOrLoadRelation('tokens'), (token) => token.cleanup()),
      A.map(await this.getOrLoadRelation('sessions'), (session) => session.cleanup()),
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
 * constants
 */
export const userRoles = ['member', 'admin', 'superadmin'] as const
export const userDefaultRole = userRoles[0]
export type UserRole = (typeof userRoles)[number]

export const userStatuses = ['pending', 'active', 'deleted', 'suspended'] as const
export const userDefaultStatus = userStatuses[0]
export type UserStatus = (typeof userStatuses)[number]

/**
 * serializer, preloader and query builder
 */
export const withProfile = (query: PreloaderContract<User>) => query.preload('profile')
