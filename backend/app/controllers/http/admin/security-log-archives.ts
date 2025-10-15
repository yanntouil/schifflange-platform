import { HttpContext } from '@adonisjs/core/http'
import { createReadStream, createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'

/**
 * Controller: SecurityLogArchivesController
 * @description this controller contains methods to manage security log archives (admin only)
 */
export default class SecurityLogArchivesController {
  /**
   * index
   * Returns a list of available security log archives
   * @get admin/security-logs/archives
   * @middleware auth, admin
   * @success 200 { archives: Array<{ name: string, size: number, date: string }> }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   */
  public async index({ response }: HttpContext) {
    const archiveDir = path.join(process.cwd(), 'storage', 'logs', 'security-archives')

    try {
      // Ensure the directory exists
      await fs.access(archiveDir)

      // Get all archive files
      const files = await fs.readdir(archiveDir)
      const archives = []

      for (const file of files) {
        if (!file.endsWith('.gz')) continue

        const filePath = path.join(archiveDir, file)
        const stats = await fs.stat(filePath)

        archives.push({
          name: file,
          size: stats.size,
          date: stats.mtime.toISOString(),
        })
      }

      // Sort by date (newest first)
      archives.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      return response.ok({ archives })
    } catch (error) {
      // If directory doesn't exist, return empty array
      return response.ok({ archives: [] })
    }
  }

  /**
   * download
   * Downloads a specific security log archive
   * @get admin/security-logs/archives/:filename
   * @middleware auth, admin
   * @params { filename: string }
   * @success 200 Binary file stream
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_NOT_FOUND
   */
  public async download({ params, response }: HttpContext) {
    const { filename } = params

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || !filename.endsWith('.gz')) {
      return response.notFound('Archive not found')
    }

    const archiveDir = path.join(process.cwd(), 'storage', 'logs', 'security-archives')
    const filePath = path.join(archiveDir, filename)

    try {
      // Check if file exists
      await fs.access(filePath)

      // Set appropriate headers
      response.header('Content-Type', 'application/json')
      response.header(
        'Content-Disposition',
        `attachment; filename="${filename.replace('.gz', '')}"`
      )

      // Stream the file through gunzip
      const readStream = createReadStream(filePath)
      const gunzip = createGunzip()

      // Pipe the decompressed content to the response
      readStream.pipe(gunzip).pipe(response.response)

      // Handle errors
      readStream.on('error', () => {
        response.status(500).send('Error reading archive')
      })

      return response.response
    } catch (error) {
      return response.notFound('Archive not found')
    }
  }

  /**
   * view
   * Views the content of a specific security log archive
   * @get admin/security-logs/archives/:filename/view
   * @middleware auth, admin
   * @params { filename: string }
   * @query { page?: number, limit?: number }
   * @success 200 { logs: Array<SecurityLog>, meta: { total: number, page: number, limit: number } }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_NOT_FOUND
   */
  public async view({ params, request, response }: HttpContext) {
    const { filename } = params
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || !filename.endsWith('.gz')) {
      return response.notFound('Archive not found')
    }

    const archiveDir = path.join(process.cwd(), 'storage', 'logs', 'security-archives')
    const filePath = path.join(archiveDir, filename)

    try {
      // Check if file exists
      await fs.access(filePath)

      // Create a temporary file to store the decompressed content
      const tempFile = path.join(
        process.cwd(),
        'storage',
        'tmp',
        `${Date.now()}-${filename.replace('.gz', '')}`
      )

      // Ensure tmp directory exists
      await fs.mkdir(path.dirname(tempFile), { recursive: true })

      // Decompress the file
      await pipeline(createReadStream(filePath), createGunzip(), createWriteStream(tempFile))

      // Read the file content
      const content = await fs.readFile(tempFile, 'utf-8')

      // Parse the JSON content
      const logs = JSON.parse(content)

      // Calculate pagination
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedLogs = logs.slice(start, end)

      // Clean up the temporary file
      await fs.unlink(tempFile)

      return response.ok({
        logs: paginatedLogs,
        meta: {
          total: logs.length,
          page,
          limit,
          lastPage: Math.ceil(logs.length / limit),
        },
      })
    } catch (error) {
      return response.notFound('Archive not found or invalid format')
    }
  }
}
