import { match } from "@compo/utils"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/schifflange-website/ssr"
import { Template1 } from "./template-1"

/**
 * Headings Image Item Renderer
 * Renders the heading image component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"headings-simple">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with("template-1", () => <Template1 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"headings-simple", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"headings-simple">) => {
  const { title, subtitle, description } = item.translations.props
  return {
    ...item.props,
    level: item.props.level,
    title,
    subtitle,
    description,
  }
}
