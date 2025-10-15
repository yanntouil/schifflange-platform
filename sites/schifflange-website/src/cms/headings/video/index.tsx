import { makeVideoUrl } from "@/utils/video"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/lumiq/ssr"
import { TemplateDefault } from "./default"

/**
 * Headings Image Item Renderer
 * Renders the heading image component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"headings-video">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"headings-video", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"headings-video">) => {
  const { title, subtitle, description } = item.translations.props
  const video = makeVideoUrl(item.files, item.props.video)

  return {
    ...item.props,
    level: item.props.level,
    video,
    title,
    subtitle,
    description,
  }
}
