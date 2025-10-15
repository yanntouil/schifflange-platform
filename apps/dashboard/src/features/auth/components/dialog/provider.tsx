import { authStore, useAuthDialogTab } from "@/features/auth"
import { Ui } from "@compo/ui"
import React from "react"
import { AuthDialog } from ".."
import { AuthDialogContext, isDialogOpen } from "./context"

/**
 * auth dialog provider
 * this provider is used to provide the auth dialog context to the app
 * it also renders the auth dialog modal
 */
export const AuthDialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { tab, setTab } = useAuthDialogTab()

  // Register the global auth dialog controller
  React.useEffect(() => {
    authStore.actions.registerDialogController(setTab)
    return () => authStore.actions.unregisterDialogController()
  }, [setTab])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTab(null)
    }
  }
  const open = isDialogOpen(tab)
  return (
    <AuthDialogContext.Provider value={{ tab, setTab }}>
      <Ui.Dialog.Root open={open} onOpenChange={onOpenChange}>
        {children}
        {isDialogOpen(tab) && <AuthDialog tab={tab} setTab={setTab} />}
      </Ui.Dialog.Root>
    </AuthDialogContext.Provider>
  )
}
