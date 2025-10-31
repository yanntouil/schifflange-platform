import Article, {
  isAvailableArticle,
  preloadCategory as preloadArticleCategory,
} from '#models/article'
import ArticleCategory from '#models/article-category'
import { preloadPublicContent } from '#models/content'
import ContentItem from '#models/content-item'
import Language from '#models/language'
import { preloadFiles } from '#models/media-file'
import Menu from '#models/menu'
import MenuItem from '#models/menu-item'
import { preloadPublicPublication } from '#models/publication'
import { preloadPublicSeo } from '#models/seo'
import Slug, { preloadSlug } from '#models/slug'
import { preloadProfile } from '#models/user'
// import Workspace from '#models/workspace'
import { makePath } from '#services/drive'
import { filterArticlesByValidator, sortArticlesByValidator } from '#validators/articles'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G, O, pipe } from '@mobily/ts-belt'
import { match } from 'ts-pattern'

export default class SitesController {
  /**
   * languages
   * Get all available languages for a workspace
   * Returns all languages with their code and name
   * @middleware siteWorkspace
   * @get sites/:workspaceId/languages
   * @success 200 { languages: Language[] }
   */
  async languages({ siteWorkspace, response }: HttpContext) {
    const languages = siteWorkspace.languages
    return response.ok({
      languages: A.map(languages, (language) => language.serialize()),
    })
  }

  /**
   * slugs
   * Provides all available paths for Next.js ISR (Incremental Static Regeneration)
   * Collects all slugs from published resources (pages, articles) and forwards
   * Returns localized paths for Next.js static pre-generation
   * @middleware siteWorkspace
   * @get sites/:workspaceId/slugs
   * @success 200 { paths: string[], forwards: string[], pages: string[] }
   */
  async slugs({ siteWorkspace, response }: HttpContext) {
    const languages = siteWorkspace.languages

    // Get all slugs from workspace with their associated resources
    const slugs = await siteWorkspace.related('slugs').query().preload('page').preload('article')

    // Filter only available resources (published and within publication dates)
    const availableSlugsPaths = await Promise.all(
      A.map(slugs, async (slug) =>
        (await hasAvailableResource(slug)) ? O.Some(slug.path) : O.None
      )
    )
    const filteredAvailableSlugsPaths = A.filterMap(availableSlugsPaths, (item) => item)

    // Generate localized paths for each workspace language
    const localizeSlugPaths = A.reduce(languages, [] as string[], (acc, language) =>
      A.concat(
        acc,
        A.map(filteredAvailableSlugsPaths, (path) => makePath(language.code, path))
      )
    )

    // Get all forwards from workspace for ISR
    const forwards = await siteWorkspace.related('forwards').query()
    const forwardsPaths = A.map(forwards, (forward) => forward.path)
    const localizeForwardsPaths = A.reduce(languages, [] as string[], (acc, language) =>
      A.concat(
        acc,
        A.map(forwardsPaths, (path) => makePath(language.code, path))
      )
    )

    // Combine all paths and remove duplicates
    const paths = A.uniq(A.concat(localizeSlugPaths, localizeForwardsPaths))

    return response.ok({
      paths, // All paths for Next.js generateStaticParams()
      forwards: localizeForwardsPaths, // Redirect paths
      pages: localizeSlugPaths, // CMS resource paths
    })
  }

  /**
   * pages
   * Get a page, article by slug or return a forward/redirect
   * Validates locale against workspace supported languages
   * @middleware siteWorkspace({validateLocale: true})
   * @get sites/:workspaceId/pages/:locale/*
   * @success 200 { model: string, [resource]: object } | { redirect: string }
   */
  async pages({ request, siteWorkspace, siteLanguage, response }: HttpContext) {
    const { '*': rest } = request.params()
    const parts = G.isArray(rest) ? rest : [rest]
    const path = A.join(parts, '/') || '/'

    // Find slug within workspace
    const slug = await Slug.query()
      .where('workspaceId', siteWorkspace.id)
      .where('path', path)
      .preload('page')
      .preload('article')
      .first()

    // Check for forwards within workspace
    if (G.isNullable(slug)) {
      const forward = await siteWorkspace
        .related('forwards')
        .query()
        .where('path', path)
        .preload('slug')
        .first()
      if (G.isNullable(forward))
        return response.notFound(makeNotFoundProps(siteLanguage.code, path))
      return response.ok({ path, locale: siteLanguage.code, redirect: forward.slug.path })
    }

    // Prepare page or article data for public display
    return matchResource(slug, siteLanguage, path, response)
  }

  /**
   * menus
   * Get all available menus for a workspace in specified locale
   * Returns header and footer menus with their items
   * @middleware siteWorkspace(validateLocale: true)
   * @get sites/:workspaceId/menus/:locale
   * @success 200 { locale: string, header: SerializedMenuItem[], footer: SerializedMenuItem[] }
   */
  async menus({ siteWorkspace, siteLanguage, response }: HttpContext) {
    // Get menus from workspace
    const menus = await Menu.query()
      .where('workspaceId', siteWorkspace.id)
      .preload('items', (query) =>
        query.preload('translations').preload('slug', preloadSlug).preload('files', preloadFiles)
      )

    const header = await rejectUnavailableResources(
      A.find(menus, ({ location }) => location === 'header')?.items ?? []
    )
    const footer = await rejectUnavailableResources(
      A.find(menus, ({ location }) => location === 'footer')?.items ?? []
    )

    return response.ok({
      locale: siteLanguage.code,
      header: recursiveSerialize(header, null, siteLanguage),
      footer: recursiveSerialize(footer, null, siteLanguage),
    })
  }

