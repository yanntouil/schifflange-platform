import { Cms, compactFiles, CreateItemForm, extractItemFile, FormUpdate, type InferItem } from "@compo/contents"
import { Form, FormInfo, FormReorderableList, useForm, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { FormTranslatableContent, FormTranslatableTabs, useFormTranslatableContext } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, pipe, placeholder } from "@compo/utils"
import { useDashboardService } from "@services/dashboard"
import React from "react"
import { contentItem } from "./export"

export const createForm: CreateItemForm<typeof contentItem> =
  ({ templates, proses }) =>
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
            orderedCards: props.orderedCards,
            cards: D.map(props.cards, (card) => ({
              ...card,
              image: card.image?.id ?? null,
            })),
            template: props.template,
          },
          translations: D.map(translations, (translation) => ({
            ...translation,
            props: {
              ...translation.props,
              cards: D.map(translation.props.cards, (card) => ({
                ...card,
              })),
            },
          })),
          slugs: [],
          files: compactFiles(...pipe(props.cards, D.values, A.map(D.prop("image")))),
        }
        await onSubmit(payload)
      },
    })

    return (
      <Form.Root form={form}>
        <FormTranslatableTabs classNames={{ root: "flex flex-col gap-6" }}>
          <Cms.Headings.FormHeadingOptional prose={proses?.description} />
          <FormCards />
          <Form.Fields name='props'>
            <Form.Template
              name='template'
              label={_("template-label")}
              labelAside={<FormInfo title={_("template-label")} content={_("template-info")} />}
              options={A.map(D.toPairs(templates), ([key, Comp]) => ({
                label: _(key),
                content: <Comp />,
                value: key,
              }))}
            />
          </Form.Fields>
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
    orderedCards: item.props.orderedCards,
    cards: D.map(item.props.cards, (card) => ({
      ...card,
      image: extractItemFile(item, card.image),
    })),
    template: item.props.template,
  },
  translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
})
type FormValues = ReturnType<typeof makeValues>

/**
 * FormCards
 * display the form to create/edit the cards
 */
const FormCards: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { values, setValues } = useFormContext<FormValues>()
  const { current } = useFormTranslatableContext()
  const { getImageUrl } = useDashboardService().service
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
              <Ui.Image src={getImageUrl(card.image, "thumbnail") ?? undefined} className='size-4 rounded-md border'>
                <Ui.ImageEmpty className='size-2' />
              </Ui.Image>
              {placeholder(translations.title, _("cards.title"))}
            </>
          )
        }}
        t={_.prefixed("cards")}
      >
        {({ id, index }) => <FormCard id={id} index={index} key={id} />}
      </FormReorderableList>
    </div>
  )
}

/**
 * FormCard
 * display the form to create/edit the card
 */
