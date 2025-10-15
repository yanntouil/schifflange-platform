export type CookieDeclaration = {
  domain: string
  path: string
  expiresAfterDays: number
  categories: string[]
  apps: {
    name: string
    categories: string[]
    cookies?: string[]
    session?: string[]
    local?: string[]
    default: boolean
    required: boolean
    onAccept?: () => void
    onReject?: () => void
  }[]
}
