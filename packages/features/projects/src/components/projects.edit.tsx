import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useProjectsService, useProjectsStateOptions } from ".."
import { useCategoryOptions, useTagOptionsByType } from "../hooks"

/**
 * ProjectsEditDialog
 */
export const ProjectsEditDialog: React.FC<Ui.QuickDialogProps<Api.ProjectWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.ProjectWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const servicePage = service.id(item.id)

  const initialValues = {
    location: item.location,
    state: item.state,
    categoryId: item.categoryId || "none",
    tagId: item.tagId || "none",
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        categoryId: values.categoryId === "none" ? null : values.categoryId,
        tagId: values.tagId === "none" ? null : values.tagId,
      }
      return match(await servicePage.update(payload))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { project } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(project)
          close()
        })
    },
  })

  const stateOptions = useProjectsStateOptions()
  const [categoryOptions] = useCategoryOptions(true)
  const [tagOptionsByType, noneOption] = useTagOptionsByType(true)

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <Form.Select
        label={_("state-label")}
        name='state'
        options={stateOptions}
        labelAside={<Form.Info title={_("state-label")} content={_("state-info")} />}
      />
      <Form.Input
        label={_("location-label")}
        name='location'
        labelAside={<Form.Info title={_("location-label")} content={_("location-info")} />}
      />
      <Form.Select
        label={_("category-label")}
        name='categoryId'
        options={categoryOptions}
        labelAside={<Form.Info title={_("category-label")} content={_("category-info")} />}
      />
      <Form.Select
        label={_("tag-label")}
        name='tagId'
        // options={tagOptions}
        labelAside={<Form.Info title={_("tag-label")} content={_("tag-info")} />}
      >
        <Ui.Select.Item {...noneOption}>{noneOption.label}</Ui.Select.Item>
        {A.map(D.toPairs(tagOptionsByType), ([type, options]) => (
          <Ui.Select.Group key={type}>
            <Ui.Select.Label>{_(`tag-type-${type}`)}</Ui.Select.Label>
            {A.map(options, (option) => (
              <Ui.Select.Item key={option.value} {...option}>
                {option.label}
              </Ui.Select.Item>
            ))}
          </Ui.Select.Group>
        ))}
      </Form.Select>
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Edit project settings",
    description: "Configure how your project appears and where it's displayed on your website.",
    "state-label": "Visibility",
    "state-draft": "Draft",
    "state-draft-description": "Hidden from public view",
    "state-published": "Published",
    "state-published-description": "Visible to everyone on your site",
    "state-info": "Choose who can see this project. Draft projects are only visible to you and your team members while you work on them. Published projects are visible to all website visitors.",
    "location-label": "Location",
    "location-info": "Enter the geographic location where this project takes place. This helps visitors understand where your project is situated (e.g., 'Paris, France' or 'New York, USA').",
    "category-label": "Project category",
    "category-info": "Categories are the main way to organize your projects. Choose the category that best describes what type of project this is. This helps visitors browse and find similar projects on your website.",
    "tag-label": "Project tag",
    "tag-info": "Tags provide additional context about your project's specific focus or area. Select the tag that best describes the project's main theme or target area. This helps visitors find projects with similar characteristics.",
    "tag-type-non-formal-education": "Non-formal education",
    "tag-type-child-family-services": "Child and family services",
    submit: "Save changes",
    updated: "Your project settings have been saved successfully",
    failed: "We couldn't save your changes. Please try again.",
    validation: "Please check your entries. Some information needs to be corrected before we can save.",
  },
  fr: {
    title: "Modifier les paramètres du projet",
    description: "Configurez comment votre projet apparaît et où il est affiché sur votre site web.",
    "state-label": "Visibilité",
    "state-draft": "Brouillon",
    "state-draft-description": "Caché de la vue publique",
    "state-published": "Publié",
    "state-published-description": "Visible par tous sur votre site",
    "state-info": "Choisissez qui peut voir ce projet. Les projets en brouillon ne sont visibles que par vous et votre équipe pendant que vous y travaillez. Les projets publiés sont visibles par tous les visiteurs du site.",
    "location-label": "Lieu",
    "location-info": "Indiquez le lieu géographique où ce projet se déroule. Cela aide les visiteurs à comprendre où votre projet est situé (ex: 'Paris, France' ou 'Bruxelles, Belgique').",
    "category-label": "Catégorie du projet",
    "category-info": "Les catégories sont le principal moyen d'organiser vos projets. Choisissez la catégorie qui décrit le mieux le type de projet. Cela aide les visiteurs à parcourir et trouver des projets similaires sur votre site.",
    "tag-label": "Étiquette du projet",
    "tag-info": "Les étiquettes fournissent un contexte supplémentaire sur le domaine ou l'objectif spécifique de votre projet. Sélectionnez l'étiquette qui décrit le mieux le thème principal ou le domaine cible du projet. Cela aide les visiteurs à trouver des projets ayant des caractéristiques similaires.",
    "tag-type-non-formal-education": "Éducation non formelle",
    "tag-type-child-family-services": "Services pour enfants et familles",
    submit: "Enregistrer les modifications",
    updated: "Les paramètres de votre projet ont été enregistrés avec succès",
    failed: "Nous n'avons pas pu enregistrer vos modifications. Veuillez réessayer.",
    validation: "Veuillez vérifier vos entrées. Certaines informations doivent être corrigées avant l'enregistrement.",
  },
  de: {
    title: "Projekteinstellungen bearbeiten",
    description: "Konfigurieren Sie, wie Ihr Projekt erscheint und wo es auf Ihrer Website angezeigt wird.",
    "state-label": "Sichtbarkeit",
    "state-draft": "Entwurf",
    "state-draft-description": "Vor der Öffentlichkeit verborgen",
    "state-published": "Veröffentlicht",
    "state-published-description": "Für alle auf Ihrer Website sichtbar",
    "state-info": "Wählen Sie, wer dieses Projekt sehen kann. Entwurfsprojekte sind nur für Sie und Ihr Team sichtbar, während Sie daran arbeiten. Veröffentlichte Projekte sind für alle Website-Besucher sichtbar.",
    "location-label": "Standort",
    "location-info": "Geben Sie den geografischen Standort ein, an dem dieses Projekt stattfindet. Dies hilft Besuchern zu verstehen, wo Ihr Projekt angesiedelt ist (z.B. 'Berlin, Deutschland' oder 'Wien, Österreich').",
    "category-label": "Projektkategorie",
    "category-info": "Kategorien sind die Hauptmethode zur Organisation Ihrer Projekte. Wählen Sie die Kategorie, die am besten beschreibt, um welche Art von Projekt es sich handelt. Dies hilft Besuchern, ähnliche Projekte auf Ihrer Website zu durchsuchen und zu finden.",
    "tag-label": "Projekt-Tag",
    "tag-info": "Tags bieten zusätzlichen Kontext über den spezifischen Fokus oder Bereich Ihres Projekts. Wählen Sie das Tag, das das Hauptthema oder den Zielbereich des Projekts am besten beschreibt. Dies hilft Besuchern, Projekte mit ähnlichen Merkmalen zu finden.",
    "tag-type-non-formal-education": "Nicht-formale Bildung",
    "tag-type-child-family-services": "Kinder- und Familienleistungen",
    submit: "Änderungen speichern",
    updated: "Ihre Projekteinstellungen wurden erfolgreich gespeichert",
    failed: "Wir konnten Ihre Änderungen nicht speichern. Bitte versuchen Sie es erneut.",
    validation: "Bitte überprüfen Sie Ihre Eingaben. Einige Informationen müssen korrigiert werden, bevor wir speichern können.",
  },
}
