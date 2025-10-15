import { urlValidator } from '#validators/url'
import type { HttpContext } from '@adonisjs/core/http'
import ogs from 'open-graph-scraper'

export default class OpengraphsController {
  async index({ request, response }: HttpContext) {
    const { url } = await request.validateUsing(urlValidator)
    try {
      const data = await ogs({ url, timeout: 3000, onlyGetOpenGraphInfo: true })
      if (data.error) return response.ok({ requestUrl: url, success: false })
      return response.ok(data.result)
    } catch (error) {
      return response.ok({ requestUrl: url, success: false })
    }
  }
}
