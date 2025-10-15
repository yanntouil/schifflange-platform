/**
 * Payloads
 */
export type Update = {
  files?: string[] // used in socials
  translations?: Record<
    string,
    {
      title?: string
      description?: string
      keywords?: string[]
      imageId?: string | null
      socials?: {
        type: string
        title: string
        description: string
        imageId: string | null // ref in files
      }[]
    }
  >
}
