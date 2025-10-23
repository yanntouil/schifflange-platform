import { A, D, match } from "@compo/utils"
import acceptLanguage from "accept-language"
import { NextURL } from "next/dist/server/web/next-url"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { config as localizeConfig } from "./config"
import { service } from "./service"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|preview|favicon.ico|sw.js|site.webmanifest|robots.txt).*)"],
}

export const middleware = async ({ nextUrl, cookies, headers, url }: NextRequest) => {
  const [defaultLanguage, languages] = await getLanguages()
  const { cookieName, disableLanguage } = localizeConfig
  acceptLanguage.languages(languages)

  const pathName = nextUrl.pathname

  // ignore some paths (maybe move this to config matcher)
  if (ignorePath(pathName)) return NextResponse.next()

  let lng: string | undefined

  // time to validate other languages
  if (!disableLanguage) {
    // check for language cookie
    const cookieValue = cookies.get(cookieName)?.value
    if (cookieValue) {
      lng = acceptLanguage.get(cookieValue) ?? undefined
    }

    // check accept-language header if no valid language from cookie
    if (!lng) {
      const acceptLangHeader = headers.get("Accept-Language")
      lng = acceptLanguage.get(acceptLangHeader) ?? undefined
    }

    // use fallback language if no valid language found
    if (!lng) {
      lng = defaultLanguage
    }

    // redirect if language in path is not supported
    if (!languages.some((loc) => pathName.startsWith(`/${loc}`)) && !pathName.startsWith("/_next")) {
      return redirectWithLang(pathName, url, nextUrl, lng)
    }

    // set language cookie if referer contains supported language
    const response = NextResponse.next()
    if (headers.has("referer")) {
      const refererUrl = new URL(headers.get("referer") ?? "")
      const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
      if (lngInReferer) {
        response.cookies.set(cookieName, lngInReferer)
      }
    }
    // Add detected language to headers for not-found page
    response.headers.set("x-detected-language", lng)
    return response
  }

  // use default language when languages are disabled
  lng = defaultLanguage
  // redirect if language in path is not supported
  if (![lng].some((loc) => pathName.startsWith(`/${loc}`)) && !pathName.startsWith("/_next")) {
    return redirectWithLang(pathName, url, nextUrl, lng)
  }

  // set language cookie if referer contains supported language
  const response = NextResponse.next()
  if (headers.has("referer")) {
    const refererUrl = new URL(headers.get("referer") ?? "")
    const lngInReferer = [lng].find((l) => refererUrl.pathname.startsWith(`/${l}`))
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer)
    }
  }
  // Add detected language to headers for not-found page
  response.headers.set("x-detected-language", lng)
  return response
}

/**
 * helpers
 */
const ignorePath = (path: string): boolean => {
  if (typeof path !== "string") return false
  // regex to match typical file paths with extensions
  const filePathRegex = /[\/\\]?[^\/\\]+\.[a-zA-Z0-9]+$/
  if (filePathRegex.test(path)) return true
  if (path.startsWith("/_next")) return true
  if (path.startsWith("/api")) return true
  return false
}

const makeRedirectUrl = (pathName: string, url: string, nextUrl: NextURL, lng: string) => {
  const redirectUrl = new URL(`/${lng}${pathName}`, url)
  if (nextUrl.search) {
    redirectUrl.search = nextUrl.search
  }
  return redirectUrl
}
const redirectWithLang = (pathName: string, baseUrl: string, nextUrl: NextURL, lng: string) => {
  const redirectUrl = makeRedirectUrl(pathName, baseUrl, nextUrl, lng)
  return NextResponse.redirect(redirectUrl)
}

const getLanguages = async (): Promise<readonly [string, string[]]> => {
  return match(await service.languages())
    .with({ ok: true }, ({ data }) => {
      const codes = A.map(data.languages, D.prop("code"))
      const defaultCode = A.find(data.languages, D.prop("default"))?.code || (A.head(codes) as string)
      return [defaultCode, codes] as const
    })
    .otherwise(() => [localizeConfig.defaultLanguage, localizeConfig.languages] as const)
}
