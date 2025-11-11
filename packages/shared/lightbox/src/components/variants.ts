import { cxm } from "@compo/utils"

/**
 * state classes
 */
export const focusVisibleCx =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
export const disabledCx = "disabled:cursor-not-allowed disabled:opacity-50"

/**
 * button classes
 */
export const buttonCx = cxm(
  "inline-flex items-center justify-center",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "transition-colors",
  "whitespace-nowrap font-medium",
  "hover:bg-accent-foreground dark:hover:bg-accent hover:text-accent dark:hover:text-accent-foreground text-accent dark:text-accent-foreground hover:disabled:bg-transparent hover:disabled:text-inherit transition-colors duration-300 ease-in-out",
  "w-[var(--input-default-height)] h-[var(--input-default-height)] rounded-sm text-sm [&_svg]:size-4 [&_.icon]:size-4",
  focusVisibleCx,
  disabledCx
)
