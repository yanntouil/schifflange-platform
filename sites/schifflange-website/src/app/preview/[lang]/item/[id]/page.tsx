import { Providers } from "@/app/providers"
import { getLanguages, secureLocale } from "@/app/utils"
import Dispatch from "@/cms/dispatch"
import type { LocalizeLanguage } from "@/lib/localize"
import { Api, service } from "@/service"
import { notFound } from "next/navigation"
import { PreviewWrapper } from "./client-scripts"

// Disable all caching for preview pages
export const dynamic = "force-dynamic"
export const revalidate = 0

async function getData(id: string, locale: LocalizeLanguage): Promise<Api.ContentItem | null> {
  const result = await service.preview.item(id, locale)
  if (!result.ok) return null
  return result.data
}

/**
 * Preview page for rendering CMS items in isolation
 * Used by the dashboard in iframes for content preview
 */
type PageProps = {
  params: Promise<{ lang: string; id: string }>
  searchParams: Promise<Record<string, unknown>>
}
export default async function Page({ params, searchParams }: PageProps) {
  const { lang, id } = await params
  const search = await searchParams
  const locale = secureLocale(lang)
  const item = await getData(id, locale)
  const [defaultLanguage, languages] = await getLanguages()

  if (!item) {
    notFound()
  }
  // Use dispatcher to render the appropriate component
  return (
    <Providers language={locale} noCookies languages={languages} defaultLanguage={defaultLanguage}>
      <PreviewWrapper itemId={id}>
        <div className='cms-preview-root'>
          <Dispatch item={item} locale={locale} path='/' searchParams={search} />
        </div>
      </PreviewWrapper>
    </Providers>
  )
}
