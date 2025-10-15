import { asyncHelpers } from "@/cms/utils"
import { fileToSlide } from "@/components/lightbox"
import { A, match } from "@compo/utils"
import type { RenderAsyncProps, TemplateAsyncProps } from "@contents/schifflange-website/ssr"
import { InferItemAsync } from "@contents/schifflange-website/ssr"
import { Template1 } from "./template-1"
import { Template2 } from "./template-2"

/**
 * Medias Images Item Renderer
 * Renders the medias images component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"medias-images">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with("template-1", () => <Template1 {...templateProps} />)
    .with("template-2", () => <Template2 {...templateProps} />)
    .otherwise(() => <></>)
}
/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"medias-images", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"medias-images">) => {
  const { title, subtitle, description } = item.translations.props
  const files = asyncHelpers.extractFiles(item, item.props.images)
  const slides = A.filterMap(files ?? [], fileToSlide)
  return {
    ...item.props,
    title,
    subtitle,
    description,
    files,
    slides,
  }
}
