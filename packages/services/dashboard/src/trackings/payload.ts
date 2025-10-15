/**
 * queries
 */
export type Query = {
  type?: string
  model?: string
  isBot?: boolean // default to false
  unique?: boolean // default to false
  trackingIds?: string[]
}
export type QueryInterval = {
  date?: string
  from?: string
  to?: string
}
