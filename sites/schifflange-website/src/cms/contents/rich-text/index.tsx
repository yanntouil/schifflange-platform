import { match } from '@compo/utils'
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from '@contents/lumiq/ssr'
import { Template1 } from './template-1'

/**
 * Contents Rich Text Item Renderer
 * Renders the rich text component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<'contents-rich-text'>) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with('template-1', () => <Template1 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<
  'contents-rich-text',
  ReturnType<typeof extractProps>
>
const extractProps = (item: InferItemAsync<'contents-rich-text'>) => {
  return {
    ...item.props,
    ...item.translations.props,
  }
}
