import type { Option } from '@compo/utils'
import { assert, createMakePathTo, G } from '@compo/utils'
import { createApi } from './api'
import { sites } from './sites/index'

type IsomorphicFetch = typeof globalThis.fetch

/**
 * Wrapper to handle Next.js fetch with adnf
 * Next.js 15 overrides global fetch and doesn't auto-parse JSON
 */
const wrapFetch = (originalFetch: any) => {
  return (input: any, init?: any) => {
    return originalFetch(input, init).then(async (response: any) => {
      // If it's a Response object, check for JSON and parse it
      if (response && response.headers && typeof response.headers.get === 'function') {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          try {
            const data = await response.clone().json()
            // Add data property for adnf
            return Object.assign(response, { data })
          } catch {
            // If parsing fails, return as is
          }
        }
      }
      return response
    })
  }
}

/**
 * create a service with the api
 */
type ApiPath = Option<string>

export const createService = (
  fetch: IsomorphicFetch,
  apiPath: ApiPath,
  workspaceId: string,
  resourcePath?: string
) => {
  const rootUrl = normalize(`${assert(apiPath, 'Missing apiPath in @compo/services')}`)
  const apiUrl = normalize(`${rootUrl}sites/${workspaceId}/`)
  // Wrap the fetch to handle Next.js behavior
  const wrappedFetch = wrapFetch(fetch)
  const api = createApi(wrappedFetch, apiUrl)

  const makePath = createMakePathTo(resourcePath || rootUrl)
  const getImageUrl = (
    image: Option<{
      url: string
      previewUrl?: string
      thumbnailUrl?: string
    }>,
    type: 'thumbnail' | 'preview' | 'original' = 'original'
  ) => {
    if (G.isNullable(image)) return null
    if (type === 'original') return makePath(image.url)
    if (type === 'preview') return makePath(image.previewUrl || image.url)
    if (type === 'thumbnail') return makePath(image.thumbnailUrl || image.previewUrl || image.url)
    return makePath(image.url)
  }
  return {
    apiUrl,
    api,
    makePath,
    getImageUrl,
    ...sites(api),
  }
}
const normalize = (base: string) => base.replace(/\/+$/, '') + '/'
