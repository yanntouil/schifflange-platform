import { makeLinkProps } from "@/utils/links"
import { A, D } from "@compo/utils"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/lumiq/ssr"
import { TemplateDefault } from "./default"

/**
 * Features Process Item Renderer
 * Renders the process component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"projects-process">) {
  const templateProps: TemplateProps = { props: extractProps(item), item, ...props }
  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"projects-process", ReturnType<typeof extractProps>>
const extractProps = (item: InferItemAsync<"projects-process">) => {
  const { title, subtitle, description } = item.translations.props
  const cardsById = D.mapWithKey(item.props.cards, (key, card) => {
    const { title, description, link: translatedLink } = item.translations.props.cards[key]
    const link = makeLinkProps(card.link, translatedLink, item.slugs)
    return {
      key,
      level: item.props.displayHeading ? +item.props.level + 1 : +item.props.level,
      display: card.display,
      title,
      description,
      link,
    }
  })
  const cards = A.filter([cardsById.consultation, cardsById.incubation, cardsById.scaling], D.prop("display"))
  return {
    ...item.props,
    level: item.props.level,
    displayHeading: item.props.displayHeading,
    title,
    subtitle,
    description,
    cards,
  }
}
