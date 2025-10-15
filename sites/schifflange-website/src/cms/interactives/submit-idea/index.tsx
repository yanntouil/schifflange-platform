import { match } from "@compo/utils"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/schifflange-website/ssr"
import { Template1 } from "./template-1"

/**
 * Contents Rich Text Item Renderer
 * Renders the rich text component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"interactives-submit-idea">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with("template-1", () => <Template1 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"interactives-submit-idea", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"interactives-submit-idea">) => {
  return {
    ...item.props,
    ...item.translations.props,
  }
}
