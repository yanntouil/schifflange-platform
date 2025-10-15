import { Cms, CreateItemForm, FormUpdate } from "@compo/contents"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useCategoryOptions, useTagOptions } from "@compo/projects"
import { FormTranslatableTabs } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D } from "@compo/utils"
import { contentItem } from "./export"

export const createForm: CreateItemForm<typeof contentItem> =
  ({ templates, proses }) =>
  ({ item, onSubmit }) => {
    const { _ } = useTranslation(dictionary)
    const [categoryOptions] = useCategoryOptions()
    const [tagOptions] = useTagOptions()
    const form = useForm({
      allowSubmitAttempt: true,
      values: {
        props: {
          level: item.props.level,
          displayHeading: item.props.displayHeading,
          limit: item.props.limit,
          categories: item.props.categories,
          tags: item.props.tags,
          displayLink: item.props.displayLink,
          link: item.props.link,
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
            categories: props.categories,
            tags: props.tags,
            displayLink: props.displayLink,
            link: props.link,
          },
          translations,
          slugs: props.link?.slugId ? [props.link.slugId] : [],
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
            <Form.Header title={_("filters-label")} description={_("filters-description")} />
            <Form.SelectMultiple
              name='categories'
              label={_("categories-label")}
              options={categoryOptions}
              placeholder={_("categories-placeholder")}
              labelAside={<Form.Info title={_("categories-label")} content={_("categories-info")} />}
              maxDisplayedItems={2}
            />
            <Form.SelectMultiple
              name='tags'
              label={_("tags-label")}
              options={tagOptions}
              placeholder={_("tags-placeholder")}
              labelAside={<Form.Info title={_("tags-label")} content={_("tags-info")} />}
              maxDisplayedItems={3}
            />
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
          <Ui.Collapsible.Root className='space-y-4' open={form.values.props.displayLink}>
            <div className='flex justify-between gap-6'>
              <Form.Header title={_("link-label")} description={_("link-description")} className='grow' />
              <Form.Fields name='props'>
                <Form.SimpleSwitch name='displayLink' size='sm' classNames={{ switch: "mt-3" }} />
              </Form.Fields>
            </div>
            <Ui.Collapsible.Content className='overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
              <Cms.Links.FormSingle pathNames={["props", "link"]} asLink />
            </Ui.Collapsible.Content>
          </Ui.Collapsible.Root>
          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }

const dictionary = {
  fr: {
    "filters-label": "Filtres et sélection",
    "filters-description":
      "Configurez les filtres pour sélectionner automatiquement les projets les plus récents à afficher.",

    "categories-label": "Domaines d'actions",
    "categories-placeholder": "Sélectionner des domaines d'actions",
    "categories-info":
      "Sélectionnez les domaines d'actions pour filtrer les projets affichés. Laissez vide pour afficher tous les domaines.",

    "tags-label": "Public cible",
    "tags-placeholder": "Sélectionner des publics cibles",
    "tags-info":
      "Sélectionnez les publics cibles pour filtrer les projets affichés. Laissez vide pour afficher tous les publics.",

    "projects-label": "Projets spécifiques",
    "projects-info":
      "Sélectionnez des projets spécifiques à afficher en priorité. Ils s'ajoutent aux résultats filtrés par catégories et tags.",

    "limit-label": "Affichage progressif",
    "limit-placeholder": "Nombre de résultats par page (0 = toutes)",
    "limit-info":
      "Limitez le nombre de résultats affichés initialement. Les visiteurs pourront changer de page pour voir d'autres résultats. 0 affiche toutes les résultats.",

    "link-label": "Lien personnalisé",
    "link-description": "Ajoutez un lien vers une page pour voir tous les projets.",
  },
  en: {
    "filters-label": "Filters and selection",
    "filters-description": "Configure filters to automatically select the most recent projects to display.",

    "categories-label": "Action Areas",
    "categories-placeholder": "Select action areas",
    "categories-info": "Select action areas to filter displayed projects. Leave empty to show all areas.",

    "tags-label": "Target Audience",
    "tags-placeholder": "Select target audiences",
    "tags-info": "Select target audiences to filter displayed projects. Leave empty to show all audiences.",

    "projects-label": "Specific projects",
    "projects-info":
      "Select specific projects to display with priority. They are added to filtered results by categories and tags.",

    "limit-label": "Progressive display",
    "limit-placeholder": "Number of results per page (0 = all)",
    "limit-info":
      "Limit the number of results displayed initially. Visitors can change page to see more results. 0 displays all results.",

    "link-label": "Custom link",
    "link-description": "Add a link to a page to see all projects.",
  },
  de: {
    "filters-label": "Filter und Auswahl",
    "filters-description": "Konfigurieren Sie Filter, um automatisch die neuesten anzuzeigenden Projekte auszuwählen.",

    "categories-label": "Handlungsbereiche",
    "categories-placeholder": "Handlungsbereiche auswählen",
    "categories-info":
      "Wählen Sie Handlungsbereiche aus, um angezeigte Projekte zu filtern. Leer lassen, um alle Bereiche anzuzeigen.",

    "tags-label": "Zielgruppe",
    "tags-placeholder": "Zielgruppen auswählen",
    "tags-info":
      "Wählen Sie Zielgruppen aus, um angezeigte Projekte zu filtern. Leer lassen, um alle Zielgruppen anzuzeigen.",

    "projects-label": "Spezifische Projekte",
    "projects-info":
      "Wählen Sie spezifische Projekte zur prioritären Anzeige aus. Sie werden zu den nach Kategorien und Tags gefilterten Ergebnissen hinzugefügt.",

    "limit-label": "Progressive Anzeige",
    "limit-placeholder": "Anzahl der Ergebnisse pro Seite (0 = alle)",
    "limit-info":
      "Beschränken Sie die Anzahl der angezeigten Ergebnisse zu Beginn. Besucher können zur nächsten Seite wechseln, um weitere Ergebnisse zu sehen. 0 zeigt alle Ergebnisse an.",

    "link-label": "Benutzerdefinierter Link",
    "link-description": "Fügen Sie einen Link zu einer Seite hinzu, um alle Projekte anzuzeigen.",
  },
}
