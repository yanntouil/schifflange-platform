import { A, G, match, O, P, type Option } from '@compo/utils'
import { Api } from '@services/site'

export type LinkProps = {
  type: 'url' | 'link' | 'resource'
  slugId: string
  link: string
  template: 'link' | 'primary' | 'secondary' | 'highlight'
}
export type LinkTranslationsProps = {
  url: string
  text: string
}
export type LinksItemProps = {
  slugs: (Api.Slug & Api.SlugResource)[]
  props: {
    orderedLinks: string[]
    links: Record<string, LinkProps>
  }
  translations: {
    props: {
      links: Record<string, LinkTranslationsProps>
    }
  }
}
export type LinkItemProps = {
  slugs: (Api.Slug & Api.SlugResource)[]
  props: {
    link: LinkProps
  }
  translations: {
    props: {
      link: LinkTranslationsProps
    }
  }
}

/**
 * prepare link props for Link component
 */
export const extractLinkProps = (item: LinkItemProps) => {
  return makeLinkProps(item.props.link, item.translations.props.link, item.slugs)
}

/**
 * prepare link props for Link component
 */
export const makeLinkFromSlug = (slug: Api.Slug) => {
  return slug.path
}

/**
 * prepare link props for Link component
 */
export const makeLinkProps = (
  link: Option<LinkProps>,
  translatedLink: Option<LinkTranslationsProps>,
  slugs: Api.Slug[]
) => {
  if (G.isNullable(link) || G.isNullable(translatedLink)) return O.None
  const slug = A.find(slugs, ({ id }) => id === link.slugId)
  const { isLink, href } = prepareLink({
    type: link.type,
    url: translatedLink.url,
    link: link.link,
    slug,
  })
  return O.Some({ ...link, ...translatedLink, slug, isLink, href })
}

/**
 * prepare link additional props for Link extractions
 */
const prepareLink = (link: {
  type: string
  url: string
  link: string
  slug: Option<{ id: string; path: string }>
}) =>
  match({ type: link.type, url: link.url, link: link.link, slug: link.slug })
    .with({ type: 'url', url: P.string.minLength(1) }, ({ url }) => ({ isLink: false, href: url }))
    .with({ type: 'link', link: P.string.minLength(1) }, ({ link }) => ({
      isLink: true,
      href: link,
    }))
    .with({ type: 'resource', slug: P.nonNullable }, ({ slug }) => ({
      isLink: true,
      href: slug.path,
    }))
    .otherwise(() => ({ isLink: false, href: null }))

/**
 * Types
 */

export type MadeLinkProps = NonNullable<ReturnType<typeof makeLinkProps>>
