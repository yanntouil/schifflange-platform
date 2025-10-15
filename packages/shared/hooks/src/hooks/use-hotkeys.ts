"use client"

import { createAssertiveContext } from "@compo/utils"
import { HotkeyCallback, Options as HotkeysConfig, Keys, useHotkeys as useHotkeysDefault } from "react-hotkeys-hook"

type DependencyList = unknown[]
type OptionsOrDependencyArray = HotkeysConfig | DependencyList

/**
 * use hotkeys hook with default config
 */
export const useContextHotkeys = (
  keys: Keys,
  callback: HotkeyCallback,
  options: HotkeysConfig = {},
  dependencies?: OptionsOrDependencyArray | undefined
) => {
  const contextOptions = HotkeyConfigContext.useAsOption() ?? {}

  useHotkeysDefault(keys, callback, { ...contextOptions, ...options }, dependencies)
}

export const HotkeyConfigContext = createAssertiveContext<HotkeysConfig>()
