import { Cms, CreateItemForm, FormUpdate } from "@compo/contents"
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
          displayHeading: item.props.displayHeading,
          template: item.props.template,
        },
        translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
      },
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const payload = {
          props: {
            level: props.level,
            displayHeading: props.displayHeading,
            template: props.template,
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
          <Cms.Headings.FormHeadingOptional prose={proses?.description} />

          <Form.Fields name='translations'>
            <FormTranslatableContent>
              {({ code }) => (
                <Form.Fields name='props'>
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
    // Content
    "content-label": "Contenu",
    "content-placeholder": "Rédigez votre contenu ici...",
    "content-info":
      "Utilisez l'éditeur pour formater votre texte avec des titres, listes, liens, et plus. Le contenu s'adaptera automatiquement au template choisi",

    // Template
    "template-label": "Mise en page",
    "template-info": "Choisissez la présentation de votre contenu. Vous pouvez changer le template à tout moment",
    "template-1": "Centré étroit",
    "template-2": "Centré large",
    "template-3": "Deux colonnes (entête + contenu)",
    "template-4": "Deux colonnes (contenu)",
  },
  en: {
    // Content
    "content-label": "Content",
    "content-placeholder": "Write your content here...",
    "content-info":
      "Use the editor to format your text with headings, lists, links, and more. Content will automatically adapt to the chosen template",

    // Template
    "template-label": "Layout",
    "template-info": "Choose your content presentation. You can change the template at any time",
    "template-1": "Narrow centered",
    "template-2": "Wide centered",
    "template-3": "Two columns (header + content)",
    "template-4": "Two columns (content)",
  },
  de: {
    // Content
    "content-label": "Inhalt",
    "content-placeholder": "Schreiben Sie Ihren Inhalt hier...",
    "content-info":
      "Verwenden Sie den Editor, um Ihren Text mit Überschriften, Listen, Links und mehr zu formatieren. Der Inhalt passt sich automatisch an die gewählte Vorlage an",

    // Template
    "template-label": "Layout",
    "template-info": "Wählen Sie die Präsentation Ihres Inhalts. Sie können die Vorlage jederzeit ändern",
    "template-1": "Schmal zentriert",
    "template-2": "Breit zentriert",
    "template-3": "Zwei Spalten (Kopfzeile + Inhalt)",
    "template-4": "Zwei Spalten (Inhalt)",
  },
}
