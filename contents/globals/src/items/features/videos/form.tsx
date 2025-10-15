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
              video: Cms.Videos.extractPayload(card.video),
            })),
            template: props.template,
          },
          translations: D.map(translations, (translation) => ({
            ...translation,
            props: {
              ...translation.props,
              cards: translation.props.cards,
            },
          })),
          slugs: [],
          files: compactFiles(
            ...pipe(
              props.cards,
              D.values,
              A.map(({ video, image }) => [video.file, image]),
              A.flat
            )
          ),
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
      video: Cms.Videos.makeValues(item.files, card.video),
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
  return (
    <div className='space-y-4'>
      <Form.Fields names={["props", "cards", id]}>
        <FormMedia.Image
          name='image'
          label={_("card.image-label")}
          contextKey={contextKey}
          ratio='aspect-video'
          labelAside={<Form.Info title={_("card.image-label")} content={_("card.image-info")} />}
        />
      </Form.Fields>
      <Cms.Videos.FormSingle pathNames={["props", "cards", id, "video"]} contextKey={contextKey} />
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
  video: Cms.Videos.makeValues(),
}
const initialFeatureTranslations: FormValues["translations"][string]["props"]["cards"][string] = {
  title: "",
  subtitle: "",
  description: "",
}

const dictionary = {
  fr: {
    cards: {
      "header-title": "Cartes vidéo",
      "header-description":
        "Créez des cartes vidéo captivantes pour présenter vos contenus multimédia de manière élégante et interactive",
      title: "Titre de la carte vidéo",
      create: "Ajouter une carte vidéo",
      duplicate: "Dupliquer cette carte",
      remove: "Supprimer cette carte",
    },
    card: {
      "image-label": "Vignette de prévisualisation",
      "image-info": "Cette image s'affiche avant que la vidéo ne soit lancée. Choisissez une image attrayante qui donne envie de cliquer sur play",
      "title-label": "Titre de la vidéo",
      "title-placeholder": "Ex: Découvrez notre nouveau produit...",
      "title-info": "Un titre accrocheur qui résume le contenu de votre vidéo en quelques mots",
      "subtitle-label": "Sous-titre (optionnel)",
      "subtitle-placeholder": "Ex: 3 minutes pour tout comprendre...",
      "subtitle-info":
        "Ajoutez des informations complémentaires comme la durée, le type de contenu ou une accroche supplémentaire",
      "description-label": "Description",
      "description-placeholder": "Décrivez brièvement le contenu de cette vidéo...",
      "description-info":
        "Un court texte pour donner envie de regarder la vidéo. Mentionnez les points clés qui seront abordés",
    },

    // Template
    "template-label": "Style d'affichage",
    "template-info":
      "Choisissez comment vos cartes vidéo seront présentées. Chaque style offre une expérience visuelle différente",
    "template-1": "Grille moderne avec lecteur intégré",
  },
  en: {
    cards: {
      "header-title": "Video cards",
      "header-description": "Create engaging video cards to showcase your multimedia content in an elegant and interactive way",
      title: "Video card title",
      create: "Add a video card",
      duplicate: "Duplicate this card",
      remove: "Remove this card",
    },
    card: {
      "image-label": "Preview thumbnail",
      "image-info": "This image displays before the video starts playing. Choose an attractive image that encourages viewers to click play",
      "title-label": "Video title",
      "title-placeholder": "e.g., Discover our new product...",
      "title-info": "A catchy title that summarizes your video content in a few words",
      "subtitle-label": "Subtitle (optional)",
      "subtitle-placeholder": "e.g., 3 minutes to understand everything...",
      "subtitle-info": "Add complementary information like duration, content type, or an additional hook",
      "description-label": "Description",
      "description-placeholder": "Briefly describe this video's content...",
      "description-info": "A short text to entice viewers to watch the video. Mention the key points that will be covered",
    },

    // Template
    "template-label": "Display style",
    "template-info": "Choose how your video cards will be presented. Each style offers a different visual experience",
    "template-1": "Modern grid with embedded player",
  },
  de: {
    cards: {
      "header-title": "Videokarten",
      "header-description": "Erstellen Sie ansprechende Videokarten, um Ihre Multimedia-Inhalte elegant und interaktiv zu präsentieren",
      title: "Videokarten-Titel",
      create: "Videokarte hinzufügen",
      duplicate: "Diese Karte duplizieren",
      remove: "Diese Karte löschen",
    },
    card: {
      "image-label": "Vorschau-Thumbnail",
      "image-info": "Dieses Bild wird angezeigt, bevor das Video abgespielt wird. Wählen Sie ein attraktives Bild, das zum Klicken auf Play einlädt",
      "title-label": "Videotitel",
      "title-placeholder": "z.B.: Entdecken Sie unser neues Produkt...",
      "title-info": "Ein einprägsamer Titel, der den Inhalt Ihres Videos in wenigen Worten zusammenfasst",
      "subtitle-label": "Untertitel (optional)",
      "subtitle-placeholder": "z.B.: 3 Minuten um alles zu verstehen...",
      "subtitle-info": "Fügen Sie ergänzende Informationen wie Dauer, Inhaltstyp oder einen zusätzlichen Aufhänger hinzu",
      "description-label": "Beschreibung",
      "description-placeholder": "Beschreiben Sie kurz den Inhalt dieses Videos...",
      "description-info": "Ein kurzer Text, der Lust macht, das Video anzuschauen. Erwähnen Sie die wichtigsten Punkte, die behandelt werden",
    },

    // Template
    "template-label": "Anzeigestil",
    "template-info": "Wählen Sie, wie Ihre Videokarten präsentiert werden. Jeder Stil bietet ein anderes visuelles Erlebnis",
    "template-1": "Modernes Raster mit eingebettetem Player",
  },
}
