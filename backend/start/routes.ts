/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from './kernel.js'

/**
 * transmit configuration and routes
 */
transmit.registerRoutes(() => {
  // if (route.getPattern() === '__transmit/events') {
  //   route.middleware(middleware.silentAuth())
  //   return
  // }
  // route.use(throttle)
})
transmit.authorize<{ id: string }>(':id', async (ctx: HttpContext, { id }) => {
  if (id.startsWith('notification|')) {
    await ctx.auth.check()
    const userId = id.replace('notification|', '')
    return ctx.auth.user?.id === userId
  }
  return true
})

/**
 * Controllers imports
 */
const Controller = {
  languages: () => import('#controllers/http/languages'),
  mails: () => import('#controllers/http/mails'),
  previews: () => import('#controllers/http/previews'),
  opengraphs: () => import('#controllers/http/opengraphs'),
  auth: () => import('#controllers/http/auth'),
  healthcheck: () => import('#controllers/http/healthcheck'),
  workspaces: () => import('#controllers/http/workspaces'),
  notifications: () => import('#controllers/http/notifications'),
  trackings: () => import('#controllers/http/trackings'),
  sites: () => import('#controllers/http/sites'),
  workspace: {
    workspaces: () => import('#controllers/http/workspace/workspaces'),
    medias: () => import('#controllers/http/workspace/medias'),
    seos: () => import('#controllers/http/workspace/seos'),
    contents: () => import('#controllers/http/workspace/contents'),
    templates: () => import('#controllers/http/workspace/templates'),
    publications: () => import('#controllers/http/workspace/publications'),
    pages: () => import('#controllers/http/workspace/pages'),
    articles: () => import('#controllers/http/workspace/articles'),
    articleCategories: () => import('#controllers/http/workspace/article-categories'),
    projectCategories: () => import('#controllers/http/workspace/project-categories'),
    projectTags: () => import('#controllers/http/workspace/project-tags'),
    projects: () => import('#controllers/http/workspace/projects'),
    projectSteps: () => import('#controllers/http/workspace/project-steps'),
    menus: () => import('#controllers/http/workspace/menus'),
    forwards: () => import('#controllers/http/workspace/forwards'),
    slugs: () => import('#controllers/http/workspace/slugs'),
  },
  admin: {
    users: () => import('#controllers/http/admin/users'),
    workspaces: () => import('#controllers/http/admin/workspaces'),
    emailLogs: () => import('#controllers/http/admin/email-logs'),
    securityLogArchives: () => import('#controllers/http/admin/security-log-archives'),
    securityLogs: () => import('#controllers/http/admin/security-logs'),
  },
}

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- PUBLIC --
 */
router.any('/health', [Controller.healthcheck, 'handle'])
router
  .group(() => {
    const { mails } = Controller
    router.get('/registration', [mails, 'registration'])
    router.get('/tried-to-register', [mails, 'triedToRegister'])
    router.get('/password-reset', [mails, 'passwordReset'])
    router.get('/email-change-verification', [mails, 'emailChangeVerification'])

    router.get('/account-disabled', [mails, 'accountDisabled'])
    router.get('/account-activated', [mails, 'accountActivated'])
    router.get('/account-deleted', [mails, 'accountDeleted'])
    router.get('/account-pending', [mails, 'accountPending'])

    router.get('/account-password-reset', [mails, 'accountPasswordReset'])
    router.get('/account-email-change', [mails, 'accountEmailChange'])
    router.get('/account-welcome', [mails, 'accountWelcome'])
    router.get('/account-authentication', [mails, 'accountAuthentication'])

    router.get('/workspace-invitation', [mails, 'workspaceInvitation'])
    router.get('/workspace-invitation/:exists', [mails, 'workspaceInvitation'])
    router.get('/workspace-invitation-sign-up', [mails, 'workspaceInvitationSignUp'])
  })
  .prefix('/mails/:locale')
router.get('/', async () => ({ hello: 'compo' }))
router
  .group(() => {
    const { previews, opengraphs } = Controller
    router.get('/opengraphs', [opengraphs, 'index'])
    router.get('/previews', [previews, 'index'])
  })
  .prefix('/api')

