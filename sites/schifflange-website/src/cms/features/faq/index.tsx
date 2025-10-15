import { A, D, O } from '@compo/utils'
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from '@contents/lumiq/ssr'
import { TemplateDefault } from './default'
import { makeNumber } from '@/utils/typed/number'

/**
 * Features Faq Item Renderer
 * Renders the faq component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<'features-faq'>) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<'features-faq', ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<'features-faq'>) => {
  const { title, subtitle, description } = item.translations.props
  const cards = A.filterMap(item.props.orderedCards, cardId => {
    const card = D.get(item.props.cards, cardId)
    const translatedCard = D.get(item.translations.props.cards, cardId)
    if (!card || !translatedCard) return O.None
    const { title, description, faq: translatedFaq } = translatedCard
    const faq = A.filterMap(card.faq, faqId => {
      const translatedFaqItem = D.get(translatedFaq, faqId)
      if (!translatedFaqItem) return O.None
      return O.Some({ ...translatedFaqItem, id: faqId })
    })
    return {
      id: cardId,
      title,
      description,
      faq,
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
