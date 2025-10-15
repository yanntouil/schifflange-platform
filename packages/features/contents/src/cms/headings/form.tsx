import { Form, FormInfo, FormLocalized, FormSelect, FormSimpleSwitch, useFormContext } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { FormTranslatableContent } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, cx, G } from "@compo/utils"
import React from "react"

/**
 * FormHeading
 * display a form to add a heading to the content block
 */
export const FormHeading: React.FC<React.ComponentProps<"div"> & { prose: string }> = ({
  className,
  prose,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <div className={cx("space-y-4", className)} {...props}>
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
                labelAside={<FormLocalized title={_("title-label")} content={_("title-info")} />}
              />
            </Form.Fields>
          )}
        </FormTranslatableContent>
      </Form.Fields>
      <Form.Fields name='props'>
        <FormLevel names={["level"]} classNames={{ item: "pt-6" }} />
      </Form.Fields>
      <Form.Fields name='translations'>
        <FormTranslatableContent>
          {({ code }) => (
            <Form.Fields name='props'>
              <Form.Input
                label={_("subtitle-label")}
                name='subtitle'
                placeholder={_("subtitle-placeholder")}
                lang={code}
                maxLength={255}
                labelAside={<FormLocalized title={_("subtitle-label")} content={_("subtitle-info")} />}
                classNames={{ item: "pt-6" }}
              />
              <Form.TextEditor
                name='description'
                label={_("description-label")}
                placeholder={_("description-placeholder")}
                lang={code}
                labelAside={<FormLocalized title={_("description-label")} content={_("description-info")} />}
                classNames={{ item: "pt-6" }}
                prose={prose}
              />
            </Form.Fields>
          )}
        </FormTranslatableContent>
      </Form.Fields>
    </div>
  )
}

/**
 * FormHeadingOptional
 * display a form to add a heading to the content block
 */
export const FormHeadingOptional: React.FC<React.ComponentProps<"div"> & { prose: string }> = ({
  className,
  prose,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  const { values } = useFormContext<{ props: { displayHeading: boolean } }>()
  return (
    <Ui.Collapsible.Root className={cx("space-y-4", className)} open={values.props.displayHeading}>
      <div className='flex justify-between gap-6'>
        <Form.Header title={_("header-title")} description={_("header-description")} className='grow' />
        <Form.Fields name='props'>
          <FormSimpleSwitch name='displayHeading' size='sm' classNames={{ switch: "mt-3" }} />
        </Form.Fields>
      </div>
      <Ui.Collapsible.Content className='overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
        <FormHeading prose={prose} className='rounded-md border border-input p-4' {...props} />
      </Ui.Collapsible.Content>
    </Ui.Collapsible.Root>
  )
}

/**
 * FormLevel
 */
type Props = {
  names: string[]
  label?: string
  info?: string
  classNames?: React.ComponentProps<typeof FormSelect>["classNames"]
}
export const FormLevel: React.FC<Props> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { label = _("level-label"), info = _("level-info"), classNames } = props
  const titleLevelOption = React.useMemo(
    () =>
      A.map(A.range(1, 6), (level) => ({
        label: _("level-option", { level }),
        value: `${level}`,
      })),
    [_]
  )
  const lastName = A.last(props.names)
  const names = A.init(props.names)
  if (!lastName) throw new Error("FormLevel: names is required")
  const select = (
    <Form.Select
      options={titleLevelOption}
      label={label}
      name={lastName}
      labelAside={<FormInfo title={label} content={info} />}
      classNames={classNames}
    />
  )
  if (G.isNotNullable(names) && A.isNotEmpty(names)) {
    return <Form.Fields names={names}>{select}</Form.Fields>
  }
  return select
}

/**
 * translations
 */
export const dictionary = {
  fr: {
    "header-title": "En-tête de section",
    "header-description":
      "Ajoutez un titre, sous-titre et description pour introduire et structurer votre contenu",
    "title-label": "Titre",
    "title-placeholder": "Entrez votre titre principal...",
    "title-info":
      "Le titre principal de votre section. Il structure votre contenu et améliore la navigation pour vos visiteurs",
    "subtitle-label": "Sous-titre",
    "subtitle-placeholder": "Ajoutez un sous-titre optionnel...",
    "subtitle-info":
      "Un sous-titre pour apporter du contexte supplémentaire. Idéal pour préciser ou nuancer votre titre principal",
    "description-label": "Description",
    "description-placeholder": "Rédigez une description détaillée...",
    "description-info":
      "Développez votre propos avec une description complète. Vous pouvez utiliser la mise en forme pour structurer votre texte",
    "level-label": "Niveau hiérarchique",
    "level-option": "Titre de niveau {{level}}",
    "level-info":
      "Le niveau hiérarchique structure votre page pour le SEO et l'accessibilité. H1 pour les titres principaux, H2-H6 pour les sous-sections",
  },
  en: {
    "header-title": "Section heading",
    "header-description":
      "Add a title, subtitle and description to introduce and structure your content",
    "title-label": "Title",
    "title-placeholder": "Enter your main title...",
    "title-info":
      "The main title of your section. It structures your content and improves navigation for your visitors",
    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Add an optional subtitle...",
    "subtitle-info":
      "A subtitle to provide additional context. Perfect for clarifying or adding nuance to your main title",
    "description-label": "Description",
    "description-placeholder": "Write a detailed description...",
    "description-info":
      "Expand your content with a complete description. You can use formatting to structure your text",
    "level-label": "Heading level",
    "level-option": "Heading level {{level}}",
    "level-info":
      "The heading level structures your page for SEO and accessibility. H1 for main titles, H2-H6 for subsections",
  },
  de: {
    "header-title": "Abschnittsüberschrift",
    "header-description":
      "Fügen Sie einen Titel, Untertitel und eine Beschreibung hinzu, um Ihren Inhalt einzuführen und zu strukturieren",
    "title-label": "Titel",
    "title-placeholder": "Geben Sie Ihren Haupttitel ein...",
    "title-info":
      "Der Haupttitel Ihres Abschnitts. Er strukturiert Ihren Inhalt und verbessert die Navigation für Ihre Besucher",
    "subtitle-label": "Untertitel",
    "subtitle-placeholder": "Optionalen Untertitel hinzufügen...",
    "subtitle-info":
      "Ein Untertitel für zusätzlichen Kontext. Perfekt, um Ihren Haupttitel zu präzisieren oder zu nuancieren",
    "description-label": "Beschreibung",
    "description-placeholder": "Detaillierte Beschreibung verfassen...",
    "description-info":
      "Erweitern Sie Ihren Inhalt mit einer vollständigen Beschreibung. Sie können Formatierungen verwenden, um Ihren Text zu strukturieren",
    "level-label": "Hierarchieebene",
    "level-option": "Überschrift Ebene {{level}}",
    "level-info":
      "Die Hierarchieebene strukturiert Ihre Seite für SEO und Barrierefreiheit. H1 für Haupttitel, H2-H6 für Unterabschnitte",
  },
} satisfies Translation
