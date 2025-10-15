import FileService, { SingleImage } from '#services/files/file'
import { Infer } from '#start/vine'
import { columnJSON } from '#utils/column-json'
import { makeTerms } from '#utils/string'
import { filterThemesValidator, sortThemesByValidator } from '#validators/admin/workspaces'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { beforeCreate, column, scope } from '@adonisjs/lucid/orm'
import type { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { A, D, G, O, S } from '@mobily/ts-belt'
import ExtendedModel from './extended/extended-model.js'

type Option<T> = O.Option<T>

/**
 * Model WorkspaceTheme
 */
type Model = WorkspaceTheme
export default class WorkspaceTheme extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column({ serialize: (value) => !!value })
  declare isDefault: boolean

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare image: SingleImage | null

  @column(columnJSON<Record<string, unknown>>({}))
  declare config: Record<string, unknown>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(workspaceTheme: Model) {
    workspaceTheme.isDefault ??= false
    workspaceTheme.image ??= FileService.emptyImage
    workspaceTheme.config ??= {}
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filters: Infer<typeof filterThemesValidator>) => {
    if (G.isNotNullable(filters.isDefault)) {
      query.where('isDefault', filters.isDefault)
    }
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortThemesByValidator>) => {
    const { field = 'name', direction = 'asc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static search = scope((query, search: Option<string>) => {
    if (G.isNullable(search) || S.isEmpty(search)) return
    const terms = makeTerms(search)
    if (A.isNotEmpty(terms)) {
      query.where((query) => {
        for (const term of terms) {
          query.where((query) => {
            query
              .whereRaw('LOWER(workspace_themes.name) LIKE ?', [`%${term}%`])
              .orWhereRaw('LOWER(workspace_themes.description) LIKE ?', [`%${term}%`])
          })
        }
      })
      query.select('workspace_themes.*')
    }
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */
  public async createImage(file: MultipartFile) {
    this.image = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080],
    })
  }

  public async deleteImage() {
    this.image = await FileService.deleteImage(this.image)
  }

  private makePath() {
    return `themes/${this.id}`
  }

  public async cleanup() {
    //
  }

  public isLoadedRelation(relation: NonNullable<ExtractModelRelations<Model>>) {
    return !G.isUndefined(D.getUnsafe(this.$preloaded, relation))
  }

  public async getOrLoadRelation<T extends NonNullable<ExtractModelRelations<Model>>>(relation: T) {
    if (!this.isLoadedRelation(relation)) await (this as Model).load(relation)
    return this[relation] as Model[T]
  }
}
