"use client"

import { type Api } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type MediasServiceContextType = {
  service: Api.MediaService
  serviceKey: string
  isAdmin: boolean
  makePath: Api.MakePath
}

/**
 * contexts
 */
export const MediasServiceContext = createContext<MediasServiceContextType | null>(null)

/**
 * hooks
 */
export const useMediasService = () => {
  const context = useContext(MediasServiceContext)
  if (!context) {
    throw new Error("useMediasService must be used within a MediasServiceProvider")
  }
  return context
}
