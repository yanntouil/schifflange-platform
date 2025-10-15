import { cx } from "@compo/utils"

/**
 * Date input component using react-aria
 */
export const dateInputStyle = cx(
  "relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive",
  "outline-none data-focus-within:ring-2 data-focus-within:ring-ring data-focus-within:ring-offset-2 data-focus-within:ring-offset-background"
)
