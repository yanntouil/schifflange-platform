import { asyncHelpers } from "@/cms/utils"
import { service } from "@/service"
import { makeLinkProps } from "@/utils/links"
import { A, D, O } from "@compo/utils"
import type { InferItemAsync } from "@contents/schifflange-website/ssr"

/**
 * extractCardsProps
 * Extracts the cards props from the item
 * @param item - The item to extract the cards props from
 * @returns The cards props
 */
export const extractCardsProps = (item: InferItemAsync<"features-cards">) => {
  const cards = A.filterMap(item.props.orderedCards, (cardId) => {
    const card = D.get(item.props.cards, cardId)
    const translatedCard = D.get(item.translations.props.cards, cardId)
    if (!card || !translatedCard) return O.None
    const { title, subtitle, description, link: translatedLink } = translatedCard
    const link = makeLinkProps(card.link, translatedLink, item.slugs)
    const file = asyncHelpers.extractFile(item, card.image)
    const image = file
      ? {
          url: service.makePath(file.url, true),
          alt: file.translations.alt,
          width: file.width,
          height: file.height,
        }
      : null
    return {
      id: cardId,
      level: +item.props.level + (item.props.displayHeading ? 1 : 0),
      type: card.type,
      title,
      subtitle,
      description,
      link,
      image,
    }
  })
  return cards
}
export type CardsProps = ReturnType<typeof extractCardsProps>
