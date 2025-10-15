import { Icon, Ui } from "@compo/ui"
import React from "react"
import { AuthDialogProvider } from "./dialog/provider"
import { AuthDropdown } from "./dropdown"
import { AuthLabel } from "./label"

/**
 * AuthSidebarButton
 * display user avatar and name wrap into a dropdown menu
 */
export const AuthSidebarButton: React.FC = () => {
  const iconRef = React.useRef<Icon.ChevronsUpDownHandle>(null)
  return (
    <AuthDialogProvider>
      <Ui.Sidebar.MenuItem>
        <AuthDropdown sideOffset={0} align="start" side="bottom">
          <button
            type="button"
            className={cxm(
              Ui.sidebarMenuButtonVariants({ variant: "default", size: "lg" }),
              "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            )}
            onMouseEnter={() => iconRef.current?.startAnimation()}
            onMouseLeave={() => iconRef.current?.stopAnimation()}
          >
            <AuthLabel />
            <Icon.ChevronsUpDown className="text-muted-foreground ml-auto !size-3 shrink-0" aria-hidden ref={iconRef} />
          </button>
        </AuthDropdown>
      </Ui.Sidebar.MenuItem>
    </AuthDialogProvider>
  )
}
