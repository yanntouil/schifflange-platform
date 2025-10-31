import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { withContact } from '#models/contact'
import ContactOrganisation from '#models/contact-organisation'
import { withContactOrganisationTranslations } from '#models/contact-organisation-translation'
import { withOrganisation } from '#models/organisation'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import {
  createContactOrganisationValidator,
  updateContactOrganisationValidator,
} from '#validators/contact-organisations'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * ContactOrganisationsController
 */
export default class ContactOrganisationsController {
  /**
   * all - Get all contact organisations for a specific contact
   * @get workspaces/:workspaceId/contacts/:contactId/organisations
   * @middleware authActive workspace({as 'member'})
   * @success 200 { contactOrganisations: ContactOrganisation[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async all({ workspace, request, response }: HttpContext) {
    const contact = await workspace
      .related('contacts')
      .query()
      .where('id', request.param('contactId'))
      .first()
    if (G.isNullable(contact)) throw E_RESOURCE_NOT_FOUND

    const contactOrganisations = await ContactOrganisation.query()
      .where('contact_id', contact.id)
      .preload(...withContactOrganisationTranslations())
      .preload(...withOrganisation())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .orderBy('order', 'asc')

    return response.ok({
      contactOrganisations: A.map(contactOrganisations, (co) => co.serialize()),
    })
  }

  /**
   * create
   * @post workspaces/:workspaceId/contacts/:contactId/organisations
   * @middleware authActive workspace({as 'member'})
   * @success 201 { contactOrganisation: ContactOrganisation }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { organisationId, translations, startDate, endDate, ...payload } =
      await request.validateUsing(createContactOrganisationValidator)
    const now = DateTime.now()

    // Verify contact exists in workspace
    const contact = await workspace
      .related('contacts')
      .query()
      .where('id', request.param('contactId'))
      .first()
    if (G.isNullable(contact)) throw E_RESOURCE_NOT_FOUND

    // Verify organisation exists in workspace
    const organisation = await workspace
      .related('organisations')
      .query()
      .where('id', organisationId)
      .first()
    if (G.isNullable(organisation)) throw E_RESOURCE_NOT_FOUND

    const contactOrganisation = await ContactOrganisation.create({
      ...payload,
      contactId: contact.id,
      organisationId,
      startDate: startDate ? DateTime.fromJSDate(startDate) : null,
      endDate: endDate ? DateTime.fromJSDate(endDate) : null,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await contactOrganisation.refresh()
    await updateContactOrganisationTranslations(contactOrganisation, translations)

    await contactOrganisation.load((query) =>
      query
        .preload(...withContactOrganisationTranslations())
        .preload(...withOrganisation())
        .preload(...withContact())
        .preload(...withCreatedBy())
        .preload(...withUpdatedBy())
    )

    return response.ok({ contactOrganisation: contactOrganisation.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/contacts/:contactId/organisations/:contactOrganisationId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { contactOrganisation: ContactOrganisation }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const contact = await workspace
      .related('contacts')
      .query()
      .where('id', request.param('contactId'))
      .first()
    if (G.isNullable(contact)) throw E_RESOURCE_NOT_FOUND

    const contactOrganisation = await ContactOrganisation.query()
      .where('id', request.param('contactOrganisationId'))
      .where('contact_id', contact.id)
      .preload(...withContactOrganisationTranslations())
      .preload(...withOrganisation())
      .preload(...withContact())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()

    if (G.isNullable(contactOrganisation)) throw E_RESOURCE_NOT_FOUND

    return response.ok({ contactOrganisation: contactOrganisation.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/contacts/:contactId/organisations/:contactOrganisationId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { contactOrganisation: ContactOrganisation }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    // /api/workspaces/79863107-6434-48d5-8cfa-648ec40e6d78/contacts/196b188d-3f79-4c7a-9f19-82ca6eec0a39/organisations/5769bdfe-79d6-47fb-b888-9dafbba271e6
    const contact = await workspace
      .related('contacts')
      .query()
      .where('id', request.param('contactId'))
      .first()
    if (G.isNullable(contact)) throw E_RESOURCE_NOT_FOUND

    const contactOrganisation = await ContactOrganisation.query()
      .where('id', request.param('contactOrganisationId'))
      .where('contact_id', contact.id)
      .preload(...withContactOrganisationTranslations())
      .first()
    if (G.isNullable(contactOrganisation)) throw E_RESOURCE_NOT_FOUND

    const { translations, startDate, endDate, ...payload } = await request.validateUsing(
      updateContactOrganisationValidator
    )
    const now = DateTime.now()

    await updateContactOrganisationTranslations(contactOrganisation, translations)

    await contactOrganisation
      .merge({
        ...payload,
        ...(!G.isUndefined(startDate) && {
          startDate: startDate ? DateTime.fromJSDate(startDate) : null,
        }),
        ...(!G.isUndefined(endDate) && {
          endDate: endDate ? DateTime.fromJSDate(endDate) : null,
        }),
        updatedById: user.id,
        updatedAt: now,
      })
      .save()

    await contactOrganisation.load((query) =>
      query
        .preload(...withContactOrganisationTranslations())
        .preload(...withOrganisation())
        .preload(...withContact())
        .preload(...withCreatedBy())
        .preload(...withUpdatedBy())
    )

    return response.ok({ contactOrganisation: contactOrganisation.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/contacts/:contactId/organisations/:contactOrganisationId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const contact = await workspace
      .related('contacts')
      .query()
      .where('id', request.param('contactId'))
      .first()
    if (G.isNullable(contact)) throw E_RESOURCE_NOT_FOUND

    const contactOrganisation = await ContactOrganisation.query()
      .where('id', request.param('contactOrganisationId'))
      .where('contact_id', contact.id)
      .first()
    if (G.isNullable(contactOrganisation)) throw E_RESOURCE_NOT_FOUND

    await contactOrganisation.delete()

    return response.noContent()
  }
}

/**
 * Update contact organisation translations
 */
async function updateContactOrganisationTranslations(
  item: ContactOrganisation,
  payloadTranslations?: Infer<typeof createContactOrganisationValidator>['translations']
) {
  if (!payloadTranslations) return
  const Language = (await import('#models/language')).default
  const languages = await Language.query()
  const itemTranslations = await item.getOrLoadRelation('translations')
  await Promise.all(
    A.map(languages, async ({ id }) => {
      const existingTranslation = A.find(itemTranslations, (t) => t.languageId === id)
      const payload = D.get(payloadTranslations, id) ?? {}
      if (G.isNotNullable(existingTranslation)) return existingTranslation.merge(payload).save()
      return item.related('translations').create({ languageId: id, ...payload })
    })
  )
}
