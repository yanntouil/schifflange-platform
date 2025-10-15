import { Dashboard } from "@compo/dashboard"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * Dashboard Header
 * This header is used to display the dashboard routes
 */
export const Header: React.FC = () => {
  const { breadcrumbs, isLoading } = Dashboard.useBreadcrumbsStore()
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <Ui.Sidebar.Trigger className="-ml-1" />
      <Ui.Separator orientation="vertical" className="mr-2 h-4" />
      <Ui.Breadcrumbs breadcrumbs={breadcrumbs} isLoading={isLoading} />
    </header>
  )
}
