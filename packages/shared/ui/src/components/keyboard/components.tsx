import React from "react"
import { cxm } from "@compo/utils"
import { useIsDesktop, useIsMac } from "./hooks"

/**
 * KbdShortcut
 */
const KbdShortcut: React.FC<React.ComponentProps<"kbd"> & { desktopOnly?: boolean }> = ({
  className,
  children,
  desktopOnly = false,
  ...props
}) => {
  const isDesktop = useIsDesktop()
  if (desktopOnly && !isDesktop) return null
  return (
    <kbd
      {...props}
      className={cxm(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-muted/30 bg-muted/25 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 dark:text-white/80",
        className
      )}
    >
      {children}
    </kbd>
  )
}

/**
 * KbdMeta
 */
const KbdMeta: React.FC<{ shortcut?: string }> = ({ shortcut }) => {
  const isMac = useIsMac()
  const meta = isMac ? "⌘" : "CTRL"
  if (!shortcut) return <>{meta}</>
  const shortcutDivider = isMac ? " " : " + "
  return <>{`${meta}${shortcutDivider}${shortcut}`}</>
}

/**
 * KbdDesktopOnly
 */
const KbdDesktopOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDesktop = useIsDesktop()
  return isDesktop ? <>{children}</> : null
}

export { KbdDesktopOnly as DesktopOnly, KbdMeta as Meta, KbdShortcut as Shortcut }
