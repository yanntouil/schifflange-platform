import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import OrganisationCategory from '#models/organisation-category'
import { withProfile } from '#models/user'
import {
  createOrganisationCategoryValidator,
  filterOrganisationCategoriesByValidator,
  sortOrganisationCategoriesByValidator,
  updateOrganisationCategoryTranslationsValidator,
  updateOrganisationCategoryValidator,
} from '#validators/organisation-categories'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * OrganisationCategoriesController
 */
export default class OrganisationCategoriesController {
  /**
   * all
   * @get workspaces/:workspaceId/organisations/categories
   * @middleware authActive workspace({as 'member'})
   * @success 200 { categories: OrganisationCategory[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterOrganisationCategoriesByValidator)
    const sortBy = await request.sortBy(sortOrganisationCategoriesByValidator)
    const limit = await request.limit()

    const categories = await OrganisationCategory.query()
      .where('workspaceId', workspace.id)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload('translations')
      .withCount('organisations', (query) => query.as('totalOrganisations'))
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .orderBy('order', 'desc')
    return response.ok({ categories: A.map(categories, (category) => category.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/organisations/categories
   * @middleware authActive workspace({as 'member'})
   * @success 201 { category: OrganisationCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { translations, image, ...payload } = await request.validateUsing(
      createOrganisationCategoryValidator
    )
    const now = DateTime.now()

    const category = await OrganisationCategory.create({
      workspaceId: workspace.id,
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await category.refresh()

    // create the image
    if (G.isNotNullable(image)) {
      await category.createImage(image)
      await category.save()
    }

    await updateCategoryTranslations(category, translations)
    await category.load((query) =>
      query
        .preload('translations')
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )
    return response.ok({ category: { ...category.serialize(), totalOrganisations: 0 } })
  }

  /**
   * read
   * @get workspaces/:workspaceId/organisations/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: OrganisationCategory }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const category = await OrganisationCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .preload('translations')
      .withCount('organisations', (query) => query.as('totalOrganisations'))
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ category: category.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/organisations/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: OrganisationCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const category = await OrganisationCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .withCount('organisations', (query) => query.as('totalOrganisations'))
      .preload('translations')
      .preload('createdBy', withProfile)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    const { translations, image, ...payload } = await request.validateUsing(
      updateOrganisationCategoryValidator
    )
    const now = DateTime.now()
    await updateCategoryTranslations(category, translations)

    // delete the image if it is null or a new image is provided
    if (G.isNull(image) || G.isNotNullable(image)) {
      await category.deleteImage()
    }
    // create the image
    if (G.isNotNullable(image)) {
      await category.createImage(image)
    }

    await category
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()
    await category.load((query) => query.preload('translations').preload('updatedBy', withProfile))

    return response.ok({ category: category.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/organisations/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const category = await OrganisationCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    await category.delete()

    return response.noContent()
  }
}

/**
 * Update category translations
 */
async function updateCategoryTranslations(
  category: OrganisationCategory,
  translations?: Record<string, { title?: string; description?: string }>
) {
  if (!translations) return
  const categoryTranslations = await category.getOrLoadRelation('translations')
  await Promise.all(
    A.map(categoryTranslations, async (translation) => {
      const payload = await updateOrganisationCategoryTranslationsValidator.validate(
        translations[translation.languageId] ?? {}
      )
      await translation.merge(payload).save()
    })
  )
}
