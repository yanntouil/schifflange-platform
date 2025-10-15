import { A, G, S, flow, pipe } from "@compo/utils"
import React from "react"

/**
 * useDropZone
 */
type useDropZoneParams = {
  accept?: Extensions
  min?: number
  max?: number
  multiple?: boolean
  onDropFiles: (files: File[]) => void
  onError?: (errorCode: "UNACCEPTED" | "TOOLARGE") => void
}
export const useDropZone = ({
  accept = "*",
  onDropFiles,
  min = 0,
  max = Infinity,
  multiple = true,
  onError,
}: useDropZoneParams) => {
  /**
   * onDrag
   */
  const [dragOver, setDragOver] = React.useState(false)
  const onDrag = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if ((e.type === "dragenter" || e.type === "dragover") && containsFiles(e)) setDragOver(true)
    else if (e.type === "dragleave") setDragOver(false)
  }

  /**
   * onDrop
   */
  const onDrop = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (e.dataTransfer.files) {
      const files = [...Array.from(e.dataTransfer.files)]
      if (A.isEmpty(files)) return
      if (!A.some(files, (file) => min <= getSizeFromFile(file) && max >= getSizeFromFile(file)))
        return onError && onError("TOOLARGE")
      if (!A.some(files, (file) => checkExtFromFile(file, accept))) return onError && onError("UNACCEPTED")
      onDropFiles([...A.take(files, multiple ? max : 1)])
    }
  }
  return {
    bindDropZone: {
      onDragEnter: onDrag,
      onDragLeave: onDrag,
      onDragOver: onDrag,
      onDrop: onDrop,
    },
    dragOver,
  }
}

/**
 * type
 */
export type Extensions = "*" | string | string[]

/**
 * helpers
 */
export const checkExtFromFile = (file: File, extensions: Extensions): boolean => {
  const extension = getExtFromFile(file)
  if (!extension) return false
  if (extensions === "*") return true
  return A.includes(formatExtList(extensions), extension)
}
export const formatExtList = (extensions: Extensions) => {
  if (extensions === "*") return []
  if (G.isString(extensions))
    return pipe(
      extensions,
      S.replaceAll(",", " "),
      S.replaceAll("|", " "),
      S.replaceByRe(/  +/g, " "),
      S.toLowerCase,
      S.removeAll("."),
      S.split(" "),
      A.map(S.trim),
      A.filter((e) => !!e),
      A.uniq
    )
  return pipe(extensions, A.map(flow(S.toLowerCase, S.trim, S.removeAll("."))), A.uniq)
}
export const getExtFromFile = (file: File): string | undefined => {
  const match = A.head(pipe(file.name, S.toLowerCase, S.match(/\.(\w+)$/g)) ?? [])
  if (G.isNotNullable(match)) return S.remove(match, ".")
  return undefined
}
export const getSizeFromFile = (file: File): number => file.size / 1024 / 1024
export const containsFiles = (event: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
  if (event.dataTransfer.types) {
    for (let i = 0; i < event.dataTransfer.types.length; i++) {
      if (event.dataTransfer.types[i] == "Files") {
        return true
      }
    }
  }
  return false
}

/**
 * acceptToInputAccept
 */
export const acceptToInputAccept = (accept: Extensions) => {
  return pipe(
    accept,
    formatExtList,
    A.map((e) => `.${e}`),
    A.join(",")
  )
}
