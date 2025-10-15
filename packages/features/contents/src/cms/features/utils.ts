import { FormReorderableListProps } from "@compo/form"
import { Primitives } from "@compo/primitives"
import { A, D, v4 } from "@compo/utils"
import { type Api } from "@services/dashboard"

/**
 * helper to create features props for FormReorderableList
 */
export const makeFeatureProps = <
  FeatureProps extends Record<string, unknown>,
  FeatureTranslationsProps extends Record<string, unknown>,
  T extends {
    contextKey: string
    props: { orderedCards: string[]; cards: Record<string, FeatureProps> }
    translations: Record<string, { props: { cards: Record<string, FeatureTranslationsProps> } }>
  },
>(
  values: T,
  setValues: (values: Partial<T>, touch?: boolean | undefined) => void,
  initialCard: FeatureProps,
  initialTranslations: FeatureTranslationsProps
) => {
  const create: FormReorderableListProps["create"] = () => {
    const id = v4()
    setValues({
      ...values,
      props: {
        ...values.props,
        orderedCards: [...values.props.orderedCards, id],
        cards: {
          ...values.props.cards,
          [id]: initialCard,
        },
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          cards: {
            ...translation.props.cards,
            [id]: initialTranslations,
          },
        },
      })),
    })
    return id
  }
  const duplicate: FormReorderableListProps["duplicate"] = ({ id }) => {
    const newId = v4()
    const card = values.props.cards[id]
    if (!card) return
    setValues({
      ...values,
      props: {
        ...values.props,
        orderedCards: [...values.props.orderedCards, newId],
        cards: {
          ...values.props.cards,
          [newId]: card,
        },
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          cards: {
            ...translation.props.cards,
            [newId]: translation.props.cards[id] ?? initialTranslations,
          },
        },
      })),
    })
  }
  const reorder: FormReorderableListProps["reorder"] = (from, to) => {
    setValues({
      ...values,
      props: {
        ...values.props,
        orderedCards: Primitives.DndKitSortable.arrayMove(values.props.orderedCards, from, to),
      },
    })
  }
  const remove: FormReorderableListProps["remove"] = ({ id }) => {
    setValues({
      ...values,
      props: {
        ...values.props,
        orderedCards: A.reject(values.props.orderedCards, (card) => card === id),
        cards: D.deleteKey(values.props.cards, id),
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          cards: D.deleteKey(translation.props.cards, id),
        },
      })),
    })
  }
  const getProps = (id: string, current: Api.Language) => {
    const card = values.props.cards[id] as FeatureProps
    const translations = values.translations[current.id]?.props.cards[id] as FeatureTranslationsProps
    return { card, translations }
  }
  return { create, duplicate, reorder, remove, getProps }
}
