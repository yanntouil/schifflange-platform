import { cuid } from '@adonisjs/core/helpers'
import { RouteMatcher } from '@adonisjs/core/types/http'
import { v4 } from 'uuid'

/**
 * Service: SessionService
 * @description this service contains the methods to manage the user sessions
 */
export default class UidService {
  /**
   * generateUid
   * method to generate a uid
   */
  public static generateUid = v4

  /**
   * generateCuid
   * method to generate a cuid
   */
  public static generateCuid = cuid

  /**
   * isCuid
   * method to check if a string is a cuid
   */
  public static isCuid = (id: string, { minLength = 2, maxLength = 32 } = {}) => {
    const length = id.length
    const regex = /^[0-9a-z]+$/

    try {
      if (typeof id === 'string' && length >= minLength && length <= maxLength && regex.test(id))
        return true
    } finally {
    }

    return false
  }

  /**
   * cuidMatcher
   * method to create a cuid matcher for the route
   */
  public static cuidMatcher = (): RouteMatcher => ({
    match: /^[0-9a-z]+$/,
    cast: (value: string) => value,
  })
}
