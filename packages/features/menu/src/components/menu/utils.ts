import { compactFiles } from "@compo/contents"
import { A, D, prependHttp } from "@compo/utils"
import { Api } from "@services/dashboard"

/**
 * makeSubItemValues
 * prepare values for the form
 */
export const makeSubItemValues = (values: Partial<Api.MenuItemWithRelations>, languages: Api.Language[]) => {
  return {
    type: values.type && A.includes(["url", "link", "group", "resource"], values.type) ? values.type : "resource",
    slugId: values?.slug?.id ?? "",
    state: values?.state ?? ("draft" as Api.MenuItemState),
    props: {
      link: values?.props?.link ?? "",
      template: values?.props?.template ?? "template-1",
      image: A.find(values?.files ?? [], ({ id }) => id === values?.props?.image) ?? null,
    },
    translations: D.fromPairs(
      A.map(languages, (language) => {
        const translation: Partial<Api.MenuItemTranslation> =
          A.find(values?.translations ?? [], ({ languageId }) => languageId === language.id) ?? {}
        return [
          language.id,
          {
            name: translation.name ?? "",
            description: translation.description ?? "",
            props: {
              url: (translation.props?.url as string) ?? "",
            },
          },
        ]
      })
    ),
  }
}

/**
 * getSubItemPayload
 * prepare payload for the payload
 */
export const getSubItemPayload = (values: ReturnType<typeof makeSubItemValues>) => {
  const type = A.includes(["url", "link", "group", "resource"], values.type) ? values.type : "group"
  return {
    state: values.state,
    type,
    slugId: type === "resource" && values?.slugId ? values?.slugId : null,
    props: {
      ...values.props,
      image: values.props.image?.id ?? null,
    },
    translations: D.map(values.translations, (t) => ({
      ...t,
      props: { ...t.props, url: t.props.url ? prependHttp(t.props.url) : "" },
    })),
    files: compactFiles(values.props.image),
  }
}

/**
 * makeItemValues
 * prepare values for the form
 */
export const makeItemValues = (values: Partial<Api.MenuItemWithRelations>, languages: Api.Language[]) => {
  return {
    type: values.type && A.includes(["url", "link", "group", "resource"], values.type) ? values.type : "group",
    slugId: values?.slug?.id ?? "",
    state: values?.state ?? ("draft" as Api.MenuItemState),
    props: {
      link: values?.props?.link ?? "",
      template: values?.props?.template ?? "template-1",
    },
    translations: D.fromPairs(
      A.map(languages, (language) => {
        const translation: Partial<Api.MenuItemTranslation> =
          A.find(values?.translations ?? [], ({ languageId }) => languageId === language.id) ?? {}
        return [
          language.id,
          {
            name: translation.name ?? "",
            description: translation.description ?? "",
            props: {
              url: (translation.props?.url as string) ?? "",
            },
          },
        ]
      })
    ),
  }
}

/**
 * getItemPayload
 * prepare payload for the payload
 */
export const getItemPayload = (values: ReturnType<typeof makeItemValues>) => {
  const type = A.includes(["url", "link", "group", "resource"], values.type) ? values.type : "group"
  return {
    state: values.state,
    type,
    slugId: type === "resource" && values?.slugId ? values?.slugId : null,
    props: values.props,
    translations: D.map(values.translations, (t) => ({
      ...t,
      props: { ...t.props, url: t.props.url ? prependHttp(t.props.url) : "" },
    })),
    files: [],
  }
}
