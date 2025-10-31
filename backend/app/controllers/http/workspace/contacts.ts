import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Contact, { preloadContact } from '#models/contact'
import { withContactOrganisations } from '#models/contact-organisation'
import { withContactTranslations } from '#models/contact-translation'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import {
  createContactValidator,
  filterContactsByValidator,
  sortContactsByValidator,
  updateContactValidator,
} from '#validators/contacts'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * ContactsController
 */
export default class ContactsController {
  /**
   * all
   * @get workspaces/:workspaceId/contacts
   * @middleware authActive workspace({as 'member'})
   * @success 200 { contacts: Contact[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterContactsByValidator)
    const sortBy = await request.sortBy(sortContactsByValidator)
    const limit = await request.limit()

    const contacts = await workspace
      .related('contacts')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload(...withContactTranslations())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
    return response.ok({ contacts: A.map(contacts, (contact) => contact.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/contacts
   * @middleware authActive workspace({as 'member'})
   * @success 201 { contact: Contact }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { translations, portraitImage, squareImage, ...payload } =
      await request.validateUsing(createContactValidator)
    const now = DateTime.now()

    const contact = await workspace.related('contacts').create({
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await contact.refresh()

    // create portrait image
    if (G.isNotNullable(portraitImage)) {
      await contact.createPortraitImage(portraitImage)
    }

    // create square image
    if (G.isNotNullable(squareImage)) {
      await contact.createSquareImage(squareImage)
    }

    await contact.save()
    await updateContactTranslations(contact, translations)

    await contact.load((query) =>
      query
        .preload(...withContactTranslations())
        .preload(...withCreatedBy())
        .preload(...withUpdatedBy())
    )
    return response.ok({ contact: contact.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/contacts/:contactId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { contact: Contact }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const contact = await workspace
      .related('contacts')
      .query()
      .where('id', request.param('contactId'))
      .preload(...withContactTranslations())
      .preload(...withContactOrganisations())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()
    if (G.isNullable(contact)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ contact: contact.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/contacts/:contactId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { contact: Contact }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const contact = await workspace
      .related('contacts')
      .query()
      .where('id', request.param('contactId'))
      .preload(...withContactTranslations())
      .first()
    if (G.isNullable(contact)) throw E_RESOURCE_NOT_FOUND

    const { translations, portraitImage, squareImage, ...payload } =
      await request.validateUsing(updateContactValidator)
    const now = DateTime.now()

    // update portrait image
    if (G.isNull(portraitImage) || G.isNotNullable(portraitImage)) {
      await contact.deletePortraitImage()
    }
    if (G.isNotNullable(portraitImage)) {
      await contact.createPortraitImage(portraitImage)
    }

    // update square image
    if (G.isNull(squareImage) || G.isNotNullable(squareImage)) {
      await contact.deleteSquareImage()
    }
    if (G.isNotNullable(squareImage)) {
      await contact.createSquareImage(squareImage)
    }

    await updateContactTranslations(contact, translations)

    await contact
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()

    await contact.load(preloadContact)

    return response.ok({ contact: contact.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/contacts/:contactId
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

    await contact.delete()

    return response.noContent()
  }
}

/**
 * Update contact translations
 */
async function updateContactTranslations(
  item: Contact,
  payloadTranslations?: Infer<typeof createContactValidator>['translations']
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
