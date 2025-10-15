import { makeLinkProps } from "@/utils/links"
import { A, D, O } from "@compo/utils"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/lumiq/ssr"
import { TemplateDefault } from "./default"

/**
 * Contents Breadcrumbs Item Renderer
 * Renders the breadcrumbs component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"contents-breadcrumbs">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"contents-breadcrumbs", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"contents-breadcrumbs">) => {
  const breadcrumbs = A.filterMap(item.props.breadcrumbsOrdered, (breadcrumbId) => {
    const breadcrumb = D.get(item.props.breadcrumbs, breadcrumbId)
    const translatedBreadcrumb = D.get(item.translations.props.breadcrumbs, breadcrumbId)
    if (!breadcrumb || !translatedBreadcrumb) return O.None
    const { link: translatedLink } = translatedBreadcrumb
    const link = makeLinkProps(breadcrumb.link, translatedLink, item.slugs)
    return { id: breadcrumbId, link }
  })
  return {
    breadcrumbs,
  }
}
