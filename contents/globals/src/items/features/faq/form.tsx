import { Cms, CreateItemForm, FormUpdate, type InferItem } from "@compo/contents"
import { Form, FormReorderableList, FormReorderableListProps, useForm, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Primitives } from "@compo/primitives"
import { FormTranslatableContent, FormTranslatableTabs, useFormTranslatableContext } from "@compo/translations"
import { A, D, placeholder, v4 } from "@compo/utils"
import { MessageCircleQuestionMark, MessageSquare } from "lucide-react"
import React from "react"
import { contentItem } from "./export"

export const createForm: CreateItemForm<typeof contentItem> =
  ({ proses }) =>
  ({ item, onSubmit }) => {
    const { _ } = useTranslation(dictionary)
    const form = useForm({
      allowSubmitAttempt: true,
      values: makeValues(item),
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const payload = {
          props: {
            level: props.level,
            displayHeading: props.displayHeading,
            limit: props.limit,
            orderedCards: props.orderedCards,
            cards: D.map(props.cards, (card) => ({
              ...card,
              faq: card.faq || [],
            })),
          },
          translations: D.map(translations, (translation) => ({
            ...translation,
            props: {
              ...translation.props,
              cards: D.map(translation.props.cards, (card) => ({
                ...card,
                faq: D.map(card.faq || {}, (faq) => faq),
              })),
            },
          })),
          slugs: [],
          files: [],
        }
        await onSubmit(payload)
      },
    })

    return (
      <Form.Root form={form} className='min-h-screen'>
        <FormTranslatableTabs classNames={{ root: "flex flex-col gap-6" }}>
          <Cms.Headings.FormHeadingOptional prose={proses?.description} />
          <Form.Fields name='props'>
            <Form.Quantity
              name='limit'
              label={_("cards.limit-label")}
              placeholder={_("cards.limit-placeholder")}
              labelAside={<Form.Info title={_("cards.limit-label")} content={_("cards.limit-info")} />}
              step={1}
              min={0}
              max={100}
              classNames={{ input: "w-36" }}
            />
          </Form.Fields>
          <FormCards proses={proses} />
          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }

/**
 * makeValues
 * make the initial values for the form
 */
const makeValues = (item: InferItem<typeof contentItem>) => ({
  contextKey: item.id,
  cardOpen: undefined as string | undefined,
  props: {
    level: item.props.level,
    displayHeading: item.props.displayHeading,
    limit: item.props.limit,
    orderedCards: item.props.orderedCards,
    cards: D.map(item.props.cards, (card) => ({
      ...card,
      faq: card.faq || [],
      faqOpen: undefined as string | undefined,
    })),
  },
  translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
})
type FormValues = ReturnType<typeof makeValues>

/**
 * FormCards
 * display the form to create/edit the cards
 */
const FormCards: React.FC<{
  proses?: {
    faqDescription: string
    cardDescription: string
  }
}> = ({ proses }) => {
  const { _ } = useTranslation(dictionary)
  const { values, setValues } = useFormContext<FormValues>()
  const { current } = useFormTranslatableContext()
  const { getProps, ...rest } = Cms.Features.makeFeatureProps(
    values,
    setValues,
    initialFeature,
    initialFeatureTranslations
  )
  return (
    <div className='space-y-4'>
      <Form.Header title={_("cards.header-title")} description={_("cards.header-description")} />
      <FormReorderableList
        items={values.props.orderedCards}
        {...rest}
        value={values.cardOpen}
        onValueChange={(cardOpen) => setValues({ cardOpen })}
        title={({ id }) => {
          const { card, translations } = getProps(id, current)
          return (
            <>
              <MessageSquare className='size-4' aria-hidden />
              {placeholder(translations.title, _("cards.title"))}
            </>
          )
        }}
        t={_.prefixed("cards")}
      >
        {({ id, index }) => <FormCard id={id} index={index} proses={proses} key={id} />}
      </FormReorderableList>
    </div>
  )
}

/**
 * FormCard
 * display the form to create/edit the card
 */
