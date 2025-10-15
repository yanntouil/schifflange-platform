import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/schifflange-website/ssr"
import { TemplateDefault } from "./default"

/**
 * Features Process Item Renderer
 * Renders the process component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"projects-footer">) {
  // Prepare props for template
  const templateProps: TemplateProps = {
    props: extractProps(item),
    item,
    ...props,
  }
  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"projects-footer", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"projects-footer">) => {
  const { title, subtitle, description } = item.translations.props
  return {
    ...item.props,
    level: item.props.level,
    displayHeading: item.props.displayHeading,
    title,
    subtitle,
    description,
    cardLevel: item.props.displayHeading ? item.props.level + 1 : item.props.level,
  }
}
