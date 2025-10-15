import { Cms, compactFiles, CreateItemForm, FormUpdate } from "@compo/contents"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableContent, FormTranslatableTabs } from "@compo/translations"
import { A, D } from "@compo/utils"
import { contentItem } from "./export"

export const createForm: CreateItemForm<typeof contentItem> =
  ({ templates, proses }) =>
  ({ item, onSubmit }) => {
    const { _ } = useTranslation(dictionary)
    const form = useForm({
      allowSubmitAttempt: true,
      values: {
        props: {
          level: item.props.level,
          video: Cms.Videos.makeValues(item.files, item.props.video),
        },
        translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
      },
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const files = compactFiles(props.video.file)
        const payload = {
          props: {
            level: props.level,
            video: Cms.Videos.extractPayload(props.video),
          },
          translations,
          files,
        }
        await onSubmit(payload)
      },
    })

    return (
      <Form.Root form={form}>
        <FormTranslatableTabs classNames={{ root: "flex flex-col gap-6" }}>
          <Form.Fields name='translations'>
            <FormTranslatableContent>
              {({ code }) => (
                <Form.Fields name='props'>
                  <Form.Input
                    label={_("title-label")}
                    name='title'
                    placeholder={_("title-placeholder")}
                    lang={code}
                    maxLength={255}
                    labelAside={<Form.Localized title={_("title-label")} content={_("title-info")} />}
                  />
                </Form.Fields>
              )}
            </FormTranslatableContent>
          </Form.Fields>
          <Cms.Headings.FormLevel names={["props", "level"]} />
          <Form.Fields name='translations'>
            <FormTranslatableContent className='flex flex-col gap-6'>
              {({ code }) => (
                <Form.Fields name='props'>
                  <Form.Input
                    label={_("subtitle-label")}
                    name='subtitle'
                    placeholder={_("subtitle-placeholder")}
                    lang={code}
                    maxLength={255}
                    labelAside={<Form.Localized title={_("subtitle-label")} content={_("subtitle-info")} />}
                  />
                  <Form.TextEditor
                    name='description'
                    label={_("description-label")}
                    placeholder={_("description-placeholder")}
                    lang={code}
                    labelAside={<Form.Localized title={_("description-label")} content={_("description-info")} />}
                    prose={proses?.description}
                  />
                </Form.Fields>
              )}
            </FormTranslatableContent>
          </Form.Fields>

          <Cms.Videos.FormSingle pathNames={["props", "video"]} contextKey={item.id} />
          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }

const dictionary = {
  fr: {
    // Titre
    "title-label": "Titre",
    "title-placeholder": "Entrez le titre principal...",
    "title-info":
      "Le titre principal de votre section. Il sera affiché en grand et attirera l'attention des visiteurs.",

    // Sous-titre
    "subtitle-label": "Sous-titre",
    "subtitle-placeholder": "Entrez un sous-titre (optionnel)...",
    "subtitle-info": "Un sous-titre optionnel pour compléter votre titre principal et donner plus de contexte.",

    // Description
    "description-label": "Description",
    "description-placeholder": "Rédigez une description détaillée...",
    "description-info":
      "Une description pour accompagner votre titre et votre vidéo. Vous pouvez utiliser la mise en forme pour structurer votre texte.",
  },
  en: {
    // Title
    "title-label": "Title",
    "title-placeholder": "Enter the main title...",
    "title-info": "The main title of your section. It will be displayed prominently and catch visitors' attention.",

    // Subtitle
    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Enter a subtitle (optional)...",
    "subtitle-info": "An optional subtitle to complement your main title and provide more context.",

    // Description
    "description-label": "Description",
    "description-placeholder": "Write a detailed description...",
    "description-info":
      "A description to accompany your title and video. You can use formatting to structure your text.",
  },
  de: {
    // Titel
    "title-label": "Titel",
    "title-placeholder": "Haupttitel eingeben...",
    "title-info":
      "Der Haupttitel Ihres Bereichs. Er wird prominent angezeigt und zieht die Aufmerksamkeit der Besucher auf sich.",

    // Untertitel
    "subtitle-label": "Untertitel",
    "subtitle-placeholder": "Untertitel eingeben (optional)...",
    "subtitle-info": "Ein optionaler Untertitel zur Ergänzung Ihres Haupttitels und für mehr Kontext.",

    // Beschreibung
    "description-label": "Beschreibung",
    "description-placeholder": "Detaillierte Beschreibung verfassen...",
    "description-info":
      "Eine Beschreibung zur Begleitung Ihres Titels und Videos. Sie können Formatierungen verwenden, um Ihren Text zu strukturieren.",
  },
}
