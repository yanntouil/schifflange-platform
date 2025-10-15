import { E_ENABLE_TO_TAKE_SCREENSHOT } from '#exceptions/previews'
import { E_INVALID_URL } from '#exceptions/proxy'
import { driveMakeAbsolutePathToTemp, driveTemp, makePath } from '#services/files/drive'
import UidService from '#services/utils/uid'
import { getOrStartBrowser } from '#services/utils/puppeteer'
import { previewValidator } from '#validators/previews'
import cache from '@adonisjs/cache/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import type { Page } from 'puppeteer'

const CACHE_TTL = '4h'
const DEFAULT_VIEWPORT = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  isMobile: false,
}

/**
 * PreviewsController
 * @description Generate website screenshots on demand with caching
 */
export default class PreviewsController {
  /**
   * Generate preview screenshot
   * @route GET /previews
   */
  public async index({ request, response }: HttpContext) {
    // Validate request parameters
    const payload = await request.validateUsing(previewValidator)
    
    // Build cache key from request
    const cacheKey = this.buildCacheKey(payload)
    
    // Get or set cached file path
    const filePath = await cache.getOrSet({
      key: cacheKey,
      factory: () => this.generateFilePath(),
      ttl: CACHE_TTL,
    })

    // Check if screenshot already exists
    if (await driveTemp.exists(filePath)) {
      return response
        .type('image/png')
        .download(driveMakeAbsolutePathToTemp(filePath))
    }

    // Generate new screenshot
    try {
      const screenshot = await this.generateScreenshot(payload)
      await driveTemp.put(filePath, screenshot)
      
      return response
        .type('image/png')
        .download(driveMakeAbsolutePathToTemp(filePath))
    } catch (error) {
      logger.error('Failed to generate preview screenshot', error)
      
      // Clean up cache on error
      await cache.delete({ key: cacheKey })
      
      if (error instanceof E_INVALID_URL || error instanceof E_ENABLE_TO_TAKE_SCREENSHOT) {
        throw error
      }
      
      throw new E_ENABLE_TO_TAKE_SCREENSHOT()
    }
  }

  /**
   * Generate screenshot from URL
   */
  private async generateScreenshot(params: PreviewPayload): Promise<Buffer> {
    const browser = await getOrStartBrowser()
    let page: Page | null = null
    
    try {
      page = await browser.newPage()
      
      // Configure viewport
      const viewport = {
        ...DEFAULT_VIEWPORT,
        ...params.viewport,
      }
      await page.setViewport(viewport)
      
      // Set color scheme
      await page.emulateMediaFeatures([{
        name: 'prefers-color-scheme',
        value: params.colorScheme || 'light',
      }])
      
      // Navigate to URL
      await page.goto(params.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000,
      })
      
      // Wait additional time if specified
      if (params.waitUntilTimeout && params.waitUntilTimeout > 0) {
        await new Promise(resolve => setTimeout(resolve, params.waitUntilTimeout))
      }
      
      // Take screenshot
      const screenshotBuffer = await page.screenshot({ 
        fullPage: false,
        type: 'png',
      })
      
      return Buffer.from(screenshotBuffer)
      
    } catch (error) {
      logger.error('Screenshot generation failed', { url: params.url, error })
      
      // Check if navigation failed
      if (error.message?.includes('net::ERR_') || error.message?.includes('Navigation')) {
        throw new E_INVALID_URL()
      }
      
      throw new E_ENABLE_TO_TAKE_SCREENSHOT()
      
    } finally {
      // Always close the page to free resources
      if (page) {
        try {
          await page.close()
        } catch (error) {
          logger.warn('Failed to close page', error)
        }
      }
    }
  }

  /**
   * Build cache key from parameters
   */
  private buildCacheKey(params: PreviewPayload): string {
    const viewport = params.viewport || {}
    const parts = [
      'preview',
      params.url,
      params.colorScheme || 'light',
      viewport.width || DEFAULT_VIEWPORT.width,
      viewport.height || DEFAULT_VIEWPORT.height,
      viewport.deviceScaleFactor || DEFAULT_VIEWPORT.deviceScaleFactor,
      viewport.isMobile ? 'mobile' : 'desktop',
      params.waitUntilTimeout || 0,
    ]
    
    return parts.join(':')
  }

  /**
   * Generate unique file path for screenshot
   */
  private generateFilePath(): string {
    const date = DateTime.now().toISODate()
    const uid = UidService.generateUid()
    return makePath(date!, `${uid}.png`)
  }
}

/**
 * Type definitions
 */
type PreviewPayload = {
  url: string
  screenshot?: boolean
  colorScheme?: 'light' | 'dark'
  waitUntilTimeout?: number
  viewport?: {
    isMobile?: boolean
    deviceScaleFactor?: number
    width?: number
    height?: number
  }
}