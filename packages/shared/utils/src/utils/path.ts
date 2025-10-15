/*
|--------------------------------------------------------------------------
| path utils
|--------------------------------------------------------------------------
|
| The path utils is used for defining the HTTP routes.
|
*/

import { A, G, Option, S, pipe } from "@mobily/ts-belt"
import { assert } from "./assert"
/**
 * isActivePath
 */
export const isActivePath = (path: string, currentPath: string, exact: boolean) => {
  if (exact) return path === currentPath
  return S.startsWith(currentPath, path)
}

/**
 * isActiveLocalePath
 */
export const isActiveLocalePath = (path: string, currentPath: string, exact: boolean) => {
  if (exact) return path === stripLocalePath(currentPath)
  return S.startsWith(stripLocalePath(currentPath), path)
}

/**
 * stripLocalePath
 */
export const stripLocalePath = (path: string) => {
  if (!path) return `/`
  return "/" + pipe(path, S.split("/"), A.sliceToEnd(2), A.join("/"))
}

/**
 * prependProtocol
 */
export const prependProtocol = (url: string, protocol = "https://"): string => {
  const supportedProtocols = ["http://", "https://", "ftp://", "sftp://"]
  if (!supportedProtocols.some((p) => url.startsWith(p))) {
    return protocol + url
  }
  return url
}

/**
 * hasProtocol
 */
export const hasProtocol = (url: string): boolean => {
  const supportedProtocols = ["http://", "https://", "ftp://", "sftp://"]
  return supportedProtocols.some((p) => url.startsWith(p))
}

/**
 * makePath
 */
export const makePath = (...paths: string[]) => {
  const trimmedPaths = paths.map((path) => path.replace(/^\/|\/$/g, ""))
  return trimmedPaths.join("/")
}

/**
 * createMakePathTo
 */
// Overloads
export type MakePathTo = {
  (path: string, safe: true): string
  (path: Option<string>, safe?: false): string | undefined
}

// Factory
export const createMakePathTo = (baseUrl?: string): MakePathTo => {
  const makePathTo = (path: Option<string>, safe: boolean = false): string | undefined => {
    const url = baseUrl ?? ""
    if (safe) return makePath(assert(url), path as string)
    return G.isNotNullable(path) ? makePath(assert(url), path as string) : undefined
  }
  return makePathTo as MakePathTo
}

/**
 * toSafeFilename
 */
const illegalRe = /[\/\?<>\\:\*\|"]/g
const controlRe = /[\x00-\x1f\x80-\x9f]/g
const reservedRe = /^\.+$/
const windowsReservedRe = /^(con|prn|aux|nul|com\d|lpt\d)$/i
const windowsTrailingRe = /[\. ]+$/
export const toSafeFilename = (input: string, replacement = "_"): string => {
  const base = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsTrailingRe, replacement)

  // évite les noms réservés type "con", "nul", etc.
  if (windowsReservedRe.test(base)) return base + replacement

  return base
}
