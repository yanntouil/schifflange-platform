import { asyncHelpers } from '@/cms/utils'
import { applyTextFormating } from '@/utils/html'
import { makeLinkProps } from '@/utils/links'
import { A, D, match, O } from '@compo/utils'
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from '@contents/lumiq/ssr'
import { Template1 } from './template-1'
import { Template2 } from './template-2'
import { Template3 } from './template-3'
import { Template4 } from './template-4'
import { makeNumber } from '@/utils/typed/number'

/**
 * Features Faq Item Renderer
 * Renders the faq component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<'features-cards'>) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with('template-1', () => <Template1 {...templateProps} />)
    .with('template-2', () => <Template2 {...templateProps} />)
    .with('template-3', () => <Template3 {...templateProps} />)
    .with('template-4', () => <Template4 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<'features-cards', ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<'features-cards'>) => {
  const { title, subtitle, description } = item.translations.props
  const cards = A.filterMap(item.props.orderedCards, cardId => {
    const card = D.get(item.props.cards, cardId)
    const translatedCard = D.get(item.translations.props.cards, cardId)
    if (!card || !translatedCard) return O.None
    const { title, subtitle, description, link: translatedLink } = translatedCard
    const link = makeLinkProps(card.link, translatedLink, item.slugs)
    const file = asyncHelpers.extractFile(item, card.image)

    return {
      id: cardId,
      level: +item.props.level + (item.props.displayHeading ? 1 : 0),
      type: card.type,
      title: applyTextFormating(title),
      subtitle: applyTextFormating(subtitle),
      description: applyTextFormating(description),
      link,
      image: file,
    }
  })
  return {
    ...item.props,
    title: applyTextFormating(title),
    subtitle: applyTextFormating(subtitle),
    description: applyTextFormating(description),
    cards,
    contentLevel: makeNumber(item.props.level) + (item.props.displayHeading ? 1 : 0),
  }
}
