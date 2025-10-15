import { asyncHelpers } from "@/cms/utils"
import { service } from "@/service"
import { match } from "@compo/utils"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/schifflange-website/ssr"
import { Template1 } from "./template-1"
import { Template2 } from "./template-2"

/**
 * Headings Image Item Renderer
 * Renders the heading image component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"headings-image">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with("template-1", () => <Template1 {...templateProps} />)
    .with("template-2", () => <Template2 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"headings-image", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"headings-image">) => {
  const file = asyncHelpers.extractFile(item, item.props.image)
  const { title, subtitle, description } = item.translations.props
  const image = file
    ? {
        url: service.makePath(file.url, true),
        alt: file.translations.alt,
        width: file.width,
        height: file.height,
      }
    : null
  return {
    ...item.props,
    level: item.props.level,
    image,
    title,
    subtitle,
    description,
  }
}
