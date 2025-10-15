import { asyncHelpers } from '@/cms/utils'
import { service } from '@/service'
import { makeLinkProps } from '@/utils/links'
import { D, match } from '@compo/utils'
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from '@contents/lumiq/ssr'
import { Template1 } from './template-1'
import { Template2 } from './template-2'
import { makeNumber } from '@/utils/typed/number'

/**
 * Features Process Item Renderer
 * Renders the process component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<'features-process'>) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with('template-1', () => <Template1 {...templateProps} />)
    .with('template-2', () => <Template2 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<'features-process', ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<'features-process'>) => {
  const { title, subtitle, description } = item.translations.props
  const cardsById = D.mapWithKey(item.props.cards, (key, card) => {
    const { title, description, link: translatedLink } = item.translations.props.cards[key]
    const link = makeLinkProps(card.link, translatedLink, item.slugs)
    const file = asyncHelpers.extractFile(item, card.image)

    return {
      key,
      title,
      description,
      link,
      image: file,
    }
  })
  const cards = [cardsById.consultation, cardsById.incubation, cardsById.scaling]
  return {
    ...item.props,
    level: item.props.level,
    displayHeading: item.props.displayHeading,
    title,
    subtitle,
    description,
    cards,
    contentLevel: makeNumber(item.props.level) + (item.props.displayHeading ? 1 : 0),
  }
}
