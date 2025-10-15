import folders from '#config/folders'
import app from '@adonisjs/core/services/app'
import AdonisDrive from '@adonisjs/drive/services/main'
import { G, S } from '@mobily/ts-belt'

/**
 * drive service api
 * @see https://flydrive.dev/
 * -------------------
 * await drive.put(key, value)
 * await drive.putStream(key, readableStream)
 *
 * await drive.get(key)
 * await drive.getStream(key)
 * await drive.getBytes(key)

 * await drive.delete(key)
 * await drive.deleteAll(prefix)
 *
 * await drive.copy(source, destination)
 * await drive.move(source, destination)
 *
 * await drive.copyFromFs(source, destination)
 * await drive.moveFromFs(source, destination)
 */

export const drive = AdonisDrive.use()
export const driveTemp = AdonisDrive.use('temp')
export const expiresIn: string | number = 60 * 60 * 24 * 365 * 100 // by default expires in 100 years

/**
 * driveDeleteSafe
 * @description delete a file from storage if it exists
 */
export const driveDeleteSafe = async (filePath: unknown) => {
  if (G.isString(filePath) && S.isNotEmpty(S.trim(filePath)) && (await drive.exists(filePath)))
    await drive.delete(filePath)
}
/**
 * makePath
 */
export const makePath = (...paths: string[]) => {
  const trimmedPaths = paths.map((path) => path.replace(/^\/|\/$/g, ''))
  return trimmedPaths.join('/')
}

/**
 * drive urls makers
 */
export const driveMakeUrl = (...paths: string[]) => makePath(folders.storage, ...paths)
export const driveMakeUrlToTemp = (...paths: string[]) => makePath(folders.temp, ...paths)

/**
 * drive paths makers
 */
export const driveMakeRelativePath = (...paths: string[]) =>
  makePath(folders.localDriveRoot, folders.storage, ...paths)

export const driveMakeAbsolutePath = (...paths: string[]) =>
  app.makePath(folders.localDriveRoot, folders.storage, ...paths)
export const driveMakeAbsoluteRootPath = (...paths: string[]) =>
  app.makePath(folders.localDriveRoot, ...paths)
export const driveMakeAbsolutePathToTemp = (...paths: string[]) =>
  app.makePath(folders.localDriveRoot, folders.temp, ...paths)
