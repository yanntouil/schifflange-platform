import { makeLinkProps } from "@/utils/links"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/schifflange-website/ssr"
import { TemplateDefault } from "./default"

/**
 * Contents Breadcrumbs Item Renderer
 * Renders the breadcrumbs component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"contents-navigate">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"contents-navigate", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"contents-navigate">) => {
  const { previous: previousTranslation, next: nextTranslation } = item.translations.props
  const previous = makeLinkProps(item.props.previous.link, previousTranslation.link, item.slugs)
  const next = makeLinkProps(item.props.next.link, nextTranslation.link, item.slugs)
  console.log(previous, next)
  return {
    previous,
    next,
  }
}
