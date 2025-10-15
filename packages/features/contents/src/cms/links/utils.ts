import { A, D, G, O } from "@mobily/ts-belt"
import { Api } from "@services/dashboard"
import { match, P } from "ts-pattern"
import { FormSingleValues, FormValues, LinkItemProps, LinkProps, LinksItemProps, LinkTranslationsProps } from "./types"

/**
 * extract the links from the item
 */
export const extractSlugs = (item: FormValues): string[] => {
  return A.filterMap(D.values(item.props.links), (link) => (link.slugId ? O.Some(link.slugId) : O.None))
}
export const extractSlug = (item: FormSingleValues): string[] => {
  return item.props.link.slugId ? [item.props.link.slugId] : []
}

/**
 * helper functions to create initial link props
 */
export const makeInitialLink = (defaultLink: Partial<LinkProps> = {}): LinkProps => ({
  type: defaultLink.type ?? "resource",
  slugId: defaultLink.slugId ?? "",
  link: defaultLink.link ?? "",
  template: defaultLink.template ?? "link",
})
export const makeInitialLinkTranslation = (
  defaultLink: Partial<LinkTranslationsProps> = {}
): LinkTranslationsProps => ({
  url: defaultLink.url ?? "",
  text: defaultLink.text ?? "",
})

/**
 * prepare cta props for Cta component
 */
export const extractLinksProps = (item: LinksItemProps, lid: string) => {
  return {
    links: A.filterMap(item.props.orderedLinks, (id) => {
      const translation = item.translations.find((t) => t.languageId === lid)
      if (G.isNullable(translation)) return O.None
      const { link } = makeLinkProps(D.get(item.props.links, id), D.get(translation.props.links, id), item.slugs)
      if (G.isNullable(link)) return O.None
      return O.Some({ id, ...link })
    }),
  }
}

/**
 * prepare link props for Link component
 */
export const extractLinkProps = (item: LinkItemProps, lid: string) => {
  const translation = item.translations.find((t) => t.languageId === lid)
  return makeLinkProps(item.props.link, translation?.props.link, item.slugs)
}

/**
 * prepare link props for Link component
 */
export const makeLinkProps = (
  link: Option<LinkProps>,
  translatedLink: Option<LinkTranslationsProps>,
  slugs: Api.Slug[]
) => {
  if (G.isNullable(link) || G.isNullable(translatedLink)) return { link: O.None }
  const slug = A.find(slugs, ({ id }) => id === link.slugId)
  const { isLink, href } = prepareLink({ type: link.type, url: translatedLink.url, link: link.link, slug })
  return { link: O.Some({ ...link, ...translatedLink, slug, isLink, href }) }
}

/**
 * prepare link additional props for Link extractions
 */
const prepareLink = (link: { type: string; url: string; link: string; slug: Option<{ id: string; path: string }> }) =>
  match({ type: link.type, url: link.url, link: link.link, slug: link.slug })
    .with({ type: "url", url: P.string.minLength(1) }, ({ url }) => ({ isLink: false, href: url }))
    .with({ type: "link", link: P.string.minLength(1) }, ({ link }) => ({ isLink: true, href: link }))
    .with({ type: "resource", slug: P.nonNullable }, ({ slug }) => ({ isLink: true, href: slug.path }))
    .otherwise(() => ({ isLink: false, href: null }))
