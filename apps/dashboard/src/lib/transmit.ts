import { Transmit } from '@adonisjs/transmit-client'
import globalConfig from '@/config/global'

/**
 * Transmit client for SSE notifications
 * Single instance as recommended by AdonisJS docs
 */
export const transmit = new Transmit({
  baseUrl: globalConfig.api,
  maxReconnectAttempts: 5,
})