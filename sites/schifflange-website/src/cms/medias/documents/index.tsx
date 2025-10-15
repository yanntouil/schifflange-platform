import { asyncHelpers } from "@/cms/utils"
import { match } from "@compo/utils"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/schifflange-website/ssr"
import { Template1 } from "./template-1"

/**
 * Medias Documents Item Renderer
 * Renders the medias documents component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"medias-documents">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with("template-1", () => <Template1 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"medias-documents", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"medias-documents">) => {
  const { title, subtitle, description } = item.translations.props
  const files = asyncHelpers.extractFiles(item, item.props.documents)
  return {
    ...item.props,
    title,
    subtitle,
    description,
    files,
  }
}
