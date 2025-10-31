import { Ui } from "@compo/ui"
import React from "react"
import { ScheduleDialog } from "./components"
import { ScheduleContext, ScheduleContextType } from "./schedules.context"

export type ScheduleProviderProps = {
  children: React.ReactNode
} & Omit<ScheduleContextType, "contextId" | "edit">

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children, ...props }) => {
  const contextId = React.useId()
  const [edit, editProps] = Ui.useQuickDialog<void>()
  const value = React.useMemo(() => ({ contextId, ...props, edit }), [contextId, props, edit])
  return (
    <ScheduleContext.Provider value={value}>
      {children}
      <ScheduleDialog {...editProps} />
    </ScheduleContext.Provider>
  )
}
