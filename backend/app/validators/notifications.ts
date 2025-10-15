import {
  notificationGroupedTypes,
  notificationPriorities,
  notificationStatuses,
  notificationTypes,
} from '#models/notification'
import vine from '@vinejs/vine'

/**
 * Validator for filtering users
 */
export const filterNotificationsValidator = vine.compile(
  vine.object({
    types: vine.array(vine.enum(notificationTypes)).optional(),
    status: vine.array(vine.enum(notificationStatuses)).optional(),
    priority: vine.array(vine.enum(notificationPriorities)).optional(),
    groupedType: vine.enum(notificationGroupedTypes).optional(),
  })
)

/**
 * Validator for sorting users
 */
export const sortNotificationsByValidator = vine.compile(
  vine.object({
    field: vine
      .enum(['type', 'status', 'priority', 'createdAt', 'updatedAt', 'deliveredAt', 'expiresAt'])
      .optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