  /**
   * sitemap
   * Generate sitemap of all available resources for a workspace in specified locale
   * Returns all published pages, articles with their SEO data
   * @middleware siteWorkspace({validateLocale: true})
   * @get sites/:workspaceId/sitemap/:locale
   * @success 200 { locale: string, sitemap: SerializedSlug[] }
   */
  async sitemap({ siteWorkspace, siteLanguage, response }: HttpContext) {
    // Get all slugs from workspace with SEO data for sitemap
    const slugs = await siteWorkspace
      .related('slugs')
      .query()
      .preload('page', (query) => query.preload('seo', preloadPublicSeo))
      .preload('article', (query) => query.preload('seo', preloadPublicSeo))

    // Filter only available resources and serialize for sitemap
    const sitemap = await Promise.all(
      A.map(slugs, async (slug) =>
        (await hasAvailableResource(slug)) ? O.Some(slug.publicSerialize(siteLanguage)) : O.None
      )
    )
    const filteredSitemap = A.filterMap(sitemap, (item) => item)

    return response.ok({
      locale: siteLanguage.code,
      sitemap: filteredSitemap,
    })
  }

  /**
   * articles
   * Get all available articles for a workspace with filtering, sorting, and search
   * Returns articles with their categories in specified locale
   * @middleware siteWorkspace({validateLocale: true})
   * @get sites/:workspaceId/articles/:locale
   * @success 200 { locale: string, articles: Article[], categories: ArticleCategory[] }
   */
  async articles({ request, siteWorkspace, siteLanguage, response }: HttpContext) {
    const filterBy = await request.filterBy(filterArticlesByValidator)
    const search = await request.search()
    const sortBy = await request.sortBy(sortArticlesByValidator)
    const limit = await request.limit()

    // Get article categories from workspace
    const categories = await ArticleCategory.query()
      .where('workspaceId', siteWorkspace.id)
      .preload('translations')

    // Get articles from workspace with all filters applied
    const articles = await Article.query()
      .where('workspaceId', siteWorkspace.id)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .withScopes((scope) => scope.search(search, siteLanguage))
      .withScopes((scope) => scope.isPublished())
      .preload('category', preloadArticleCategory)
      .preload('seo', preloadPublicSeo)
      .preload('content', preloadPublicContent)
      .preload('publication', preloadPublicPublication)
      .preload('slug')
      .preload('createdBy', preloadProfile)

    return response.ok({
      locale: siteLanguage.code,
      articles: A.map(articles, (article) => article.publicSerialize(siteLanguage)),
      categories: A.map(categories, (category) => category.publicSerialize(siteLanguage)),
    })
  }

  /**
   * articlesByPage
   * Get paginated articles for a workspace with filtering, sorting, and search
   * Returns articles with pagination metadata and categories
   * @middleware siteWorkspace({validateLocale: true})
   * @get sites/:workspaceId/articles-by-page/:locale
   * @success 200 { locale: string, articles: Article[], categories: ArticleCategory[], metadata: PaginationMeta, filterBy: object, sortBy: object }
   */
  async articlesByPage({ request, siteWorkspace, siteLanguage, response }: HttpContext) {
    const filterBy = await request.filterBy(filterArticlesByValidator)
    const sortBy = await request.sortBy(sortArticlesByValidator)
    const search = await request.search()
    const pagination = await request.pagination()

    // Get article categories from workspace
    const categories = await ArticleCategory.query()
      .where('workspaceId', siteWorkspace.id)
      .preload('translations')

    // Get paginated articles from workspace with all filters applied
    const paginated = await Article.query()
      .where('workspaceId', siteWorkspace.id)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.search(search, siteLanguage))
      .withScopes((scope) => scope.isPublished())
      .preload('category', preloadArticleCategory)
      .preload('seo', preloadPublicSeo)
      .preload('content', preloadPublicContent)
      .preload('publication', preloadPublicPublication)
      .preload('slug')
      .preload('createdBy', preloadProfile)
      .paginate(...pagination)

