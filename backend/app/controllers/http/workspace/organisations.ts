import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { preloadOrganisationContact } from '#models/contact-organisation'
import Organisation, { preloadOrganisation, withChildOrganisations } from '#models/organisation'
import { preloadOrganisationCategory } from '#models/organisation-category'
import { withProfile } from '#models/user'
import { validationFailure } from '#start/vine'
import {
  createOrganisationValidator,
  filterOrganisationsByValidator,
  sortOrganisationsByValidator,
  updateOrganisationValidator,
} from '#validators/organisations'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * OrganisationsController
 */
export default class OrganisationsController {
  /**
   * all
   * @get workspaces/:workspaceId/organisations
   * @middleware authActive workspace({as 'member'})
   * @success 200 { organisations: Organisation[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterOrganisationsByValidator)
    const sortBy = await request.sortBy(sortOrganisationsByValidator)
    const limit = await request.limit()

    const organisations = await workspace
      .related('organisations')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .withCount('contactOrganisations', (query) => query.as('contactCount'))
      .preload('translations')
      .preload('categories', preloadOrganisationCategory)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
    return response.ok({ organisations: A.map(organisations, (org) => org.serialize()) })
  }

  /**
   * rootIndex
   * @get workspaces/:workspaceId/organisations/root
   * @middleware authActive workspace({as 'member'})
   * @success 200 { organisations: Organisation[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async rootIndex({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterOrganisationsByValidator)
    const sortBy = await request.sortBy(sortOrganisationsByValidator)
    const limit = await request.limit()

    const organisations = await workspace
      .related('organisations')
      .query()
      .whereNull('parentOrganisationId')
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload('translations')
      .preload('categories', preloadOrganisationCategory)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
    return response.ok({ organisations: A.map(organisations, (org) => org.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/organisations
   * @post workspaces/:workspaceId/organisations/:organisationId/organisations
   * @middleware authActive workspace({as 'member'})
   * @success 201 { organisation: Organisation }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const {
      parentOrganisationId: parentIdFromPayload,
      translations,
      categoryIds,
      logoImage,
      cardImage,
      ...payload
    } = await request.validateUsing(createOrganisationValidator)
    const now = DateTime.now()

    const parentOrganisationId: string | null = G.isUndefined(parentIdFromPayload)
      ? (request.param('organisationId') ?? null)
      : parentIdFromPayload

    if (G.isNotNullable(parentOrganisationId)) {
      const parent = await workspace
        .related('organisations')
        .query()
        .where('id', parentOrganisationId)
        .first()
      if (G.isNullable(parent)) throw E_RESOURCE_NOT_FOUND
    }

    const organisation = await workspace.related('organisations').create({
      ...payload,
      parentOrganisationId,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await organisation.refresh()

    // create logo image
    if (G.isNotNullable(logoImage)) {
      await organisation.createLogoImage(logoImage)
    }

    // create card image
    if (G.isNotNullable(cardImage)) {
      await organisation.createCardImage(cardImage)
    }

    // attach categories
    if (G.isNotNullable(categoryIds)) {
      await organisation.related('categories').attach(categoryIds)
    }

    await organisation.save()
    await updateOrganisationTranslations(organisation, translations)

    await organisation.load((query) =>
      query
        .preload('translations')
        .preload('categories', preloadOrganisationCategory)
        .preload('parentOrganisation', preloadOrganisation)
        .preload(...withChildOrganisations)
        .preload('contactOrganisations', preloadOrganisationContact)
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )
    return response.ok({ organisation: organisation.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/organisations/:organisationId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { organisation: Organisation }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const organisation = await workspace
      .related('organisations')
      .query()
      .where('id', request.param('organisationId'))
      .withCount('contactOrganisations', (query) => query.as('contactCount'))
      .preload('translations')
      .preload('categories', preloadOrganisationCategory)
      .preload('parentOrganisation', preloadOrganisation)
      .preload(...withChildOrganisations)
      .preload('contactOrganisations', preloadOrganisationContact)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .first()
    if (G.isNullable(organisation)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ organisation: organisation.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/organisations/:organisationId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { organisation: Organisation }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const organisation = await workspace
      .related('organisations')
      .query()
      .where('id', request.param('organisationId'))
      .withCount('contactOrganisations', (query) => query.as('contactCount'))
      .preload('translations')
      .preload('categories', preloadOrganisationCategory)
      .preload('createdBy', withProfile)
      .first()
    if (G.isNullable(organisation)) throw E_RESOURCE_NOT_FOUND

    const { parentOrganisationId, translations, categoryIds, logoImage, cardImage, ...payload } =
      await request.validateUsing(updateOrganisationValidator)
    const now = DateTime.now()

    // validate parent
    if (G.isNotNullable(parentOrganisationId)) {
      const organisations = await workspace.related('organisations').query()
      const parent = A.find(organisations, ({ id }) => id === parentOrganisationId)
      if (G.isNullable(parent))
        return response.badRequest(
          validationFailure([{ field: 'parentOrganisationId', rule: 'exist' }])
        )
      if (await organisation.isParentOf(parentOrganisationId, organisations))
        return response.badRequest(
          validationFailure([{ field: 'parentOrganisationId', rule: 'circular' }])
        )
    }

    // update logo image
    if (G.isNull(logoImage) || G.isNotNullable(logoImage)) {
      await organisation.deleteLogoImage()
    }
    if (G.isNotNullable(logoImage)) {
      await organisation.createLogoImage(logoImage)
    }

    // update card image
    if (G.isNull(cardImage) || G.isNotNullable(cardImage)) {
      await organisation.deleteCardImage()
    }
    if (G.isNotNullable(cardImage)) {
      await organisation.createCardImage(cardImage)
    }

    // update categories
    if (G.isNotNullable(categoryIds)) {
      await organisation.related('categories').sync(categoryIds)
    }

    await updateOrganisationTranslations(organisation, translations)

    await organisation
      .merge({
        ...payload,
        parentOrganisationId: parentOrganisationId ?? organisation.parentOrganisationId,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()

    await organisation.load((query) =>
      query
        .preload('translations')
        .preload('categories', preloadOrganisationCategory)
        .preload('parentOrganisation', preloadOrganisation)
        .preload(...withChildOrganisations)
        .preload('contactOrganisations', preloadOrganisationContact)
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )

    return response.ok({ organisation: organisation.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/organisations/:organisationId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const organisation = await workspace
      .related('organisations')
      .query()
      .where('id', request.param('organisationId'))
      .first()
    if (G.isNullable(organisation)) throw E_RESOURCE_NOT_FOUND

    await organisation.delete()

    return response.noContent()
  }
}

/**
 * Update organisation translations
 */
async function updateOrganisationTranslations(
  item: Organisation,
  payloadTranslations?: Infer<typeof createOrganisationValidator>['translations']
) {
  if (!payloadTranslations) return
  const Language = (await import('#models/language')).default
  const languages = await Language.query()
  const itemTranslations = await item.getOrLoadRelation('translations')
  await Promise.all(
    A.map(languages, async ({ id }) => {
      const existingTranslation = A.find(itemTranslations, (t) => t.languageId === id)
      const payload = G.isNotNullable(payloadTranslations[id]) ? payloadTranslations[id] : {}
      if (G.isNotNullable(existingTranslation)) return existingTranslation.merge(payload).save()
      return item.related('translations').create({ languageId: id, ...payload })
    })
  )
}
