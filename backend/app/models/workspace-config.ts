import { G } from '@mobily/ts-belt'

/**
 * WorkspaceConfig
 * default config for a workspace
 */
const defaultConfig = {
  site: { url: 'https://website.lu', secure: true },
  articles: { slugPrefix: 'articles', tags: [] },
  events: { slugPrefix: 'events' },
  organisation: { display: false, organisationId: '' },
}
export type WorkspaceConfig = typeof defaultConfig

/**
 * helper to merge only valid values (string, boolean, array) recursively
 */
const mergeOnly = <T>(defaults: T, overrides?: DeepPartial<T>): T => {
  if (!overrides) return defaults

  const out: any = Array.isArray(defaults) ? [...(defaults as any)] : { ...(defaults as any) }

  for (const key in defaults as any) {
    const defVal = (defaults as any)[key]
    const ovVal = (overrides as any)?.[key]

    if (typeof defVal === 'string') {
      out[key] = G.isString(ovVal) ? ovVal : defVal
    } else if (typeof defVal === 'boolean') {
      out[key] = G.isBoolean(ovVal) ? ovVal : defVal
    } else if (Array.isArray(defVal)) {
      out[key] = Array.isArray(ovVal) ? ovVal : defVal
    } else if (defVal && typeof defVal === 'object') {
      out[key] = mergeOnly(defVal, ovVal as any)
    } else {
      out[key] = ovVal ?? defVal
    }
  }
  return out
}

/**
 * Build full config from partial overrides (global defaults)
 */
export const makeWorkspaceConfig = (config: DeepPartial<WorkspaceConfig> = {}): WorkspaceConfig =>
  mergeOnly(defaultConfig, config)

/**
 * Merge partial config into provided defaults (tenant-specific)
 */
export const mergeWorkspaceConfig = (
  config: DeepPartial<WorkspaceConfig>,
  defaults: WorkspaceConfig
): WorkspaceConfig => mergeOnly(makeWorkspaceConfig(defaults), config)
