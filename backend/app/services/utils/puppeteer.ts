import puppeteer, { type Browser } from 'puppeteer'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'

let browser: Browser | null = null
let lastUsedTime: number | null = null
let closeTimeout: NodeJS.Timeout | null = null

const BROWSER_TIMEOUT = 30000 // 30 seconds of inactivity before closing
const CHECK_INTERVAL = 10000 // Check every 10 seconds

/**
 * Get or start a Puppeteer browser instance
 * Implements singleton pattern with automatic cleanup after inactivity
 */
export const getOrStartBrowser = async (): Promise<Browser> => {
  try {
    // Check if browser is still connected
    if (browser && browser.connected) {
      lastUsedTime = Date.now()
      return browser
    }

    // Start new browser instance
    browser = await startBrowser()
    lastUsedTime = Date.now()

    // Schedule periodic checks for inactivity
    scheduleBrowserClose()

    return browser
  } catch (error) {
    logger.error('Failed to get or start browser', error)
    throw error
  }
}

/**
 * Schedule periodic checks to close browser after inactivity
 */
const scheduleBrowserClose = () => {
  // Clear existing timeout
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }

  // Set up periodic check
  closeTimeout = setInterval(async () => {
    if (!browser || !lastUsedTime) return

    const inactiveTime = Date.now() - lastUsedTime
    
    if (inactiveTime >= BROWSER_TIMEOUT) {
      await closeBrowser()
    }
  }, CHECK_INTERVAL)
}

/**
 * Start a new Puppeteer browser instance
 */
export const startBrowser = async (): Promise<Browser> => {
  try {
    const options: puppeteer.LaunchOptions = {
      headless: true,
      ignoreDefaultArgs: ['--disable-gpu'],
      args: [
        '--hide-scrollbars',
        '--mute-audio',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
      ],
    }

    // Add additional args for production
    if (app.inProduction) {
      options.args?.push(
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      )
    }

    browser = await puppeteer.launch(options)
    logger.info('Puppeteer browser started')
    return browser
  } catch (error) {
    logger.error('Failed to start Puppeteer browser', error)
    throw error
  }
}

/**
 * Close the browser and cleanup resources
 */
export const closeBrowser = async (): Promise<void> => {
  try {
    if (closeTimeout) {
      clearInterval(closeTimeout)
      closeTimeout = null
    }

    if (browser) {
      await browser.close()
      browser = null
      lastUsedTime = null
      logger.info('Puppeteer browser closed')
    }
  } catch (error) {
    logger.error('Failed to close browser', error)
  }
}

/**
 * Cleanup on application shutdown
 */
app.terminating(async () => {
  await closeBrowser()
})

// Export types
export type { Browser, Page, Cookie } from 'puppeteer'