const FormCard: React.FC<{
  id: string
  index: number
  proses?: {
    faqDescription: string
    cardDescription: string
  }
}> = ({ id, proses }) => {
  const { _ } = useTranslation(dictionary)
  const { props } = useFormContext<FormValues>().values

  const { values, setValues } = useFormContext<FormValues>()
  const faqValues = {
    contextKey: values.contextKey,
    props: {
      orderedCards: props.cards[id].faq || [],
      cards: props.cards[id].faq || {},
    },
    translations: D.map(values.translations, (translation) => ({
      props: {
        cards: translation.props.cards[id]?.faq || {},
      },
    })),
  }

  return (
    <div className='space-y-6'>
      {/* Card Header & Basic Fields */}
      <Form.Fields name='translations'>
        <FormTranslatableContent className='space-y-4'>
          {({ code }) => (
            <Form.Fields names={["props", "cards", id]}>
              <Form.Input
                name='title'
                label={_("card.title-label")}
                placeholder={_("card.title-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("card.title-label")} content={_("card.title-info")} />}
              />
              <Form.TextEditor
                name='description'
                label={_("card.description-label")}
                placeholder={_("card.description-placeholder")}
                lang={code}
                prose={proses?.cardDescription}
                labelAside={<Form.Localized title={_("card.description-label")} content={_("card.description-info")} />}
              />
            </Form.Fields>
          )}
        </FormTranslatableContent>
      </Form.Fields>
      {/* FAQ Items with DnD */}
      <FormFaq cardId={id} prose={proses?.faqDescription} />
    </div>
  )
}
/**
 * FormFaq
 */
const FormFaq: React.FC<{ cardId: string; prose?: string }> = ({ cardId, prose }) => {
  const { _ } = useTranslation(dictionary)
  const { values, setValues } = useFormContext<FormValues>()
  const create: FormReorderableListProps["create"] = () => {
    const id = v4()
    setValues({
      ...values,
      props: {
        ...values.props,
        cards: {
          ...values.props.cards,
          [cardId]: {
            ...values.props.cards[cardId],
            faq: [...values.props.cards[cardId].faq, id],
            faqOpen: id,
          },
        },
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          cards: {
            ...translation.props.cards,
            [cardId]: {
              ...translation.props.cards[cardId],
              faq: {
                ...translation.props.cards[cardId].faq,
                [id]: {
                  ...initialFaqTranslations,
                },
              },
            },
          },
        },
      })),
    })
    return id
  }
  const duplicate: FormReorderableListProps["duplicate"] = ({ id }) => {
    const newId = v4()
    setValues({
      ...values,
      props: {
        ...values.props,
        cards: {
          ...values.props.cards,
          [cardId]: {
            ...values.props.cards[cardId],
            faq: [...values.props.cards[cardId].faq, newId],
            faqOpen: newId,
          },
        },
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          cards: {
            ...translation.props.cards,
            [cardId]: {
              ...translation.props.cards[cardId],
              faq: {
                ...translation.props.cards[cardId].faq,
                [newId]: {
                  ...(translation.props.cards[cardId].faq[id] ?? initialFaqTranslations),
                },
              },
            },
          },
        },
      })),
    })
    return newId
  }
  const reorder: FormReorderableListProps["reorder"] = (from, to) => {
    setValues({
      ...values,
      props: {
        ...values.props,
        cards: {
          ...values.props.cards,
          [cardId]: {
            ...values.props.cards[cardId],
            faq: Primitives.DndKitSortable.arrayMove(values.props.cards[cardId].faq, from, to),
          },
        },
      },
    })
  }
  const remove: FormReorderableListProps["remove"] = ({ id }) => {
    setValues({
      ...values,
      props: {
        ...values.props,
        cards: {
          ...values.props.cards,
          [cardId]: {
            ...values.props.cards[cardId],
            faq: A.filter(values.props.cards[cardId].faq, (faqId) => faqId !== id),
          },
        },
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          cards: {
            ...translation.props.cards,
            [cardId]: {
              ...translation.props.cards[cardId],
              faq: D.deleteKey(translation.props.cards[cardId].faq, id),
            },
          },
        },
      })),
    })
  }
  const { current } = useFormTranslatableContext()

  return (
    <FormReorderableList
      items={values.props.cards[cardId].faq}
      {...{ create, duplicate, reorder, remove }}
      value={values.props.cards[cardId].faqOpen}
      onValueChange={(faqOpen) =>
        setValues({
          props: {
            ...values.props,
            cards: { ...values.props.cards, [cardId]: { ...values.props.cards[cardId], faqOpen } },
          },
        })
      }
      title={({ id }) => {
        const title = values.translations[current.id]?.props.cards[cardId]?.faq[id]?.title
        return (
          <>
            <MessageCircleQuestionMark className='size-4' aria-hidden />
            {placeholder(title, _("c.title"))}
          </>
        )
      }}
      t={_.prefixed("faqs")}
    >
      {({ id, index }) => <FormFaqItem cardId={cardId} faqId={id} index={index} prose={prose} key={id} />}
    </FormReorderableList>
  )
}

