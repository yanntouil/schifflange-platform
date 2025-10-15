import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { preloadContent } from '#models/content'
import Project, { preloadProjects, preloadVisits } from '#models/project'
import ProjectStep from '#models/project-step'
import { preloadSeo } from '#models/seo'
import { withProfile } from '#models/user'
import { validationFailure } from '#start/vine'
import { createProjectStepValidator, updateProjectStepValidator } from '#validators/projects'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ProjectStepsController
 */
export default class ProjectStepsController {
  /**
   * create
   * @post workspaces/:workspaceId/projects/:projectId/steps
   * @middleware authActive workspace({as 'member'})
   * @success 201 { step: ProjectStep }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createProjectStepValidator)
    const project = await Project.query()
      .where('id', request.param('projectId'))
      .andWhere('workspaceId', workspace.id)
      .preload('steps')
      .first()

    if (G.isNullable(project)) {
      return response.badRequest(validationFailure([{ field: 'projectId', rule: 'exist' }]))
    }
    const now = DateTime.now()

    // we can only create one step by type if it already exists return it
    const step =
      A.find(project.steps, (step) => step.type === payload.type) ??
      (await ProjectStep.create({
        workspaceId: workspace.id,
        projectId: project.id,
        ...payload,
        createdAt: now,
        createdById: user.id,
        updatedAt: now,
        updatedById: user.id,
      }))
    await step.refresh()
    await step.load((query) =>
      query
        .preload('seo', preloadSeo)
        .preload('content', preloadContent)
        .preload('project', preloadProjects)
        .preload('tracking', preloadVisits)
        .preload('slug')
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )
    // update parent project updated at
    await step.project
      .merge({
        updatedById: user.id,
        updatedAt: now,
      })
      .save()
    return response.ok({ step: step.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/projects/:projectId/steps/:stepId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { step: ProjectStep }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const step = await ProjectStep.query()
      .where('id', request.param('stepId'))
      .andWhere('projectId', request.param('projectId'))
      .andWhere('workspaceId', workspace.id)
      .preload('seo', preloadSeo)
      .preload('content', preloadContent)
      .preload('tracking', preloadVisits)
      .preload('slug')
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .preload('project', preloadProjects)
      .first()
    if (G.isNullable(step)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ step: step.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/projects/:projectId/steps/:stepId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { step: ProjectStep }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const step = await ProjectStep.query()
      .where('id', request.param('stepId'))
      .andWhere('projectId', request.param('projectId'))
      .andWhere('workspaceId', workspace.id)
      .preload('project', preloadProjects)
      .first()
    if (G.isNullable(step)) throw E_RESOURCE_NOT_FOUND

    const payload = await request.validateUsing(updateProjectStepValidator)
    const isDirty = payload.state && step.state !== payload.state
    if (isDirty) {
      const now = DateTime.now()
      await step
        .merge({
          ...payload,
          updatedById: user.id,
          updatedAt: now,
        })
        .save()

      // update parent project to updated at
      await step.project
        .merge({
          updatedById: user.id,
          updatedAt: now,
        })
        .save()
    }

    await step.load((query) =>
      query
        .preload('seo', preloadSeo)
        .preload('content', preloadContent)
        .preload('tracking', preloadVisits)
        .preload('slug')
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )

    return response.ok({ step: step.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/projects/:projectId/steps/:stepId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const step = await ProjectStep.query()
      .where('id', request.param('stepId'))
      .andWhere('projectId', request.param('projectId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(step)) throw E_RESOURCE_NOT_FOUND

    await step.delete()

    return response.noContent()
  }
}
