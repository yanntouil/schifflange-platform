import { config } from "@/config"
import { Transmit } from "@adonisjs/transmit-client"

/**
 * Transmit client for SSE notifications
 * Single instance as recommended by AdonisJS docs
 */
export const transmit = new Transmit({
  baseUrl: config.api,
  maxReconnectAttempts: 5,
})
