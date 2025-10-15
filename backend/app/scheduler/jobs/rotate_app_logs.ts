import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { promises as fs } from 'fs'
import path from 'path'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'

export default class RotateAppLogsJob extends BaseJob {
  async run() {
    const logsDir = app.makePath('logs')
    const logFile = path.join(logsDir, 'live.log')
    
    try {
      // Check if log file exists and has content
      const stats = await fs.stat(logFile)
      if (stats.size === 0) {
        logger.info('Log file is empty, skipping rotation')
        return { rotated: 0 }
      }

      const now = DateTime.now()
      const dateIndex = now.toFormat('yyyyMMdd')
      const rotatedFile = path.join(logsDir, `live.log.${dateIndex}`)
      const compressedFile = `${rotatedFile}.gz`

      // Step 1: Rename current log file
      await fs.rename(logFile, rotatedFile)
      
      // Step 2: Create new empty log file
      await fs.writeFile(logFile, '')
      
      // Step 3: Compress the rotated log file
      await pipeline(
        createReadStream(rotatedFile),
        createGzip(),
        createWriteStream(compressedFile)
      )

      // Step 4: Remove uncompressed rotated file
      await fs.unlink(rotatedFile)

      // Step 5: Clean up old compressed logs (keep last 30 days)
      await this.cleanupOldLogs(logsDir)

      logger.info(`Rotated app logs: created ${path.basename(compressedFile)} (${this.formatBytes(stats.size)})`)
      
      return { 
        rotated: 1,
        originalSize: stats.size,
        rotatedFile: compressedFile
      }

    } catch (error) {
      logger.error('Failed to rotate app logs:', error)
      throw error
    }
  }

  private async cleanupOldLogs(logsDir: string) {
    try {
      const files = await fs.readdir(logsDir)
      const logFiles = files.filter(file => 
        file.startsWith('live.log.') && 
        file.endsWith('.gz') && 
        file.match(/live\.log\.\d{8}\.gz$/) // Format: live.log.20240722.gz
      )
      
      const cutoffDate = DateTime.now().minus({ days: 30 })
      let deletedCount = 0

      for (const file of logFiles) {
        const filePath = path.join(logsDir, file)
        const stats = await fs.stat(filePath)
        const fileDate = DateTime.fromJSDate(stats.ctime)
        
        if (fileDate < cutoffDate) {
          await fs.unlink(filePath)
          deletedCount++
        }
      }

      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} old compressed log files`)
      }

    } catch (error) {
      logger.error('Error cleaning up old log files:', error)
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}