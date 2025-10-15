import { asyncHelpers } from '@/cms/utils'
import { makeLinkProps } from '@/utils/links'
import { makeNumber } from '@/utils/typed/number'
import { A, D, match, O } from '@compo/utils'
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from '@contents/lumiq/ssr'
import { TemplateDefault } from './default'

/**
 * Features Faq Item Renderer
 * Renders the faq component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<'features-contacts'>) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with('template-1', () => <TemplateDefault {...templateProps} />)
    .with('template-2', () => <TemplateDefault {...templateProps} variant='alt' />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<'features-contacts', ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<'features-contacts'>) => {
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
      title,
      subtitle,
      description,
      link,
      image: file,
    }
  })

  return {
    ...item.props,
    title,
    subtitle,
    description,
    cards,
    contentLevel: makeNumber(item.props.level) + (item.props.displayHeading ? 1 : 0),
  }
}
