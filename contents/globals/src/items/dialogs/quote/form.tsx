import { CreateItemForm, FormUpdate } from "@compo/contents"
import { Form, FormInfo, useForm } from "@compo/form"
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
        },
        translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
      },
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const payload = {
          props: {
            level: props.level,
          },
          translations,
          files: [],
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
                    name='title'
                    label={_("title-label")}
                    placeholder={_("title-placeholder")}
                    lang={code}
                    labelAside={<Form.Localized title={_("title-label")} content={_("title-info")} />}
                  />
                  <Form.TextEditor
                    name='content'
                    label={_("content-label")}
                    placeholder={_("content-placeholder")}
                    lang={code}
                    prose={proses?.content}
                    labelAside={<Form.Localized title={_("content-label")} content={_("content-info")} />}
                    classNames={{ item: "pt-6" }}
                  />
                </Form.Fields>
              )}
            </FormTranslatableContent>
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
    // Title
    "title-label": "Titre de la citation",
    "title-placeholder": "Ex: Citation importante, Témoignage client...",
    "title-info": "Titre qui apparaîtra au-dessus de votre citation pour la contextualiser",

    // Content
    "content-label": "Citation",
    "content-placeholder": "Saisissez votre citation, témoignage ou point important ici...",
    "content-info":
      "Ajoutez votre citation, témoignage client ou point important à mettre en avant. Utilisez l'éditeur pour formater le texte si nécessaire",

    // Template
    "template-label": "Mise en page",
    "template-info": "Choisissez la présentation de votre citation. Vous pouvez changer le template à tout moment",
    "template-1": "Centré étroit",
    "template-2": "Centré large",
    "template-3": "Deux colonnes (entête + contenu)",
    "template-4": "Deux colonnes (contenu)",
  },
  en: {
    // Title
    "title-label": "Quote title",
    "title-placeholder": "E.g: Important quote, Customer testimonial...",
    "title-info": "Title that will appear above your quote to provide context",

    // Content
    "content-label": "Quote",
    "content-placeholder": "Enter your quote, testimonial or important point here...",
    "content-info":
      "Add your quote, customer testimonial or important point to highlight. Use the editor to format the text if needed",

    // Template
    "template-label": "Layout",
    "template-info": "Choose your quote presentation. You can change the template at any time",
    "template-1": "Narrow centered",
    "template-2": "Wide centered",
    "template-3": "Two columns (header + content)",
    "template-4": "Two columns (content)",
  },
  de: {
    // Title
    "title-label": "Zitat-Titel",
    "title-placeholder": "Z.B: Wichtiges Zitat, Kundenstimme...",
    "title-info": "Titel, der über Ihrem Zitat erscheint, um es zu kontextualisieren",

    // Content
    "content-label": "Zitat",
    "content-placeholder": "Geben Sie Ihr Zitat, Testimonial oder wichtigen Punkt hier ein...",
    "content-info":
      "Fügen Sie Ihr Zitat, Kundentestimonial oder wichtigen Punkt hinzu, den Sie hervorheben möchten. Verwenden Sie den Editor, um den Text bei Bedarf zu formatieren",

    // Template
    "template-label": "Layout",
    "template-info": "Wählen Sie die Präsentation Ihres Zitats. Sie können die Vorlage jederzeit ändern",
    "template-1": "Schmal zentriert",
    "template-2": "Breit zentriert",
    "template-3": "Zwei Spalten (Kopfzeile + Inhalt)",
    "template-4": "Zwei Spalten (Inhalt)",
  },
}
