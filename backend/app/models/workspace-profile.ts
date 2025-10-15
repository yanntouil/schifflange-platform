import folders from '#config/folders'
import { makePath } from '#services/drive'
import FileService, { SingleImage } from '#services/files/file'
import { Infer } from '#start/vine'
import { columnJSON } from '#utils/column-json'
import { updateValidator } from '#validators/workspaces'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { afterCreate, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import type { ExtractModelRelations, HasMany } from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import ExtendedModel from './extended/extended-model.js'
import Language from './language.js'
import WorkspaceProfileTranslation from './workspace-profile-translation.js'

/**
 * Model WorkspaceProfile
 */
type Model = WorkspaceProfile
export default class WorkspaceProfile extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare logo: SingleImage | null

  @hasMany(() => WorkspaceProfileTranslation, { foreignKey: 'profileId' })
  declare translations: HasMany<typeof WorkspaceProfileTranslation>

  @column()
  declare workspaceId: string

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(workspaceProfile: Model) {
    workspaceProfile.logo ??= FileService.emptyImage
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const languages = await Language.all()
    await Promise.all(
      A.map(languages, async (language) => {
        await ressource.related('translations').create({ languageId: language.id })
      })
    )
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async createLogo(file: MultipartFile) {
    await this.deleteLogo()
    this.logo = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080],
      thumbnailSize: [400],
    })
    return this.logo
  }

  public async deleteLogo() {
    this.logo = await FileService.deleteImage(this.logo)
    return this.logo
  }

  public async mergeTranslations(
    translations: NonNullable<Infer<typeof updateValidator>['profile']['translations']>
  ) {
    const workspaceTranslations = await this.getOrLoadRelation('translations')
    await Promise.all(
      A.map(D.toPairs(translations), async ([languageId, translation]) => {
        const current = A.find(workspaceTranslations, (t) => t.languageId === languageId)
        if (G.isNotNullable(current)) return current.merge(translation).save()
      })
    )
  }

  public makePath() {
    return makePath(folders.workspace.root, this.workspaceId, folders.workspace.profile)
  }

  public async cleanup() {
    await FileService.deleteImage(this.logo)
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
