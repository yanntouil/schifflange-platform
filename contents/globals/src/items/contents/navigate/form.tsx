import { Cms, CreateItemForm, FormUpdate } from "@compo/contents"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, prependHttp, S } from "@compo/utils"
import { contentItem } from "./export"

export const createForm: CreateItemForm<typeof contentItem> =
  ({ templates, proses }) =>
  ({ item, onSubmit }) => {
    const { _ } = useTranslation(dictionary)
    const form = useForm({
      allowSubmitAttempt: true,
      values: {
        props: {
          previous: item.props.previous,
          next: item.props.next,
        },
        translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
      },
      onSubmit: async ({ values }) => {
        const { props, translations } = values
        const payload = {
          props: {
            previous: props.previous,
            next: props.next,
          },
          translations: D.map(translations, ({ props }) => ({
            props: D.map(props, (value) => {
              return {
                ...value,
                link: {
                  ...value.link,
                  url: prependHttp(value.link.url),
                },
              }
            }),
          })),
          slugs: A.filter([props.previous.link.slugId, props.next.link.slugId], S.isNotEmpty),
          files: [],
        }
        await onSubmit(payload)
      },
    })

    const displayPrevious = form.values.props.previous.display
    const displayNext = form.values.props.next.display
    return (
      <Form.Root form={form}>
        <FormTranslatableTabs classNames={{ root: "flex flex-col gap-6" }}>
          <Ui.Collapsible.Root asChild open={displayPrevious}>
            <Ui.Card.Root>
              <div className='flex justify-between items-center p-4 pt-2'>
                <Form.Header title={_(`previous.title`)} />
                <Form.Fields names={["props", "previous"]}>
                  <Form.SimpleSwitch name='display' size='sm' classNames={{ switch: "mt-3" }} />
                </Form.Fields>
              </div>
              <Ui.Collapsible.Content className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                <div className='p-4'>
                  <Cms.Links.FormSingle pathNames={["props", "previous", "link"]} asLink />
                </div>
              </Ui.Collapsible.Content>
            </Ui.Card.Root>
          </Ui.Collapsible.Root>
          <Ui.Collapsible.Root asChild open={displayNext}>
            <Ui.Card.Root>
              <div className='flex justify-between items-center p-4 pt-2'>
                <Form.Header title={_(`next.title`)} />
                <Form.Fields names={["props", "next"]}>
                  <Form.SimpleSwitch name='display' size='sm' classNames={{ switch: "mt-3" }} />
                </Form.Fields>
              </div>
              <Ui.Collapsible.Content className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                <div className='p-4'>
                  <Cms.Links.FormSingle pathNames={["props", "next", "link"]} asLink />
                </div>
              </Ui.Collapsible.Content>
            </Ui.Card.Root>
          </Ui.Collapsible.Root>
          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }

/**
 * translations
 */
const dictionary = {
  fr: {
    // Content
    previous: {
      title: "Lien précédent",
    },
    next: {
      title: "Lien suivant",
    },
  },
  en: {
    // Content
    previous: {
      title: "Previous link",
    },
    next: {
      title: "Next link",
    },
  },
  de: {
    // Content
    previous: {
      title: "Vorheriger Link",
    },
    next: {
      title: "Nächster Link",
    },
  },
}