// Test endpoint for new scheduler
router.get('/debug/scheduler', async () => {
  try {
    const scheduler = await import('#start/scheduler')
    return {
      success: true,
      jobs: scheduler.default.getJobs(),
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    }
  }
})

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- AUTH --
 */
router
  .group(() => {
    const { auth, notifications } = Controller
    // Auth public routes
    router.post('/auth/login', [auth, 'login'])
    router.post('/auth/register', [auth, 'register'])
    router.post('/auth/forgot-password', [auth, 'forgotPassword'])
    router.post('/auth/verify-token', [auth, 'verifyToken'])
    router.get('/auth/session', [auth, 'session']).middleware(middleware.silentAuth())

    // Auth routes
    router
      .group(() => {
        router.post('/auth/logout', [auth, 'logout'])
        router.put('/auth', [auth, 'update'])
        router.delete('/auth', [auth, 'delete'])
        router.put('/auth/profile', [auth, 'updateProfile'])

        // Notifications routes
        router.get('/auth/notifications', [notifications, 'index'])
        router.put('/auth/notifications/mark-all-read', [notifications, 'markAllAsRead'])
        router
          .put('/auth/notifications/:id', [notifications, 'markAsRead'])
          .where('id', router.matchers.uuid())
        router
          .delete('/auth/notifications/:id', [notifications, 'destroy'])
          .where('id', router.matchers.uuid())
        router.delete('/auth/notifications', [notifications, 'destroyAll'])

        // Session management routes
        router
          .group(() => {
            router.get('/auth/sessions', [auth, 'sessions'])
            router.delete('/auth/sessions/:id', [auth, 'deactivateSession'])
          })
          .middleware(middleware.checkActiveSession())

        // Workspaces routes
        router.get('/auth/workspaces/invitations', [
          Controller.workspace.workspaces,
          'myInvitations',
        ])
        router.post('/auth/workspaces/invitations/:invitationId', [
          Controller.workspace.workspaces,
          'myInvitationsAccept',
        ])
        router.delete('/auth/workspaces/invitations/:invitationId', [
          Controller.workspace.workspaces,
          'myInvitationsRefuse',
        ])
      })
      .middleware(middleware.auth())
  })
  // Prefix all API routes with /api
  .prefix('/api')

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- ADMIN --
 */
