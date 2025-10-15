import { T } from "@compo/utils"
import { type Api } from "@services/dashboard"

/**
 * isAvailable
 * Check if a publication is available
 */
export const isAvailable = (publication: Api.Publication, now = new Date()) => {
  const validFrom = publication.publishedFrom ? T.parseISO(publication.publishedFrom) : null
  const validUntil = publication.publishedTo ? T.parseISO(publication.publishedTo) : null
  const isAfterFrom = validFrom ? T.isAfter(now, validFrom) : true
  const isBeforeUntil = validUntil ? T.isBefore(now, validUntil) : true
  return isAfterFrom && isBeforeUntil
}

/**
 * willBeAvailable
 * Check if a publication will be available
 */
export const willBeAvailable = (publication: Api.Publication, now = new Date()) => {
  if (!publication.publishedFrom) return false
  return T.isAfter(T.parseISO(publication.publishedFrom), now)
}

/**
 * wasAvailable
 * Check if a publication was available
 */
export const wasAvailable = (publication: Api.Publication, now = new Date()) => {
  if (!publication.publishedTo) return false
  return T.isBefore(T.parseISO(publication.publishedTo), now)
}
