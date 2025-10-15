import { Ui } from "@compo/ui"
import React from "react"
import Logo from "./copyright.logo.svg?react"

/**
 * Copyright
 * This component is used to display the copyright information
 */
export const Copyright: React.FC = () => {
  return (
    <footer className="flex shrink-0 items-center gap-2 px-4 py-2">
      <div className="flex grow items-center justify-center gap-2">
        <span className="text-muted-foreground text-xs font-normal">Powered by 101 Studios</span>
        <Ui.Separator orientation="vertical" className="h-4" />
        <a href="https://101.lu" target="_blank" rel="noopener noreferrer nofollow">
          <Logo className="fill-muted-foreground w-8" />
        </a>
      </div>
    </footer>
  )
}
