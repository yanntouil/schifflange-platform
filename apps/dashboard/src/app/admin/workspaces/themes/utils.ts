import React from "react"

type Option<T> = T | null | undefined

/**
 * make theme config
 * @param config - theme config
 * @returns theme config
 */
export const makeThemeConfigValue = (config: Option<Record<string, Record<string, unknown>>> = {}) => ({
  light: {
    // Primary Colors
    primary: stringGuard(config?.light?.primary),
    "primary-foreground": stringGuard(config?.light?.["primary-foreground"]),

    // Secondary Colors
    secondary: stringGuard(config?.light?.secondary),
    "secondary-foreground": stringGuard(config?.light?.["secondary-foreground"]),

    // Background Colors
    background: stringGuard(config?.light?.background),
    foreground: stringGuard(config?.light?.foreground),
    muted: stringGuard(config?.light?.muted),
    "muted-foreground": stringGuard(config?.light?.["muted-foreground"]),

    // Accent & Status Colors
    accent: stringGuard(config?.light?.accent),
    "accent-foreground": stringGuard(config?.light?.["accent-foreground"]),
    destructive: stringGuard(config?.light?.destructive),
    "destructive-foreground": stringGuard(config?.light?.["destructive-foreground"]),

    // Border & Input
    border: stringGuard(config?.light?.border),
    input: stringGuard(config?.light?.input),
    ring: stringGuard(config?.light?.ring),

    // Card & Popover
    card: stringGuard(config?.light?.card),
    "card-foreground": stringGuard(config?.light?.["card-foreground"]),
    popover: stringGuard(config?.light?.popover),
    "popover-foreground": stringGuard(config?.light?.["popover-foreground"]),

    // Charts
    "chart-1": stringGuard(config?.light?.["chart-1"]),
    "chart-2": stringGuard(config?.light?.["chart-2"]),
    "chart-3": stringGuard(config?.light?.["chart-3"]),
    "chart-4": stringGuard(config?.light?.["chart-4"]),
    "chart-5": stringGuard(config?.light?.["chart-5"]),
  },
  dark: {
    // Primary Colors
    primary: stringGuard(config?.dark?.primary),
    "primary-foreground": stringGuard(config?.dark?.["primary-foreground"]),

    // Secondary Colors
    secondary: stringGuard(config?.dark?.secondary),
    "secondary-foreground": stringGuard(config?.dark?.["secondary-foreground"]),

    // Background Colors
    background: stringGuard(config?.dark?.background),
    foreground: stringGuard(config?.dark?.foreground),
    muted: stringGuard(config?.dark?.muted),
    "muted-foreground": stringGuard(config?.dark?.["muted-foreground"]),

    // Accent & Status Colors
    accent: stringGuard(config?.dark?.accent),
    "accent-foreground": stringGuard(config?.dark?.["accent-foreground"]),
    destructive: stringGuard(config?.dark?.destructive),
    "destructive-foreground": stringGuard(config?.dark?.["destructive-foreground"]),

    // Border & Input
    border: stringGuard(config?.dark?.border),
    input: stringGuard(config?.dark?.input),
    ring: stringGuard(config?.dark?.ring),

    // Card & Popover
    card: stringGuard(config?.dark?.card),
    "card-foreground": stringGuard(config?.dark?.["card-foreground"]),
    popover: stringGuard(config?.dark?.popover),
    "popover-foreground": stringGuard(config?.dark?.["popover-foreground"]),

    // Charts
    "chart-1": stringGuard(config?.dark?.["chart-1"]),
    "chart-2": stringGuard(config?.dark?.["chart-2"]),
    "chart-3": stringGuard(config?.dark?.["chart-3"]),
    "chart-4": stringGuard(config?.dark?.["chart-4"]),
    "chart-5": stringGuard(config?.dark?.["chart-5"]),
  },
})

const stringGuard = (value: unknown): string | null => {
  if (typeof value === "string") return value
  return null
}

/**
 * make theme config form
 * @param config - theme config
 * @returns theme config form
 */
export const makeThemeConfigPayload = (config: ReturnType<typeof makeThemeConfigValue>) => {
  return {
    light: Object.fromEntries(Object.entries(config.light).filter(([_, value]) => value !== null)),
    dark: Object.fromEntries(Object.entries(config.dark).filter(([_, value]) => value !== null)),
  }
}

/**
 * generate React.CSSProperties from theme config
 * @param config - theme config (from API or form)
 * @returns object with light and dark React.CSSProperties
 */
export const makeThemeStyles = (config: Option<Record<string, Record<string, unknown>>> = {}) => {
  const themeConfig = makeThemeConfigValue(config)

  return {
    light: generateReactStyles(themeConfig.light),
    dark: generateReactStyles(themeConfig.dark),
  }
}

/**
 * generate React.CSSProperties from theme config
 * @param colors - theme colors
 * @returns React.CSSProperties
 */
const generateReactStyles = (colors: Record<string, string | null>): React.CSSProperties => {
  const styles: React.CSSProperties = {}

  Object.entries(colors).forEach(([key, value]) => {
    if (value !== null) {
      // Convert CSS custom property name to React style property
      const cssVarName = `--${key}` as keyof React.CSSProperties
      ;(styles as any)[cssVarName] = value
    }
  })

  return styles
}