/**
 * FormFaq
 * Individual FAQ item form
 */
const FormFaqItem: React.FC<{ cardId: string; faqId: string; index: number; prose?: string }> = ({
  cardId,
  faqId,
  prose,
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <div className='space-y-4'>
      <Form.Fields name='translations'>
        <FormTranslatableContent className='space-y-4'>
          {({ code }) => (
            <Form.Fields names={["props", "cards", cardId, "faq", faqId]}>
              <Form.Input
                name='title'
                label={_("faq.question-label")}
                placeholder={_("faq.question-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("faq.question-label")} content={_("faq.question-info")} />}
              />
              <Form.TextEditor
                name='description'
                label={_("faq.answer-label")}
                placeholder={_("faq.answer-placeholder")}
                lang={code}
                prose={prose}
                labelAside={<Form.Localized title={_("faq.answer-label")} content={_("faq.answer-info")} />}
              />
            </Form.Fields>
          )}
        </FormTranslatableContent>
      </Form.Fields>
    </div>
  )
}

/**
 * initialFeatures
 */
const initialFeature: FormValues["props"]["cards"][string] = {
  faq: [],
  faqOpen: undefined,
}
const initialFeatureTranslations: FormValues["translations"][string]["props"]["cards"][string] = {
  title: "",
  subtitle: "",
  description: "",
  faq: {},
}

/**
 * initialFaq
 */
const initialFaq = {}
const initialFaqTranslations = {
  title: "",
  description: "",
}

const dictionary = {
  fr: {
    cards: {
      "header-title": "Sections FAQ",
      "header-description": "Organisez vos questions-réponses en sections thématiques pour aider vos visiteurs",
      title: "Titre de la section",
      create: "Créer une nouvelle section",
      duplicate: "Dupliquer la section",
      remove: "Retirer la section",
      "limit-label": "Affichage progressif",
      "limit-placeholder": "Nombre de questions par section (0 = toutes)",
      "limit-info":
        "Limitez le nombre de questions affichées initialement. Les visiteurs pourront cliquer pour voir le reste. 0 affiche toutes les questions.",
    },
    card: {
      "title-label": "Titre de la section",
      "title-placeholder": "Entrez le titre de cette section FAQ...",
      "title-info": "Le titre de cette section FAQ. Il permet de regrouper les questions par thème",
      "description-label": "Description",
      "description-placeholder": "Décrivez cette section FAQ...",
      "description-info": "Une description pour expliquer le type de questions de cette section",
    },
    faqs: {
      "header-title": "Questions & Réponses",
      "header-description": "Ajoutez les questions et réponses de cette section",
      title: "Question sans titre",
      create: "Ajouter une nouvelle question",
      duplicate: "Dupliquer la question",
      remove: "Supprimer la question",
    },
    faq: {
      "question-label": "Question",
      "question-placeholder": "Posez votre question...",
      "question-info": "La question que se posent vos visiteurs. Soyez précis et clair",
      "answer-label": "Réponse",
      "answer-placeholder": "Rédigez la réponse complète...",
      "answer-info":
        "La réponse détaillée à cette question. Vous pouvez utiliser la mise en forme pour structurer votre réponse",
    },

    // Template
    "template-label": "Mise en page",
    "template-info":
      "Choisissez comment présenter vos sections FAQ. Vous pouvez changer la mise en page à tout moment.",
    "template-1": "Accordéon vertical",
    "template-2": "Grille de sections",
    "template-3": "Onglets FAQ",
    "template-4": "Liste expandable",
  },
  en: {
    cards: {
      "header-title": "FAQ Sections",
      "header-description": "Organize your questions and answers in thematic sections to help your visitors",
      title: "Section title",
      create: "Create new section",
      duplicate: "Duplicate section",
      remove: "Remove section",
      "limit-label": "Progressive display",
      "limit-placeholder": "Number of questions per section (0 = all)",
      "limit-info":
        "Limit the number of questions displayed initially. Visitors can click to see the rest. 0 displays all questions.",
    },
    card: {
      "title-label": "Section title",
      "title-placeholder": "Enter the title of this FAQ section...",
      "title-info": "The title of this FAQ section. It helps group questions by theme",
      "description-label": "Description",
      "description-placeholder": "Describe this FAQ section...",
      "description-info": "A description to explain what type of questions this section covers",
    },
    faqs: {
      "header-title": "Questions & Answers",
      "header-description": "Add the questions and answers for this section",
      question: "Untitled question",
      create: "Add new question",
      duplicate: "Duplicate question",
      remove: "Delete question",
    },
    faq: {
      "question-label": "Question",
      "question-placeholder": "Ask your question...",
      "question-info": "The question your visitors ask. Be precise and clear",
      "answer-label": "Answer",
      "answer-placeholder": "Write the complete answer...",
      "answer-info": "The detailed answer to this question. You can use formatting to structure your response",
    },

    // Template
    "template-label": "Layout",
    "template-info": "Choose how to present your FAQ sections. You can change the layout at any time.",
    "template-1": "Vertical accordion",
    "template-2": "Section grid",
    "template-3": "FAQ tabs",
    "template-4": "Expandable list",
  },
  de: {
    cards: {
      "header-title": "FAQ-Bereiche",
      "header-description":
        "Organisieren Sie Ihre Fragen und Antworten in thematischen Bereichen, um Ihren Besuchern zu helfen",
      title: "Bereichstitel",
      create: "Neuen Bereich erstellen",
      duplicate: "Bereich duplizieren",
      remove: "Bereich entfernen",
      "limit-label": "Progressive Anzeige",
      "limit-placeholder": "Anzahl der Fragen pro Bereich (0 = alle)",
      "limit-info":
        "Begrenzen Sie die Anzahl der anfangs angezeigten Fragen. Besucher können klicken, um den Rest zu sehen. 0 zeigt alle Fragen an.",
    },
    card: {
      "title-label": "Bereichstitel",
      "title-placeholder": "Titel dieses FAQ-Bereichs eingeben...",
      "title-info": "Der Titel dieses FAQ-Bereichs. Er hilft dabei, Fragen nach Themen zu gruppieren",
      "description-label": "Beschreibung",
      "description-placeholder": "Diesen FAQ-Bereich beschreiben...",
      "description-info": "Eine Beschreibung, um zu erklären, welche Art von Fragen dieser Bereich behandelt",
    },
    faqs: {
      "header-title": "Fragen & Antworten",
      "header-description": "Fragen und Antworten für diesen Bereich hinzufügen",
      question: "Unbenannte Frage",
      create: "Neue Frage hinzufügen",
      duplicate: "Frage duplizieren",
      remove: "Frage löschen",
    },
    faq: {
      "question-label": "Frage",
      "question-placeholder": "Stellen Sie Ihre Frage...",
      "question-info": "Die Frage, die Ihre Besucher stellen. Seien Sie präzise und klar",
      "answer-label": "Antwort",
      "answer-placeholder": "Vollständige Antwort schreiben...",
      "answer-info":
        "Die detaillierte Antwort auf diese Frage. Sie können Formatierungen verwenden, um Ihre Antwort zu strukturieren",
    },

    // Template
    "template-label": "Layout",
    "template-info":
      "Wählen Sie, wie Sie Ihre FAQ-Bereiche präsentieren möchten. Sie können das Layout jederzeit ändern.",
    "template-1": "Vertikales Akkordeon",
    "template-2": "Bereichsraster",
    "template-3": "FAQ-Tabs",
    "template-4": "Erweiterbare Liste",
  },
}