    return response.ok({
      locale: siteLanguage.code,
      articles: A.map(paginated.all(), (article) => article.publicSerialize(siteLanguage)),
      categories: A.map(categories, (category) => category.publicSerialize(siteLanguage)),
      metadata: paginated.getMeta(),
      filterBy,
      sortBy,
    })
  }

  /**
   * articlesLatest
   * Get the latest published article for a workspace with optional filtering
   * Returns the most recent article based on publication date
   * @middleware siteWorkspace({validateLocale: true})
   * @get sites/:workspaceId/articles-latest/:locale
   * @success 200 { locale: string, article: Article | null }
   */
  async articlesLatest({ request, siteWorkspace, siteLanguage, response }: HttpContext) {
    const filterBy = await request.filterBy(filterArticlesByValidator)

    // Get the latest published article from workspace
    const article = await Article.query()
      .where('workspaceId', siteWorkspace.id)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy({ field: 'createdAt', direction: 'desc' }))
      .withScopes((scope) => scope.isPublished())
      .preload('category', preloadArticleCategory)
      .preload('seo', preloadPublicSeo)
      .preload('content', preloadPublicContent)
      .preload('publication', preloadPublicPublication)
      .preload('slug')
      .preload('createdBy', preloadProfile)
      .first()

    return response.ok({
      locale: siteLanguage.code,
      article: article?.publicSerialize(siteLanguage) ?? null,
    })
  }

  /**
   * previewItem
   * Returns the content item published or not available for preview or null if not found
   * @middleware siteWorkspace({validateLocale: true})
   * @get sites/:workspaceId/preview/:locale/item/:id
   * @success 200 ContentItem | null
   */
  async previewItem({ request, siteLanguage, response }: HttpContext) {
    const item = await ContentItem.query()
      .where('id', request.param('id'))
      .preload('translations')
      .preload('files', (query) => query.preload('translations'))
      .preload('slugs', preloadSlug)
      .first()
    return response.ok(item?.publicSerialize(siteLanguage) ?? null)
  }
}

/**
 * rejectUnavailableResources
 * reject menu items that are no available resources
 */
const rejectUnavailableResources = async (items: MenuItem[]): Promise<MenuItem[]> => {
  const filteredItems = await Promise.all(
    A.map(items, async (item) => {
      const { type, slug } = item
      // check if the item is published
      if (item.state !== 'published') return O.None
      // check if the item is a resource and if the resource is available
      if (type === 'resource' && (G.isNullable(slug) || !(await hasAvailableResource(slug)))) {
        return O.None
      }
      return O.Some(item)
    })
  )
  return A.filter(filteredItems, G.isNotNullable)
}

/**
 * recursiveSerialize
 * serialize menu items
 */
const recursiveSerialize = (
  items: MenuItem[],
  parentId: string | null,
  language: Language
): SerializedMenuItem[] =>
  pipe(
    items,
    A.filterMap((item) =>
      item.parentId === parentId
        ? O.Some({
            ...(item.publicSerialize(language) as Record<string, unknown>),
            id: item.id,
            parentId: item.parentId,
            order: item.order,
            items: A.sortBy(recursiveSerialize(items, item.id, language), D.prop('order')),
          })
        : O.None
    ),
    A.sortBy(D.prop('order'))
  )
type SerializedMenuItem = Record<string, unknown> & {
  id: string
  parentId: string | null
  order: number
  items: SerializedMenuItem[]
}

/**
 * hasAvailableResource
 * check if a resource is available
 */
const hasAvailableResource = async (slug: Slug): Promise<boolean> => {
  return match(slug.model)
    .with('article', () => isAvailableArticle(slug.article))
    .with('page', () => slug.page?.state === 'published')
    .exhaustive()
}

const matchResource = async (
  slug: Slug,
  language: Language,
  path: string,
  response: HttpContext['response']
) => {
  return match(slug.model)
    .with('article', () => prepareArticle(slug, language, path, response))
    .with('page', () => preparePage(slug, language, path, response))
    .exhaustive()
  // return response.notFound(makeNotFoundProps(language.code, path))
}

/**
 * prepare page
 * load page data for public display
 */
const preparePage = async (
  slug: Slug,
  language: Language,
  path: string,
  response: HttpContext['response']
) => {
  const page = slug.page
  if (G.isNullable(page) || page.state !== 'published') {
    return response.notFound(makeNotFoundProps(language.code, path))
  }

  // Load additional data for public display
  await page.load('seo', preloadPublicSeo)
  await page.load('content', preloadPublicContent)
  await page.load('slug')

  return response.ok({
    locale: language.code,
    path,
    model: 'page',
    page: page.publicSerialize(language),
  })
}

/**
 * prepare article
 * load article data for public display
 */
const prepareArticle = async (
  slug: Slug,
  language: Language,
  path: string,
  response: HttpContext['response']
) => {
  const article = slug.article
  if (G.isNullable(article) || article.state !== 'published' || !isAvailableArticle(article)) {
    return response.notFound(makeNotFoundProps(language.code, path))
  }

  // Load additional data for public display
  await article.load('seo', preloadPublicSeo)
  await article.load('content', preloadPublicContent)
  await article.load('publication', preloadPublicPublication)
  await article.load('slug')
  await article.load('category', preloadArticleCategory)

  return response.ok({
    locale: language.code,
    path,
    model: 'article',
    article: article.publicSerialize(language),
  })
}

/**
 * makeNotFoundProps
 * make not found props for a given locale and path
 */
const makeNotFoundProps = (locale: string, path: string) => {
  const notFoundProps = {
    locale,
    path,
    name: 'E_RESOURCE_NOT_FOUND',
    message: 'this path does not exist',
  }
  return notFoundProps
}