router
  .group(() => {
    const { users, workspaces, emailLogs, securityLogArchives, securityLogs } = Controller.admin
    /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
     * -- ADMIN USERS --
     */
    router.get('/users', [users, 'index'])
    router.post('/users', [users, 'store'])
    router.get('/users/:id', [users, 'show'])
    router.put('/users/:id', [users, 'update'])
    router.delete('/users/:id', [users, 'destroy'])
    router.post('/users/:id/send-invitation/:invitationType', [users, 'sendInvitation'])
    router.post('/users/sign-in-as/:id', [users, 'signInAs']).middleware(middleware.superadmin())
    router.delete('/users/:id/sessions/:sessionId', [users, 'deactivateSession'])
    router.post('/users/email-exists', [users, 'emailExists'])
    router.put('/users/:id/profile', [users, 'updateProfile'])
    router.get('/users/stats', [users, 'stats'])

    /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
     * -- ADMIN SECURITY LOGS --
     */
    router.get('/security-logs', [securityLogs, 'index'])
    router.get('/security-logs/:id', [securityLogs, 'show'])
    router.get('/users/:userId/security-logs', [securityLogs, 'userLogs'])

    /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
     * -- ADMIN SECURITY LOG ARCHIVES --
     */
    router.get('/security-logs/archives', [securityLogArchives, 'index'])
    router.get('/security-logs/archives/:filename', [securityLogArchives, 'download'])
    router.get('/security-logs/archives/:filename/view', [securityLogArchives, 'view'])

    /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
     * -- ADMIN EMAIL LOGS --
     */
    router.get('/email-logs', [emailLogs, 'index'])
    router.get('/email-logs/:id', [emailLogs, 'show'])
    router.get('/email-logs/:id/preview', [emailLogs, 'preview'])
    router.post('/email-logs/:id', [emailLogs, 'resend'])

    /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
     * -- ADMIN TRACKINGS --
     */
    const { trackings } = Controller
    // traces
    router.get('/trackings/traces/', [trackings, 'adminTracesStats'])
    router.get('/trackings/traces/browser', [trackings, 'adminTracesByBrowser'])
    router.get('/trackings/traces/device', [trackings, 'adminTracesByDevice'])
    router.get('/trackings/traces/os', [trackings, 'adminTracesByOs'])
    router.get('/trackings/traces/hour', [trackings, 'adminTracesByHour'])
    router.get('/trackings/traces/day', [trackings, 'adminTracesByDay'])
    router.get('/trackings/traces/week', [trackings, 'adminTracesByWeek'])
    router.get('/trackings/traces/month', [trackings, 'adminTracesByMonth'])
    router.get('/trackings/traces/year', [trackings, 'adminTracesByYear'])
    // trackings
    router.get('/trackings/:trackingId/seed', [trackings, 'seed'])
    router.get('/trackings/:trackingId/', [trackings, 'adminTrackingStats'])
    router.get('/trackings/:trackingId/browser', [trackings, 'adminTrackingByBrowser'])
    router.get('/trackings/:trackingId/device', [trackings, 'adminTrackingByDevice'])
    router.get('/trackings/:trackingId/os', [trackings, 'adminTrackingByOs'])
    router.get('/trackings/:trackingId/hour', [trackings, 'adminTrackingByHour'])
    router.get('/trackings/:trackingId/day', [trackings, 'adminTrackingByDay'])
    router.get('/trackings/:trackingId/week', [trackings, 'adminTrackingByWeek'])
    router.get('/trackings/:trackingId/month', [trackings, 'adminTrackingByMonth'])
    router.get('/trackings/:trackingId/year', [trackings, 'adminTrackingByYear'])

    /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
     * -- ADMIN WORKSPACES --
     */
    router
      .group(() => {
        // workspaces
        router.get('/', [workspaces, 'index'])
        router.post('/', [workspaces, 'store'])
        router.get('/:workspaceId', [workspaces, 'show'])
        router.put('/:workspaceId', [workspaces, 'update'])
        router.delete('/:workspaceId', [workspaces, 'destroy'])
        // workspace members
        router.put('/:workspaceId/members/:memberId', [workspaces, 'updateMember'])
        router.post('/:workspaceId/members/:memberId', [workspaces, 'attachMember'])
        router.delete('/:workspaceId/members/:memberId', [workspaces, 'detachMember'])
        // workspace invitations
        router.post('/:workspaceId/invitations', [workspaces, 'createInvitation'])
        router.delete('/:workspaceId/invitations/:invitationId', [workspaces, 'deleteInvitation'])
        // workspace logs
        router.get('/logs', [workspaces, 'logs'])
        router.get('/:workspaceId/logs', [workspaces, 'logsByWorkspace'])
        // workspace themes
        router.get('/themes', [workspaces, 'themesIndex'])
        router.post('/themes', [workspaces, 'themeStore'])
        router.get('/themes/:themeId', [workspaces, 'themeShow'])
        router.put('/themes/:themeId', [workspaces, 'themeUpdate'])
        router.delete('/themes/:themeId', [workspaces, 'themeDestroy'])
      })
      .prefix('/workspaces')
      .where('workspaceId', router.matchers.uuid())
      .where('memberId', router.matchers.uuid())
      .where('invitationId', router.matchers.uuid())
      .where('themeId', router.matchers.uuid())
  })
  .prefix('/api/admin')
  .where('id', router.matchers.uuid())
  .middleware([middleware.auth(), middleware.admin()])

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES --
 */

// User workspaces routes (no workspace context needed)
router
  .group(() => {
    const { workspaces } = Controller.workspace
    router.get('/workspaces', [workspaces, 'list'])
    router.get('/workspaces/themes', [workspaces, 'themesIndex'])
  })
  .middleware(middleware.auth())
  .prefix('/api')

