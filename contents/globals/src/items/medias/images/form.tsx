import { Cms, compactFiles, CreateItemForm, extractItemFiles, FormUpdate } from "@compo/contents"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
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
            displayHeading: props.displayHeading,
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
          <Cms.Headings.FormHeadingOptional prose={proses?.description} />
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
              labelAside={<Form.Info title={_("template-label")} content={_("template-info")} />}
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
    // Images
    "images-label": "Images",
    "images-info": "Ajoutez une ou plusieurs images à afficher. Vous pouvez réorganiser l'ordre par glisser-déposer.",

    // Template
    "template-label": "Mise en page",
    "template-info": "Choisissez la présentation de votre contenu. Vous pouvez changer le template à tout moment",
    "template-1": "Galerie d'images",
    "template-2": "Grille d'images 2 colonnes",
  },
  en: {
    // Images
    "images-label": "Images",
    "images-info": "Add one or more images to display. You can rearrange the order by drag and drop.",

    // Template
    "template-label": "Layout",
    "template-info": "Choose your content presentation. You can change the template at any time",
    "template-1": "Image gallery",
    "template-2": "2 column image grid",
  },
  de: {
    // Images
    "images-label": "Bilder",
    "images-info":
      "Fügen Sie ein oder mehrere Bilder zur Anzeige hinzu. Sie können die Reihenfolge per Drag & Drop ändern.",

    // Template
    "template-label": "Layout",
    "template-info": "Wählen Sie die Präsentation Ihres Inhalts. Sie können die Vorlage jederzeit ändern",
    "template-1": "Bildergalerie",
    "template-2": "2 Spalten Bildgrille",
  },
}
