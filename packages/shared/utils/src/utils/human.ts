/**
 * Humanize file size formated
 */
export const humanFileSize = (sizeInBytes: number) => {
  let size = sizeInBytes
  let i = -1
  do {
    size /= 1024
    i++
  } while (size > 1024 && i < units.length)
  return `${Math.max(size, 0.1).toFixed(1)} ${units[i]}`
}
const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
