import { getExtFromFile } from "@compo/hooks"
import { DictionaryFn } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match, T, zeroPad } from "@compo/utils"
import { A, D, G } from "@mobily/ts-belt"
import getVideoId from "get-video-id"
import { FormGroupProps } from "./group"
import { FormSelectOption } from "./select"
import { FormFileType, FormSimpleFileType, NormalizedFile, SynteticFile } from "./types"

/**
 * helper to spread props from merged FormGroup props
 */
export type ExtractGroupProps = FormGroupProps & { [key: string]: unknown } & { classNames?: { [key: string]: string } }
export const extractGroupProps = (props: ExtractGroupProps): FormGroupProps => {
  const { label, classNames, labelAside, name, required, message } = props
  return { label, classNames, labelAside, name, required, message }
}
export const extractInputProps = <T extends Record<string, unknown>>(
  props: Omit<FormGroupProps, "required"> & T
): { [key: string]: unknown } => {
  const inputProps = D.deleteKeys(props, ["label", "labelAside", "name", "message", "classNames"])
  return inputProps as T
}

/**
 * makeFormFileValue
 * prepare a file url to FormFile component value
 * extractFormFilePayload < - > makeFormFileValue
 */
export const makeFormFileValue = (fileUrl: Option<string> = null) => {
  return {
    url: fileUrl ?? null,
    file: null,
    delete: false,
  }
}

/**
 * extractFormFilePayload
 * extract the payload from a FormFile component value
 * in case file must be sent deleted return null,
 * in case file must be sent return the file
 * otherwise return undefined
 * extractFormFilePayload < - > makeFormFileValue
 */
export const extractFormFilePayload = (value: FormSimpleFileType) => {
  return value.file ? value.file : value.delete ? null : undefined
}
export const extractFormFilesToUpload = (value: FormFileType[]) => {
  return A.filter(value, (file) => isFile(file))
}
export const extractFormFilesToDelete = (value: FormFileType[]) => {
  return A.filter(value, (file) => isSynteticFile(file) && file.delete)
}

/**
 * Convert an array of strings to an array of objects with label and value
 */
export const makeOptions = (options: string[], t: DictionaryFn): FormSelectOption[] =>
  A.map(options, (o) => ({ label: t(`${o}`), value: o }))

/**
 * Check if a file is synthetic
 */
export const isSynteticFile = (file: FormFileType): file is SynteticFile => {
  return G.isNotNullable((file as SynteticFile).delete)
}

/**
 * Check if a file is a real file
 */
export const isFile = (file: FormFileType): file is File => {
  return !isSynteticFile(file)
}

/**
 * Check if a file is a real file
 */
export const isImage = (file: FormFileType) => {
  return isFile(file) ? file.type.startsWith("image/") : Ui.isImageExtension(file.extension)
}

/**
 * Normalize a file
 */
export const normalizeFormFile = (file: FormFileType): NormalizedFile => {
  if (isSynteticFile(file)) return { ...file }
  return {
    name: file.name,
    extension: getExtFromFile(file) ?? "",
    size: file.size,
    url: URL.createObjectURL(file),
    delete: false,
  }
}

/**
 * Create initial files
 */
export const initialFiles = (
  files: {
    id: string
    name: string
    url: string
    size: number
    extension: string
  }[]
): FormFileType[] =>
  A.map(files, (file) => ({
    ...D.selectKeys(file, ["id", "name", "extension", "size", "url"]),
    delete: false,
  }))

/**
 * Format a date to a form input
 */
export const formatDateToFormInput = (date: unknown) => (T.isDate(date) ? T.format(date, "yyyy-LL-dd") : "")

/**
 * Format a duration to a time
 */
export const durationToTime = (duration: Record<string, number>) =>
  `${zeroPad(duration.hours ?? 0)}:${zeroPad(duration.minutes ?? 0)}`

/**
 * Format a datetime to a form input
 */
export const formatDatetimeToFormInput = (date: unknown) => (T.isDate(date) ? T.format(date, "yyyy-MM-dd'T'HH:mm") : "")

/**
 * Format a time to a duration
 */
export const timeToDuration = (time: string) => {
  const [hours, minutes] = time.split(":")
  return { hours: +(hours ?? 0), minutes: +(minutes ?? 0) }
}

/**
 * Check if a value is a finite number
 */
export const isFiniteNumber = (n: unknown): n is number => {
  return Number.isFinite(n)
}

/**
 * Round a number
 */
export const round = (n: number, precision: number = 0) => {
  if (precision === 0) return Math.round(n)
  const factor = 10 ** precision
  return Math.round(n * factor) / factor
}

/**
 * Get typed info from a video URL, iframe URL or embed URL
 * @link https://github.com/radiovisual/get-video-id
 */
export const getVideoInfo = (value: string): VideoInfo | null => {
  try {
    const video = getVideoId(value)

    if (!(G.isNotNullable(video.id) && G.isNotNullable(video.service))) return null

    const { id, service } = video

    // Validate ID format based on service
    const isValid = match(service)
      .with("youtube", () => /^[a-zA-Z0-9_-]{11}$/.test(id)) // YouTube: 11 chars alphanumeric + "_-"
      .with("vimeo", () => /^[0-9]+$/.test(id)) // Vimeo: only digits
      .with("dailymotion", () => /^[a-zA-Z0-9]+$/.test(id)) // Dailymotion: alphanumeric
      .otherwise(() => false)

    if (!isValid) return null

    // Return validated info
    return { service, id } as VideoInfo
  } catch (error) {
    return null
  }
}

/**
 * helper to validate a video service
 */
export const makeVideoService = (
  service: Option<string>
): NonNullable<ReturnType<typeof getVideoInfo>>["service"] | null => {
  return match(service)
    .with("youtube", () => "youtube" as const)
    .with("vimeo", () => "vimeo" as const)
    .with("dailymotion", () => "dailymotion" as const)
    .otherwise(() => null)
}

/**
 * Generate a video url from a service and id
 */
export const generateVideoUrl = ({ service, id }: VideoInfo): string => {
  return match(service)
    .with("youtube", () => `https://www.youtube.com/watch?v=${id}`)
    .with("vimeo", () => `https://vimeo.com/${id}`)
    .with("dailymotion", () => `https://www.dailymotion.com/video/${id}`)
    .otherwise(() => {
      throw new Error(`Unsupported video service: ${service}`)
    })
}

export type VideoInfo = {
  service: "youtube" | "vimeo" | "dailymotion"
  id: string
}

/**
 * Resolve a path in an object or string
 */
export const resolvePath = (
  path: string[],
  objectOrString: Record<string, unknown> | string,
  placeholder: string = ""
): string | Record<string, unknown> => {
  try {
    return A.reduce(path, objectOrString, (acc, key) => {
      if (G.isObject(acc)) return acc[key] as Record<string, unknown> | string
      throw new Error("Path not found")
    })
  } catch (error) {
    return placeholder
  }
}
