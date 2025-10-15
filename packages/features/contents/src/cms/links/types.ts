import { Api } from "@services/dashboard"

export type FormValues = {
  props: {
    orderedLinks: string[]
    links: Record<string, LinkProps>
  }
  translations: Record<
    string,
    {
      props: {
        links: Record<string, LinkTranslationsProps>
      }
    }
  >
}
export type FormSingleValues = {
  props: {
    link: LinkProps
  }
  translations: Record<
    string,
    {
      props: {
        link: LinkTranslationsProps
      }
    }
  >
}

export type LinkProps = {
  type: "url" | "link" | "resource"
  slugId: string
  link: string
  template: "link" | "primary" | "secondary" | "highlight"
}

export type LinkTranslationsProps = {
  url: string
  text: string
}

export type LinksItemProps = {
  slugs: Api.Slug[]
  props: {
    orderedLinks: string[]
    links: Record<string, LinkProps>
  }
} & Api.Translatable<{
  languageId: string
  props: {
    links: Record<string, LinkTranslationsProps>
  }
}>
export type LinkItemProps = {
  slugs: Api.Slug[]
  props: {
    link: LinkProps
  }
} & Api.Translatable<{
  languageId: string
  props: {
    link: LinkTranslationsProps
  }
}>
