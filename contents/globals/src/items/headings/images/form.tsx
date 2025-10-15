import { Cms, compactFiles, CreateItemForm, extractItemFiles, FormUpdate } from "@compo/contents"
import { Form, FormInfo, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
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
          images: extractItemFiles(item, item.props.images),
          template: item.props.template,
        },
        translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
      },
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const payload = {
          props: {
            level: props.level,
            images: compactFiles(props.images),
            template: props.template,
          },
          translations,
          files: compactFiles(props.images),
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

          <Form.Fields name='props'>
            <FormMedia.Images
              name='images'
              label={_("images-label")}
              labelAside={<Form.Localized title={_("images-label")} content={_("images-info")} />}
              classNames={{ item: "pt-6" }}
            />
          </Form.Fields>
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
      "Une description complète pour expliquer votre contenu. Vous pouvez utiliser la mise en forme pour structurer votre texte.",

    // Image
    "images-label": "Images",
    "images-info":
      "Les images seront affichées à côté du contenu selon le template choisi. Privilégiez des images de haute qualité.",

    // Template
    "template-label": "Mise en page",
    "template-info":
      "Choisissez comment organiser le contenu et l'image. Vous pouvez changer la mise en page à tout moment.",
    "template-1": "Slider d'images",
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
      "A complete description to explain your content. You can use formatting to structure your text.",

    // Image
    "images-label": "Images",
    "images-info":
      "The images will be displayed alongside the content according to the chosen template. Use high-quality images.",

    // Template
    "template-label": "Layout",
    "template-info": "Choose how to organize the content and image. You can change the layout at any time.",
    "template-1": "Image slider",
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
      "Eine vollständige Beschreibung zur Erklärung Ihres Inhalts. Sie können Formatierungen verwenden, um Ihren Text zu strukturieren.",

    // Bild
    "images-label": "Bilder",
    "images-info":
      "Das Bild wird je nach gewählter Vorlage neben dem Inhalt angezeigt. Verwenden Sie ein hochwertiges Bild.",

    // Vorlage
    "template-label": "Layout",
    "template-info":
      "Wählen Sie, wie Inhalt und Bild organisiert werden sollen. Sie können das Layout jederzeit ändern.",
    "template-1": "Bildslider",
  },
}
