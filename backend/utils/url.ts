import { A, G, S } from '@mobily/ts-belt'

/**
 * makeUrl
 */
export const makeUrl = (baseUrl: string, ...paths: string[]) => {
  const trimmedBaseUrl = baseUrl.replace(/\/$/, '')
  const trimmedPaths = paths.map((path) => path.replace(/^\/|\/$/g, ''))
  return [trimmedBaseUrl, ...trimmedPaths].join('/')
}

/**
 * fileNameFromUrl
 */
export const fileNameFromUrl = (url: string) => {
  return A.last(S.split(url, '/')) ?? ''
}

/**
 * extensionFromUrl
 */
export const extensionFromUrl = (url: string) => {
  const fileName = A.last(S.split(url, '/'))
  if (G.isNullable(fileName)) return ''
  const extension = A.last(S.split(fileName, '.'))
  return extension ?? ''
}

/**
 * Prepend http to the url if it doesn't have it
 */
export const prependHttp = (url: string) => {
  return url.match(/^(https?:\/\/)/) ? url : `https://${url}`
}

/**
 * Check if the url is valid
 */
export const isUrlValid = (url: string) => {
  try {
    // Attempt to create a new URL object
    const parsedUrl = new URL(prependHttp(url))
    // Regex to ensure the domain has at least one '.' for a TLD
    return /\.[a-z]{2,}$/.test(parsedUrl.hostname)
  } catch (e) {
    // Catch any errors that occur if the URL is invalid
    return false
  }
}
