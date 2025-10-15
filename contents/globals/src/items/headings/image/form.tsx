import { Cms, compactFiles, CreateItemForm, extractItemFile, FormUpdate } from "@compo/contents"
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
          image: extractItemFile(item, item.props.image),
          template: item.props.template,
        },
        translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
      },
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const files = compactFiles(props.image)
        const payload = {
          props: {
            level: props.level,
            image: props.image?.id ?? null,
            template: props.template,
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

          <Form.Fields name='props'>
            <FormMedia.Image
              name='image'
              label={_("image-label")}
              labelAside={<FormInfo title={_("image-label")} content={_("image-info")} />}
            />
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
    "title-label": "Titre principal",
    "title-placeholder": "Ex: Notre vision pour demain...",
    "title-info":
      "Le titre qui captera l'attention de vos visiteurs. Soyez percutant et direct, c'est la première chose qu'ils verront",

    // Sous-titre
    "subtitle-label": "Sous-titre (optionnel)",
    "subtitle-placeholder": "Ex: Une approche innovante et durable...",
    "subtitle-info": "Complétez votre titre avec une phrase d'accroche qui donne envie d'en savoir plus",

    // Description
    "description-label": "Contenu détaillé",
    "description-placeholder": "Développez votre message principal ici...",
    "description-info":
      "L'espace pour raconter votre histoire. Structurez votre texte avec des paragraphes, des listes et du texte en gras pour une lecture fluide",

    // Image
    "image-label": "Image d'illustration",
    "image-info":
      "Choisissez une image qui renforce votre message. Une photo de qualité vaut mille mots et rendra votre section mémorable",

    // Template
    "template-label": "Disposition visuelle",
    "template-info":
      "Définissez l'harmonie entre votre texte et votre image. Testez différentes dispositions pour trouver celle qui convient le mieux",
    "template-1": "Entête avec image carrée",
    "template-2": "Entête avec infographie",
  },
  en: {
    // Title
    "title-label": "Main heading",
    "title-placeholder": "e.g., Our vision for tomorrow...",
    "title-info":
      "The headline that will capture your visitors' attention. Be impactful and direct, it's the first thing they'll see",

    // Subtitle
    "subtitle-label": "Subtitle (optional)",
    "subtitle-placeholder": "e.g., An innovative and sustainable approach...",
    "subtitle-info": "Enhance your title with a hook that makes people want to learn more",

    // Description
    "description-label": "Detailed content",
    "description-placeholder": "Expand on your main message here...",
    "description-info":
      "The space to tell your story. Structure your text with paragraphs, lists, and bold text for smooth reading",

    // Image
    "image-label": "Illustration image",
    "image-info":
      "Choose an image that reinforces your message. A quality photo is worth a thousand words and will make your section memorable",

    // Template
    "template-label": "Visual layout",
    "template-info":
      "Define the harmony between your text and image. Try different layouts to find the one that works best",
    "template-1": "Heading with square image",
    "template-2": "Heading with infographic",
  },
  de: {
    // Titel
    "title-label": "Hauptüberschrift",
    "title-placeholder": "z.B.: Unsere Vision für morgen...",
    "title-info":
      "Die Überschrift, die die Aufmerksamkeit Ihrer Besucher fesselt. Seien Sie prägnant und direkt, es ist das Erste, was sie sehen werden",

    // Untertitel
    "subtitle-label": "Untertitel (optional)",
    "subtitle-placeholder": "z.B.: Ein innovativer und nachhaltiger Ansatz...",
    "subtitle-info": "Ergänzen Sie Ihren Titel mit einem Aufhänger, der Lust auf mehr macht",

    // Beschreibung
    "description-label": "Detaillierter Inhalt",
    "description-placeholder": "Entwickeln Sie hier Ihre Hauptbotschaft...",
    "description-info":
      "Der Raum, um Ihre Geschichte zu erzählen. Strukturieren Sie Ihren Text mit Absätzen, Listen und Fettdruck für flüssiges Lesen",

    // Bild
    "image-label": "Illustrationsbild",
    "image-info":
      "Wählen Sie ein Bild, das Ihre Botschaft verstärkt. Ein Qualitätsfoto sagt mehr als tausend Worte und macht Ihren Abschnitt unvergesslich",

    // Vorlage
    "template-label": "Visuelle Anordnung",
    "template-info":
      "Definieren Sie die Harmonie zwischen Text und Bild. Probieren Sie verschiedene Anordnungen aus, um die beste zu finden",
    "template-1": "Überschrift mit quadratischem Bild",
    "template-2": "Überschrift mit Infografik",
  },
}