// Individual workspace routes (require workspace context)
router
  .group(() => {
    const { workspaces } = Controller.workspace
    // basic workspace operations
    router.get('/', [workspaces, 'read'])
    router.post('/sign-in', [workspaces, 'signIn'])
    router.put('/', [workspaces, 'update']).middleware(middleware.workspace({ as: 'admin' }))
    router.delete('/', [workspaces, 'destroy']).middleware(middleware.workspace({ as: 'owner' }))
    // workspace members
    router.get('/members', [workspaces, 'listMembers'])
    router
      .group(() => {
        router.put('/members/:memberId', [workspaces, 'updateMember'])
        router.delete('/members/:memberId', [workspaces, 'detachMember'])
        router.delete('/members/me', [workspaces, 'detachMe'])
      })
      .middleware(middleware.workspace({ as: 'admin' }))
    // workspace invitations
    router.get('/invitations', [workspaces, 'listInvitations'])
    router
      .group(() => {
        router.post('/invitations', [workspaces, 'createInvitation'])
        router.delete('/invitations/:invitationId', [workspaces, 'deleteInvitation'])
      })
      .middleware(middleware.workspace({ as: 'admin' }))
    // workspace configurations
    router
      .group(() => {
        router.put('config/languages', [workspaces, 'languagesUpdate'])
        router.put('/config', [workspaces, 'configurationUpdate'])
      })
      .middleware(middleware.workspace({ as: 'admin' }))
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('memberId', router.matchers.uuid())
  .where('invitationId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES MEDIAS --
 */
router
  .group(() => {
    const { medias } = Controller.workspace
    // medias root
    router.get('/medias', [medias, 'rootIndex'])
    router.get('/medias/folders', [medias, 'foldersAll'])

    // folders routes
    router.post('/medias/folders', [medias, 'foldersCreate'])
    router.get('/medias/folders/:folderId', [medias, 'foldersRead'])
    router.put('/medias/folders/:folderId', [medias, 'foldersUpdate'])
    router.delete('/medias/folders/:folderId', [medias, 'foldersDelete'])
    router.post('/medias/folders/:folderId/folders', [medias, 'foldersCreate'])
    router.post('/medias/folders/:folderId/files', [medias, 'filesCreate'])

    // files routes
    router.post('/medias/files', [medias, 'filesCreate'])
    router.get('/medias/files/:fileId', [medias, 'filesRead'])
    router.put('/medias/files/:fileId', [medias, 'filesUpdate'])
    router.delete('/medias/files/:fileId', [medias, 'filesDelete'])
    router.post('/medias/files/:fileId', [medias, 'filesCopy'])
    router.put('/medias/files/:fileId/crop', [medias, 'filesCrop'])
    router.delete('/medias/files/:fileId/crop', [medias, 'filesUncrop'])
    router.post('/medias/files/:fileId/crop', [medias, 'filesCropAs'])
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('folderId', router.matchers.uuid())
  .where('fileId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES TEMPLATES --
 */
router
  .group(() => {
    const { templates, contents } = Controller.workspace
    // templates
    router.get('/templates', [templates, 'all'])
    router.post('/templates', [templates, 'create'])
    router.get('/templates/:templateId', [templates, 'read'])
    router.put('/templates/:templateId', [templates, 'update'])
    router.delete('/templates/:templateId', [templates, 'delete'])
    router.post('/templates/:templateId/duplicate', [templates, 'duplicate'])

    // content
    router.put('/templates/:templateId/content', [contents, 'update'])
    router.post('/templates/:templateId/content/items', [contents, 'createItem'])
    router.put('/templates/:templateId/content/items/:itemId', [contents, 'updateItem'])
    router.delete('/templates/:templateId/content/items/:itemId', [contents, 'deleteItem'])
    router.put('/templates/:templateId/content/items', [contents, 'reorderItems'])
    router
      .post('/templates/:templateId/content/items/from-template/:fromTemplateId', [
        contents,
        'appendFromTemplate',
      ])
      .where('fromTemplateId', router.matchers.uuid())
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('templateId', router.matchers.uuid())
  .where('contentId', router.matchers.uuid())
  .where('itemId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES PAGES --
 */
router
  .group(() => {
    const { seos, contents, pages } = Controller.workspace
    // pages
    router.get('/pages', [pages, 'all'])
    router.post('/pages', [pages, 'create'])
    router.get('/pages/:pageId', [pages, 'read'])
    router.put('/pages/:pageId', [pages, 'update'])
    router.delete('/pages/:pageId', [pages, 'delete'])
    // seo
    router.put('/pages/:pageId/seo', [seos, 'update'])
    // content
    router.put('/pages/:pageId/content', [contents, 'update'])
    router.post('/pages/:pageId/content/items', [contents, 'createItem'])
    router.put('/pages/:pageId/content/items/:itemId', [contents, 'updateItem'])
    router.delete('/pages/:pageId/content/items/:itemId', [contents, 'deleteItem'])
    router.put('/pages/:pageId/content/items', [contents, 'reorderItems'])
    router
      .post('/pages/:pageId/content/items/from-template/:fromTemplateId', [
        contents,
        'appendFromTemplate',
      ])
      .where('fromTemplateId', router.matchers.uuid())
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('pageId', router.matchers.uuid())
  .where('contentId', router.matchers.uuid())
  .where('itemId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES ARTICLES --
 */
router
  .group(() => {
    const { seos, contents, publications, articles, articleCategories } = Controller.workspace
    // categories
    router.get('/articles/categories', [articleCategories, 'all'])
    router.post('/articles/categories', [articleCategories, 'create'])
    router.get('/articles/categories/:categoryId', [articleCategories, 'read'])
    router.put('/articles/categories/:categoryId', [articleCategories, 'update'])
    router.delete('/articles/categories/:categoryId', [articleCategories, 'delete'])
    //articles
    router.get('/articles', [articles, 'all'])
    router.post('/articles', [articles, 'create'])
    router.get('/articles/:articleId', [articles, 'read'])
    router.put('/articles/:articleId', [articles, 'update'])
    router.delete('/articles/:articleId', [articles, 'delete'])
    // seo
    router.put('/articles/:articleId/seo', [seos, 'update'])
    // publication
    router.put('/articles/:articleId/publication', [publications, 'update'])
    // content
    router.put('/articles/:articleId/content', [contents, 'update'])
    router.post('/articles/:articleId/content/items', [contents, 'createItem'])
    router.put('/articles/:articleId/content/items/:itemId', [contents, 'updateItem'])
    router.delete('/articles/:articleId/content/items/:itemId', [contents, 'deleteItem'])
    router.put('/articles/:articleId/content/items', [contents, 'reorderItems'])
    router
      .post('/articles/:articleId/content/items/from-template/:fromTemplateId', [
        contents,
        'appendFromTemplate',
      ])
      .where('fromTemplateId', router.matchers.uuid())
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('articleId', router.matchers.uuid())
  .where('categoryId', router.matchers.uuid())
  .where('contentId', router.matchers.uuid())
  .where('publicationId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES PROJECTS --
 */
router
  .group(() => {
    const { seos, contents, publications, projects, projectCategories, projectTags, projectSteps } =
      Controller.workspace
    // categories
    router.get('/projects/categories', [projectCategories, 'all'])
    router.post('/projects/categories', [projectCategories, 'create'])
    router.get('/projects/categories/:categoryId', [projectCategories, 'read'])
    router.put('/projects/categories/:categoryId', [projectCategories, 'update'])
    router.delete('/projects/categories/:categoryId', [projectCategories, 'delete'])
    // tags
    router.get('/projects/tags', [projectTags, 'all'])
    router.post('/projects/tags', [projectTags, 'create'])
    router.get('/projects/tags/:tagId', [projectTags, 'read'])
    router.put('/projects/tags/:tagId', [projectTags, 'update'])
    router.delete('/projects/tags/:tagId', [projectTags, 'delete'])
    // projects
    router.get('/projects', [projects, 'all'])
    router.post('/projects', [projects, 'create'])
    router.get('/projects/:projectId', [projects, 'read'])
    router.put('/projects/:projectId', [projects, 'update'])
    router.delete('/projects/:projectId', [projects, 'delete'])
    // projects seo
    router.put('/projects/:projectId/seo', [seos, 'update'])
    // projects publication
    router.put('/projects/:projectId/publication', [publications, 'update'])
    // projects content
    router.put('/projects/:projectId/content', [contents, 'update'])
    router.post('/projects/:projectId/content/items', [contents, 'createItem'])
    router.put('/projects/:projectId/content/items/:itemId', [contents, 'updateItem'])
    router.delete('/projects/:projectId/content/items/:itemId', [contents, 'deleteItem'])
    router.put('/projects/:projectId/content/items', [contents, 'reorderItems'])
    router
      .post('/projects/:projectId/content/items/from-template/:fromTemplateId', [
        contents,
        'appendFromTemplate',
      ])
      .where('fromTemplateId', router.matchers.uuid())
    // steps
    router.post('/projects/:projectId/steps', [projectSteps, 'create'])
    router.get('/projects/:projectId/steps/:stepId', [projectSteps, 'read'])
    router.put('/projects/:projectId/steps/:stepId', [projectSteps, 'update'])
    router.delete('/projects/:projectId/steps/:stepId', [projectSteps, 'delete'])
    // steps seo
    router.put('/projects/:projectId/steps/:stepId/seo', [seos, 'update'])
    // steps publication
    router.put('/projects/:projectId/steps/:stepId/publication', [publications, 'update'])
    // steps content
    router.put('/projects/:projectId/steps/:stepId/content', [contents, 'update'])
    router.post('/projects/:projectId/steps/:stepId/content/items', [contents, 'createItem'])
    router.put('/projects/:projectId/steps/:stepId/content/items/:itemId', [contents, 'updateItem'])
    router.delete('/projects/:projectId/steps/:stepId/content/items/:itemId', [
      contents,
      'deleteItem',
    ])
    router.put('/projects/:projectId/steps/:stepId/content/items', [contents, 'reorderItems'])
    router
      .post('/projects/:projectId/steps/:stepId/content/items/from-template/:fromTemplateId', [
        contents,
        'appendFromTemplate',
      ])
      .where('fromTemplateId', router.matchers.uuid())
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('projectId', router.matchers.uuid())
  .where('categoryId', router.matchers.uuid())
  .where('contentId', router.matchers.uuid())
  .where('publicationId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES MENUS --
 */
router
  .group(() => {
    const { menus } = Controller.workspace

    // menus routes
    router.get('/menus', [menus, 'all'])
    router.post('/menus', [menus, 'create'])
    router.get('/menus/:menuId', [menus, 'read'])
    router.put('/menus/:menuId', [menus, 'update'])
    router.delete('/menus/:menuId', [menus, 'delete'])

    // menu items routes
    router.post('/menus/:menuId/items', [menus, 'createItem'])
    router.put('/menus/:menuId/items/:itemId', [menus, 'updateItem'])
    //.where('menuId', router.matchers.uuid())
    router.delete('/menus/:menuId/items/:itemId', [menus, 'deleteItem'])

    // reorder items in menu or under parent item
    router.put('/menus/:menuId/items', [menus, 'reorderItems'])
    router.put('/menus/:menuId/items/:itemId/items', [menus, 'reorderItems'])

    // move item (change parent or menu)
    router.put('/menus/items/:itemId/move', [menus, 'moveItem'])
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('menuId', router.matchers.uuid())
  .where('itemId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES SLUGS --
 */
router
  .group(() => {
    const { slugs } = Controller.workspace
    router.get('/slugs/', [slugs, 'all'])
    router.put('/slugs/:slugId', [slugs, 'update'])
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('slugId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACES FORWARDS --
 */
router
  .group(() => {
    const { forwards } = Controller.workspace
    router.get('/forwards/', [forwards, 'all'])
    router.post('/forwards/', [forwards, 'create'])
    router.get('/forwards/:forwardId', [forwards, 'read'])
    router.put('/forwards/:forwardId', [forwards, 'update'])
    router.delete('/forwards/:forwardId', [forwards, 'delete'])
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .prefix('/api/workspaces/:workspaceId')
  .where('workspaceId', router.matchers.uuid())
  .where('forwardId', router.matchers.uuid())

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- WORKSPACEs TRACKINGS --
 */
router
  .group(() => {
    const { trackings } = Controller
    /* http://127.0.0.1:3140/api//workspaces/b825d97c-82d2-4989-8104-1b271b05e7cd/trackings/0aa6df3f-5841-41d3-8dea-375b09860980/month?from=2024-08-01&to=2025-08-31 */
    // traces
    router.get('/trackings/traces/', [trackings, 'tracesStats'])
    router.get('/trackings/traces/browser', [trackings, 'tracesByBrowser'])
    router.get('/trackings/traces/device', [trackings, 'tracesByDevice'])
    router.get('/trackings/traces/os', [trackings, 'tracesByOs'])
    router.get('/trackings/traces/hour', [trackings, 'tracesByHour'])
    router.get('/trackings/traces/day', [trackings, 'tracesByDay'])
    router.get('/trackings/traces/week', [trackings, 'tracesByWeek'])
    router.get('/trackings/traces/month', [trackings, 'tracesByMonth'])
    router.get('/trackings/traces/year', [trackings, 'tracesByYear'])
    // trackings
    router.get('/trackings/:trackingId/seed', [trackings, 'seed'])
    router.get('/trackings/:trackingId/', [trackings, 'trackingStats'])
    router.get('/trackings/:trackingId/browser', [trackings, 'trackingByBrowser'])
    router.get('/trackings/:trackingId/device', [trackings, 'trackingByDevice'])
    router.get('/trackings/:trackingId/os', [trackings, 'trackingByOs'])
    router.get('/trackings/:trackingId/hour', [trackings, 'trackingByHour'])
    router.get('/trackings/:trackingId/day', [trackings, 'trackingByDay'])
    router.get('/trackings/:trackingId/week', [trackings, 'trackingByWeek'])
    router.get('/trackings/:trackingId/month', [trackings, 'trackingByMonth'])
    router.get('/trackings/:trackingId/year', [trackings, 'trackingByYear'])
  })
  .middleware(middleware.auth())
  .middleware(middleware.workspace({ as: 'member' }))
  .where('workspaceId', router.matchers.uuid())
  .where('trackingId', router.matchers.uuid())
  .prefix('/api/workspaces/:workspaceId')

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- PUBLIC LANGUAGES --
 */
router
  .group(() => {
    router.get('/languages', [Controller.languages, 'all'])
  })
  .prefix('/api')

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- PUBLIC WORKSPACES --
 */
router
  .group(() => {
    router.post('/sign-up', [Controller.workspaces, 'invitationSignUp'])
    router.post('/sign-in', [Controller.workspaces, 'invitationSignIn'])
    router.post('/refuse', [Controller.workspaces, 'invitationRefuse'])
    router.post('/', [Controller.workspaces, 'invitationRead'])
  })
  .prefix('/api/workspaces/invitation')

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * -- PUBLIC SITES --
 */
router
  .group(() => {
    const { sites, trackings } = Controller
    router.get('/languages', [sites, 'languages']).middleware(middleware.siteWorkspace())
    router.get('/slugs', [sites, 'slugs']).middleware(middleware.siteWorkspace())
    router
      .post('/trackings/:trackingId', [trackings, 'trace'])
      .where('trackingId', router.matchers.uuid())

    // preview item
    router
      .get('/preview/:locale/item/:id', [sites, 'previewItem'])
      .middleware(middleware.siteWorkspace({ validateLocale: true }))

    // with locale
    router
      .group(() => {
        // pages
        router.any('/pages/:locale/*', [sites, 'pages'])
        router.any('/pages/:locale', [sites, 'pages'])
        // menus
        router.get('/menus/:locale', [sites, 'menus'])
        // sitemap
        router.get('/sitemap/:locale', [sites, 'sitemap'])
        // articles
        router.get('/articles/:locale', [sites, 'articles'])
        router.get('/articles-by-page/:locale', [sites, 'articlesByPage'])
        router.get('/articles-latest/:locale', [sites, 'articlesLatest'])
        // projects
        router.get('/projects/:locale', [sites, 'projects'])
        router.get('/projects-by-page/:locale', [sites, 'projectsByPage'])
        router.get('/projects-latest/:locale', [sites, 'projectsLatest'])
        // projects metadata
        router.get('/projects-categories/:locale', [sites, 'projectsCategories'])
        router.get('/projects-tags/:locale', [sites, 'projectsTags'])
        router.get('/projects-years/:locale', [sites, 'projectsYears'])
      })
      .middleware(middleware.siteWorkspace({ validateLocale: true }))
  })
  .prefix('sites/:workspaceId')
