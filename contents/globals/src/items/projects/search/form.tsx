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
          limit: item.props.limit,
        },
        translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
      },
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const payload = {
          props: {
            level: props.level,
            displayHeading: props.displayHeading,
            limit: props.limit,
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
          <Form.Fields name='props'>
            <Form.Quantity
              name='limit'
              label={_("limit-label")}
              placeholder={_("limit-placeholder")}
              labelAside={<Form.Info title={_("limit-label")} content={_("limit-info")} />}
              step={1}
              min={0}
              max={100}
              classNames={{ input: "w-36" }}
            />
          </Form.Fields>
          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }

const dictionary = {
  fr: {
    "limit-label": "Affichage progressif",
    "limit-placeholder": "Nombre de résultats par page (0 = toutes)",
    "limit-info":
      "Limitez le nombre de résultats affichés initialement. Les visiteurs pourront changer de page pour voir d'autres résultats. 0 affiche toutes les résultats.",
  },
  en: {
    "limit-label": "Progressive display",
    "limit-placeholder": "Number of results per page (0 = all)",
    "limit-info":
      "Limit the number of results displayed initially. Visitors can change page to see more results. 0 displays all results.",
  },
  de: {
    "limit-label": "Progressive Anzeige",
    "limit-placeholder": "Anzahl der Ergebnisse pro Seite (0 = alle)",
    "limit-info":
      "Beschränken Sie die Anzahl der angezeigten Ergebnisse zu Beginn. Besucher können zur nächsten Seite wechseln, um weitere Ergebnisse zu sehen. 0 zeigt alle Ergebnisse an.",
  },
}
