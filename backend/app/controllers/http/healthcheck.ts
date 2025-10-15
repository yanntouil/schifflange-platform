import { healthChecks } from '#start/health'
import type { HttpContext } from '@adonisjs/core/http'

export default class HealthChecksController {
  async handle({ response }: HttpContext) {
    const report = await healthChecks.run()
    if (report.isHealthy) {
      return response.ok({
        message: "I'm in the best of health who i can 😅",
        ...report,
      })
    }
    return response.serviceUnavailable(report)
  }
}
