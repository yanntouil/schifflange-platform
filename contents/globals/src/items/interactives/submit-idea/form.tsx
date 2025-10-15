import { Cms, CreateItemForm, FormUpdate } from "@compo/contents"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs } from "@compo/translations"
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

          {/* <Form.Fields name='props'>
            <Form.Template
              name='template'
              label={_("template-label")}
              labelAside={<Form.Info title={_("template-label")} content={_("template-info")} />}
              options={A.map(D.toPairs(templates), ([key, Comp]) => ({
                label: _(key),
                content: <Comp />,
                value: key,
              }))}
            />
          </Form.Fields> */}

          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }

const dictionary = {
  fr: {
    // Template
    "template-label": "Mise en page",
    "template-info": "Choisissez la présentation de votre contenu. Vous pouvez changer le template à tout moment",
    "template-1": "",
  },
  en: {
    // Template
    "template-label": "Layout",
    "template-info": "Choose your content presentation. You can change the template at any time",
    "template-1": "",
  },
  de: {
    // Template
    "template-label": "Layout",
    "template-info": "Wählen Sie die Präsentation Ihres Inhalts. Sie können die Vorlage jederzeit ändern",
    "template-1": "",
  },
}
