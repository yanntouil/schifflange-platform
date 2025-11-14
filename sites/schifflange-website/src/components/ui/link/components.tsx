"use client"

import { matchLanguage } from "@/app/utils"
import { config } from "@/config"
import { Api } from "@/service"
import { LocalizeLanguage } from "@compo/localize"
import { A, match } from "@compo/utils"
import NextLink from "next/link"
import { useParams, usePathname } from "next/navigation"
import React from "react"

export type LinkProps = React.ComponentProps<typeof NextLink> & {
  lang?: string
  skipLangPrefix?: boolean
  strict?: boolean
}
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, lang, skipLangPrefix = false, strict = false, ...props }: LinkProps, ref) => {
    const params = useParams<{ slug: string[]; lang: string }>()
    const pathname = usePathname()
    const fromSlug = params.slug ? A.head(params.slug) : undefined
    const fromLang = params.lang ? params.lang : undefined
    const langParams = matchLanguage(fromSlug ?? fromLang ?? "") as LocalizeLanguage

    const prefixedHref = React.useMemo(() => {
      // Skip prefixing for external URLs or if explicitly disabled
      if (skipLangPrefix || typeof href !== "string" || href.startsWith("http") || href.startsWith("//")) {
        return href
      }

      // Use provided lang or current language
      const langPrefix = lang || langParams

      // Build dynamic pattern from available languages
      const langList = config.languages.join("|")
      const langPattern = new RegExp(`^/?(${langList})/`)

      // If href already starts with a language prefix, replace it
      if (langPattern.test(href)) {
        return href.replace(langPattern, `/${langPrefix}/`)
      }

      // Add language prefix
      const cleanHref = href.startsWith("/") ? href : `/${href}`
      return `/${langPrefix}${cleanHref}`
    }, [href, lang, langParams, skipLangPrefix])

    const prefixWithoutLang = React.useMemo(() => {
      const langPattern = new RegExp(`^/?(${config.languages.join("|")})/`)
      return prefixedHref.toString().replace(langPattern, "")
    }, [prefixedHref])

    // Calculate isCurrent and isActive
    const isCurrent = React.useMemo(() => {
      if (typeof prefixedHref !== "string") return false
      // Remove trailing slashes for comparison
      const cleanPath = pathname.replace(/\/$/, "")
      const cleanHref = prefixedHref.replace(/\/$/, "")
      return cleanPath === cleanHref
    }, [pathname, prefixedHref])

    const isActive = React.useMemo(() => {
      if (typeof prefixedHref !== "string") return false
      // Check if current path starts with the link href
      // but not if it's the home page "/"
      const cleanHref = prefixedHref.replace(/\/$/, "")
      return prefixWithoutLang !== "" && pathname.startsWith(cleanHref)
    }, [pathname, prefixedHref])

    return (
      <NextLink
        href={prefixedHref}
        data-current={isCurrent}
        data-active={strict ? isActive : isCurrent || isActive}
        ref={ref}
        {...props}
      />
    )
  }
)

/**
 * LinkTo
 * a link to a resource, link or url
 */
type LinkToLink = {
  type: "link"
  props: { link: string }
}
type LinkToResource = {
  type: "resource"
  slug: Api.Slug
}
type LinkToUrl = {
  type: "url"
  translations: { props: { url: string } }
}
type LinkToProps = {
  link: LinkToLink | LinkToResource | LinkToUrl
  className?: string
  children: React.ReactNode
}
export const LinkTo = ({ link, className, children }: LinkToProps) => {
  return match(link)
    .with({ type: "resource" }, (link) => (
      <Link href={link.slug.path} passHref>
        <a className={className}>{children}</a>
      </Link>
    ))
    .with({ type: "link" }, (link) => (
      <Link href={link.props.link} legacyBehavior passHref>
        <a className={className}>{children}</a>
      </Link>
    ))
    .with({ type: "url" }, (link) => (
      <a href={link.translations.props.url} className={className} target='_blank' rel='noopener noreferrer nofollow'>
        {children}
      </a>
    ))
    .otherwise(() => null)
}
