import { matchLanguage, secureLocale } from '@/app/utils'
import Dispatch from '@/cms/dispatch'
import { config } from '@/config'
import { service } from '@/service'
import { makePathToApp } from '@/utils'
import { A, D, makePath, match } from '@compo/utils'
import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { Tracking } from '../tracking'

const debug = false

/**
 * getPage
 */
export const getPage = async (slug: string[]) => {
  const locale = matchLanguage(A.head(slug))
  const path = makePath(...A.sliceToEnd(slug, 1)) // || "homepage"
  if (config.inDevelopment)
    console.info('getPage endpoint', `${service.apiUrl}/sites/pages/${locale}/${path}`)
  const result = await service.page(locale, path)
  if (debug && !result.ok) console.info('getPage result', result)
  return result
}

/**
 * generateMetadata
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> => {
  const { slug } = await params
  const result = await getPage(slug)
  if (!result.ok)
    return {
      title: 'Page non trouvée',
      // ...
    }
  if ('redirect' in result.data) return {}
  const { locale, path, ...rest } = result.data
  const page = match(rest)
    .with({ model: 'page' }, ({ page }) => page)
    .with({ model: 'article' }, ({ article }) => article)
    .with({ model: 'project' }, ({ project }) => project)
    .with({ model: 'project-step' }, ({ projectStep }) => projectStep)
    .exhaustive()

  const image = page.seo.translations?.image
  const imageAlt = page.seo.translations?.image?.translations?.alt
  const title = page.seo.translations?.title
  const description = page.seo.translations?.description
  const keywords = page.seo.translations?.keywords ?? []

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: makePathToApp(path),
      siteName: config.siteName,
      images: image
        ? {
            url: service.makePath(image.url, true),
            alt: imageAlt,
            width: image.width,
            height: image.height,
          }
        : undefined,
      locale,
      type: config.siteType,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? service.makePath(image.url, true) : undefined,
    },
  }
}

/**
 * ISR
 */
export const revalidate = 60 // ISR every 60s
export const generateStaticParams = async () => {
  const pages = await service.slugs()
  if (!pages.ok) {
    console.error('generateStaticParams - Failed to fetch slugs:', pages)
    return []
  }
  if (!pages.data || !pages.data.paths) {
    console.error('generateStaticParams - Invalid data structure:', pages.data)
    return []
  }
  const params = pages.data.paths.map(path => ({
    slug: path.split('/'),
  }))
  return params
}

/**
 * Page
 */
type PageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, unknown>>
}
const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params
  const search = await searchParams
  const result = await getPage(slug)
  if (!result.ok) {
    if (debug) console.warn('Page not found during build:', slug.join('/'))
    notFound()
  }
  if ('redirect' in result.data) {
    if (debug) console.warn('Page redirect during build:', slug.join('/'))
    permanentRedirect(makePath(result.data.redirect))
  }
  const locale = secureLocale(result.data.locale)
  const path = result.data.path === 'homepage' ? '' : result.data.path
  const page = match(result.data)
    .with({ model: 'page' }, ({ page }) => page)
    .with({ model: 'article' }, ({ article }) => article)
    .with({ model: 'project' }, ({ project }) => project)
    .with({ model: 'project-step' }, ({ projectStep }) => projectStep)
    .exhaustive()
  const items = A.sortBy(page.content.items, D.prop('order'))
  const dispatchProps = { locale, path, searchParams: search }

  return (
    <>
      <Tracking trackingId={page.trackingId} />
      {items.map(item => (
        <Dispatch key={item.id} item={item} {...dispatchProps} />
      ))}
    </>
  )
}
export default Page
