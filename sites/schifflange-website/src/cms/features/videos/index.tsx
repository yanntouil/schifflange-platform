import { asyncHelpers } from '@/cms/utils'
import { makeVideoUrl } from '@/utils/video'
import { A, D, match, O } from '@compo/utils'
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from '@contents/lumiq/ssr'
import { Template1 } from './template-1'
import { makeNumber } from '@/utils/typed/number'

/**
 * Features Faq Item Renderer
 * Renders the faq component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<'features-videos'>) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return match(item.props.template)
    .with('template-1', () => <Template1 {...templateProps} />)
    .otherwise(() => <></>)
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<'features-videos', ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<'features-videos'>) => {
  const { title, subtitle, description } = item.translations.props

  const cards = A.filterMap(item.props.orderedCards, cardId => {
    const card = D.get(item.props.cards, cardId)
    const translatedCard = D.get(item.translations.props.cards, cardId)
    if (!card || !translatedCard) return O.None
    const { title, subtitle, description } = translatedCard
    const imageFile = asyncHelpers.extractFile(item, card.image)
    const video = card.video ? makeVideoUrl(item.files, card.video) : null

    return {
      id: cardId,
      title,
      subtitle,
      description,
      video,
      cover: imageFile,
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