const FormCard: React.FC<{ id: string; index: number }> = ({ id, index }) => {
  const { _ } = useTranslation(dictionary)
  const { contextKey, props } = useFormContext<FormValues>().values
  const typeOptions = React.useMemo(() => {
    return A.map(["gold", "finch", "moss", "glacier", "white"], (type) => ({
      label: _(`card.type-${type}`),
      value: type,
    }))
  }, [])
  return (
    <div className='space-y-4'>
      <Form.Fields names={["props", "cards", id]}>
        <FormMedia.Image
          name='image'
          label={_("card.image-label")}
          contextKey={contextKey}
          ratio='aspect-square'
          classNames={{ input: "max-w-32" }}
        />
      </Form.Fields>
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
              <Form.Input
                name='subtitle'
                label={_("card.subtitle-label")}
                placeholder={_("card.subtitle-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("card.subtitle-label")} content={_("card.subtitle-info")} />}
              />
              <Form.Textarea
                name='description'
                label={_("card.description-label")}
                placeholder={_("card.description-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("card.description-label")} content={_("card.description-info")} />}
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
  image: null,
}
const initialFeatureTranslations: FormValues["translations"][string]["props"]["cards"][string] = {
  title: "",
  subtitle: "",
  description: "",
}

const dictionary = {
  fr: {
    cards: {
      "header-title": "Activités",
      "header-description":
        "Les activités sont des blocs de contenu qui permettent de présenter de l'information de manière structurée",
      title: "Titre de l'activité",
      create: "Créer une nouvelle activité",
      duplicate: "Dupliquer l'activité",
      remove: "Retirer l'activité",
    },
    card: {
      "image-label": "Image",
      "title-label": "Titre",
      "title-placeholder": "Entrez le titre de la carte...",
      "title-info": "Le titre principal de votre carte. Court et percutant pour attirer l'attention",
      "subtitle-label": "Sous-titre",
      "subtitle-placeholder": "Ajoutez un sous-titre optionnel...",
      "subtitle-info":
        "Un sous-titre pour apporter du contexte supplémentaire. Idéal pour une accroche ou une précision",
      "description-label": "Description",
      "description-placeholder": "Décrivez le contenu de votre carte...",
      "description-info":
        "Une description concise pour présenter votre contenu. Restez bref pour maintenir l'attention",
    },

    // Template
    "template-label": "Mise en page",
    "template-info":
      "Choisissez comment organiser le contenu et l'image. Vous pouvez changer la mise en page à tout moment.",
    "template-1": "Finch",
    "template-2": "Moss",
    "template-3": "Glacier",
  },
  en: {
    cards: {
      "header-title": "Activities",
      "header-description": "Activities are content blocks that allow you to present information in a structured way",
      title: "Activity title",
      create: "Create new activity",
      duplicate: "Duplicate activity",
      remove: "Remove activity",
    },
    card: {
      "image-label": "Image",
      "title-label": "Title",
      "title-placeholder": "Enter the card title...",
      "title-info": "The main title of your activity. Keep it short and impactful to grab attention",
      "subtitle-label": "Subtitle",
      "subtitle-placeholder": "Add an optional subtitle...",
      "subtitle-info": "A subtitle to provide additional context. Perfect for a hook or clarification",
      "description-label": "Description",
      "description-placeholder": "Describe your card content...",
      "description-info": "A concise description to present your content. Keep it brief to maintain attention",
    },

    // Template
    "template-label": "Layout",
    "template-info": "Choose how to organize the content and image. You can change the layout at any time.",
    "template-1": "Finch",
    "template-2": "Moss",
    "template-3": "Glacier",
  },
  de: {
    cards: {
      "header-title": "Aktivitäten",
      "header-description":
        "Aktivitäten sind Inhaltsblöcke, mit denen Sie Informationen strukturiert präsentieren können",
      title: "Aktivitätentitel",
      create: "Neue Aktivität erstellen",
      duplicate: "Aktivität duplizieren",
      remove: "Aktivität entfernen",
    },
    card: {
      "image-label": "Bild",
      "title-label": "Titel",
      "title-placeholder": "Aktivitätentitel eingeben...",
      "title-info": "Der Haupttitel Ihrer Karte. Kurz und prägnant, um Aufmerksamkeit zu erregen",
      "subtitle-label": "Untertitel",
      "subtitle-placeholder": "Optionalen Untertitel hinzufügen...",
      "subtitle-info": "Ein Untertitel für zusätzlichen Kontext. Ideal für einen Aufhänger oder eine Präzisierung",
      "description-label": "Beschreibung",
      "description-placeholder": "Beschreiben Sie Ihren Aktivitätenteninhalt...",
      "description-info":
        "Eine prägnante Beschreibung zur Präsentation Ihres Inhalts. Bleiben Sie kurz, um die Aufmerksamkeit zu halten",
    },

    // Template
    "template-label": "Layout",
    "template-info":
      "Wählen Sie, wie Inhalt und Bild organisiert werden sollen. Sie können das Layout jederzeit ändern.",
    "template-1": "Finch",
    "template-2": "Moss",
    "template-3": "Glacier",
  },
}
