import { Cms, CreateItemForm, FormUpdate, type InferItem } from "@compo/contents"
import { Form, useForm, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableContent, FormTranslatableTabs } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, O, prependHttp } from "@compo/utils"
import React from "react"
import { contentItem } from "./export"

export const createForm: CreateItemForm<typeof contentItem> =
  ({ templates, proses }) =>
  ({ item, onSubmit }) => {
    const { _ } = useTranslation(dictionary)
    const form = useForm({
      allowSubmitAttempt: true,
      values: makeValues(item),
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const payload = {
          props: {
            level: props.level,
            displayHeading: props.displayHeading,
            cards: D.map(props.cards, (card) => ({
              ...card,
            })),
          },
          translations: D.map(translations, (translation) => ({
            ...translation,
            props: {
              ...translation.props,
              cards: D.map(translation.props.cards, (card) => ({
                ...card,
                link: {
                  ...card.link,
                  url: prependHttp(card.link.url),
                },
              })),
            },
          })),
          slugs: [...A.filterMap(D.values(props.cards), ({ link }) => (link.slugId ? O.Some(link.slugId) : O.None))],
          files: [],
        }
        await onSubmit(payload)
      },
    })

    return (
      <Form.Root form={form}>
        <FormTranslatableTabs classNames={{ root: "flex flex-col gap-6" }}>
          <Cms.Headings.FormHeadingOptional prose={proses?.description} />
          <div className='space-y-4'>
            <Form.Header title={_("cards.header-title")} description={_("cards.header-description")} />
            <div className='grid gap-4'>
              <FormProcessCard id='consultation' prose={proses.cardDescription} />
              <FormProcessCard id='incubation' prose={proses.cardDescription} />
              <FormProcessCard id='scaling' prose={proses.cardDescription} />
            </div>
          </div>
          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }

/**
 * makeValues
 */
const makeValues = (item: InferItem<typeof contentItem>) => ({
  cardOpen: undefined,
  props: {
    level: item.props.level,
    displayHeading: item.props.displayHeading,
    cards: D.map(item.props.cards, (card) => ({
      ...card,
    })),
  },
  translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
})
type FormValues = ReturnType<typeof makeValues>

/**
 * FormProcessCard
 */
const FormProcessCard: React.FC<{ id: keyof FormValues["props"]["cards"]; prose: string }> = ({ id, prose }) => {
  const { _ } = useTranslation(dictionary)
  const { values } = useFormContext<FormValues>()
  const display = values.props.cards[id].display
  return (
    <Ui.Collapsible.Root asChild open={display}>
      <Ui.Card.Root>
        <div className='flex justify-between items-center p-4 pt-2'>
          <Form.Header title={_(`card.title-${id}`)} />
          <Form.Fields names={["props", "cards", id]}>
            <Form.SimpleSwitch name='display' size='sm' classNames={{ switch: "mt-3" }} />
          </Form.Fields>
        </div>
        <Ui.Collapsible.Content className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
          <div className='p-4'>
            <Form.Fields name='translations'>
              <FormTranslatableContent className='space-y-4'>
                {({ code }) => (
                  <Form.Fields names={["props", "cards", id]}>
                    <Form.Input
                      name='title'
                      label={_("card.title-label")}
                      placeholder={_("card.title-placeholder")}
                      lang={code}
                      labelAside={<Form.Localized title={_("card.title-label")} content={_("card.title-info")} />}
                    />
                    <Form.TextEditor
                      name='description'
                      label={_("card.description-label")}
                      placeholder={_("card.description-placeholder")}
                      lang={code}
                      prose={prose}
                      labelAside={
                        <Form.Localized title={_("card.description-label")} content={_("card.description-info")} />
                      }
                    />
                  </Form.Fields>
                )}
              </FormTranslatableContent>
            </Form.Fields>
            <Cms.Links.FormSingle pathNames={["props", "cards", id, "link"]} asLink />
          </div>
        </Ui.Collapsible.Content>
      </Ui.Card.Root>
    </Ui.Collapsible.Root>
  )
}

const dictionary = {
  fr: {
    cards: {
      "header-title": "Étapes du processus",
      "header-description": "Définissez les différentes étapes de votre processus pour guider vos visiteurs",
    },
    card: {
      "title-consultation": "Étape de consultation",
      "title-incubation": "Étape d'incubation",
      "title-scaling": "Étape de multiplication",
      "title-label": "Titre de l'étape",
      "title-placeholder": "Entrez le titre de cette étape...",
      "title-info": "Le titre de cette étape du processus. Soyez clair et concis pour que vos visiteurs comprennent rapidement",
      "description-label": "Description de l'étape",
      "description-placeholder": "Décrivez cette étape en détail...",
      "description-info": "Expliquez en détail ce qui se passe à cette étape du processus. Décrivez les actions, les objectifs et les résultats attendus",
    },
  },
  en: {
    cards: {
      "header-title": "Process steps",
      "header-description": "Define the different steps of your process to guide your visitors",
    },
    card: {
      "title-consultation": "Consultation step",
      "title-incubation": "Incubation step",
      "title-scaling": "Scaling step",
      "title-label": "Step title",
      "title-placeholder": "Enter the title for this step...",
      "title-info": "The title of this process step. Be clear and concise so your visitors quickly understand",
      "description-label": "Step description",
      "description-placeholder": "Describe this step in detail...",
      "description-info": "Explain in detail what happens at this step of the process. Describe the actions, objectives and expected results",
    },
  },
  de: {
    cards: {
      "header-title": "Prozessschritte",
      "header-description": "Definieren Sie die verschiedenen Schritte Ihres Prozesses, um Ihre Besucher zu führen",
    },
    card: {
      "title-consultation": "Beratungsschritt",
      "title-incubation": "Inkubationsschritt",
      "title-scaling": "Skalierungsschritt",
      "title-label": "Schritt-Titel",
      "title-placeholder": "Titel für diesen Schritt eingeben...",
      "title-info": "Der Titel dieses Prozessschritts. Seien Sie klar und prägnant, damit Ihre Besucher schnell verstehen",
      "description-label": "Schrittbeschreibung",
      "description-placeholder": "Diesen Schritt detailliert beschreiben...",
      "description-info": "Erklären Sie detailliert, was in diesem Schritt des Prozesses passiert. Beschreiben Sie die Aktionen, Ziele und erwarteten Ergebnisse",
    },
  },
}
