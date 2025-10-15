import { Cms, CreateItemForm, FormUpdate, type InferItem } from "@compo/contents"
import { Form, FormReorderableList, FormReorderableListProps, useForm, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Primitives } from "@compo/primitives"
import { FormTranslatableTabs, useFormTranslatableContext } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, O, placeholder, prependHttp, v4 } from "@compo/utils"
import { Ellipsis } from "lucide-react"
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
            breadcrumbsOrdered: props.breadcrumbsOrdered,
            breadcrumbs: props.breadcrumbs,
          },
          translations: D.map(translations, (translation) => ({
            ...translation,
            props: {
              ...translation.props,
              breadcrumbs: D.map(translation.props.breadcrumbs, (breadcrumb) => ({
                ...breadcrumb,
                link: {
                  ...breadcrumb.link,
                  url: prependHttp(breadcrumb.link.url),
                },
              })),
            },
          })),
          slugs: [
            ...A.filterMap(D.values(props.breadcrumbs), ({ link }) => (link.slugId ? O.Some(link.slugId) : O.None)),
          ],
          files: [],
        }
        await onSubmit(payload)
      },
    })

    return (
      <Form.Root form={form}>
        <FormTranslatableTabs classNames={{ root: "flex flex-col gap-6" }}>
          <FormBreadcrumbs />
          <FormUpdate />
        </FormTranslatableTabs>
      </Form.Root>
    )
  }
/**
 * makeValues
 * make the initial values for the form
 */
const makeValues = (item: InferItem<typeof contentItem>) => ({
  breadcrumbsOpen: undefined as string | undefined,
  props: {
    breadcrumbsOrdered: item.props.breadcrumbsOrdered,
    breadcrumbs: item.props.breadcrumbs,
  },
  translations: D.fromPairs(A.map(item.translations, ({ languageId, ...rest }) => [languageId, rest])),
})
type FormValues = ReturnType<typeof makeValues>

/**
 * FormBreadcrumbs
 * display the form to create/edit the breadcrumbs
 */
const FormBreadcrumbs: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { values, setValues } = useFormContext<FormValues>()
  const { current } = useFormTranslatableContext()
  const create: FormReorderableListProps["create"] = () => {
    const id = v4()
    setValues({
      ...values,
      props: {
        ...values.props,
        breadcrumbsOrdered: [...values.props.breadcrumbsOrdered, id],
        breadcrumbs: {
          ...values.props.breadcrumbs,
          [id]: initialBreadcrumb,
        },
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          breadcrumbs: {
            ...translation.props.breadcrumbs,
            [id]: initialBreadcrumbTranslations,
          },
        },
      })),
    })
    return id
  }
  const duplicate: FormReorderableListProps["duplicate"] = ({ id }) => {
    const newId = v4()
    const breadcrumb = values.props.breadcrumbs[id]
    if (!breadcrumb) return
    setValues({
      ...values,
      props: {
        ...values.props,
        breadcrumbsOrdered: [...values.props.breadcrumbsOrdered, newId],
        breadcrumbs: {
          ...values.props.breadcrumbs,
          [newId]: breadcrumb,
        },
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          breadcrumbs: {
            ...translation.props.breadcrumbs,
            [newId]: translation.props.breadcrumbs[id] ?? initialBreadcrumbTranslations,
          },
        },
      })),
    })
  }
  const reorder: FormReorderableListProps["reorder"] = (from, to) => {
    setValues({
      ...values,
      props: {
        ...values.props,
        breadcrumbsOrdered: Primitives.DndKitSortable.arrayMove(values.props.breadcrumbsOrdered, from, to),
      },
    })
  }
  const remove: FormReorderableListProps["remove"] = ({ id }) => {
    setValues({
      ...values,
      props: {
        ...values.props,
        breadcrumbsOrdered: A.reject(values.props.breadcrumbsOrdered, (breadcrumb) => breadcrumb === id),
        breadcrumbs: D.deleteKey(values.props.breadcrumbs, id),
      },
      translations: D.map(values.translations, (translation) => ({
        ...translation,
        props: {
          ...translation.props,
          breadcrumbs: D.deleteKey(translation.props.breadcrumbs, id),
        },
      })),
    })
  }

  return (
    <div className='space-y-4'>
      <Form.Header title={_("cards.header-title")} description={_("cards.header-description")} />
      <FormReorderableList
        items={values.props.breadcrumbsOrdered}
        {...{ create, duplicate, reorder, remove }}
        value={values.breadcrumbsOpen}
        onValueChange={(breadcrumbsOpen) => setValues({ breadcrumbsOpen })}
        title={({ id }) => {
          const { link } = values.translations[current.id]?.props.breadcrumbs[id]
          return (
            <>
              <Ui.Image className='size-4 rounded-md border'>
                <Ellipsis className='size-2' />
              </Ui.Image>
              {placeholder(link.text, _("breadcrumbs.title"))}
            </>
          )
        }}
        t={_.prefixed("breadcrumbs")}
      >
        {({ id, index }) => <FormBreadcrumb id={id} index={index} key={id} />}
      </FormReorderableList>
    </div>
  )
}

/**
 * FormBreadcrumb
 * display the form to create/edit the breadcrumb
 */
const FormBreadcrumb: React.FC<{ id: string; index: number }> = ({ id, index }) => {
  const { _ } = useTranslation(dictionary)
  const { values, setValues } = useFormContext<FormValues>()
  return (
    <div className='space-y-4'>
      <Cms.Links.FormSingle pathNames={["props", "breadcrumbs", id, "link"]} asLink />
    </div>
  )
}

/**
 * initialBreadcrumbs
 */
const initialBreadcrumb: FormValues["props"]["breadcrumbs"][string] = {
  link: Cms.Links.makeInitialLink(),
}
const initialBreadcrumbTranslations: FormValues["translations"][string]["props"]["breadcrumbs"][string] = {
  link: Cms.Links.makeInitialLinkTranslation(),
}

/**
 * translations
 */
const dictionary = {
  fr: {
    // Content
    breadcrumbs: {
      "header-title": "Fil d'Ariane",
      "header-description":
        "Le fil d'Ariane est un ensemble de liens qui permettent de naviguer entre les pages d'un site web",
      title: "Titre du lien",
      create: "Créer un nouveau lien",
      duplicate: "Dupliquer le lien",
      remove: "Retirer le lien",
    },
  },
  en: {},
  de: {},
}
