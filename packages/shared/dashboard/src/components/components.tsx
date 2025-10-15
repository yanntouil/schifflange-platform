import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import React from "react"

/**
 * Dashboard container
 */
const DashboardContainer: React.FC<React.ComponentPropsWithoutRef<"div">> = ({ className, ...props }) => {
  return (
    <div
      className={cxm(
        "group/dashboard @container/dashboard mx-auto flex w-full max-w-screen-2xl flex-col gap-4",
        className
      )}
      data-slot='dashboard-container'
      {...props}
    />
  )
}

/**
 * Dashboard header
 */
const DashboardHeader: React.FC<React.ComponentPropsWithoutRef<"div">> = ({ className, children, ...props }) => {
  return (
    <div className={cxm("space-y-1.5 pt-4 pb-8", className)} data-slot='dashboard-header' {...props}>
      {children}
    </div>
  )
}

/**
 * Dashboard title
 */
const DashboardTitle: React.FC<React.ComponentPropsWithoutRef<typeof Ui.Hn>> = ({
  level,
  className,
  children,
  ...props
}) => {
  return (
    <Ui.Hn
      level={level}
      className={cxm("text-2xl/tight font-semibold", className)}
      data-slot='dashboard-title'
      {...props}
    >
      {children}
    </Ui.Hn>
  )
}

/**
 * Dashboard description
 */
const DashboardDescription: React.FC<React.ComponentPropsWithoutRef<"p">> = ({ className, children, ...props }) => {
  return (
    <p
      className={cxm("text-muted-foreground text-sm/relaxed max-w-prose", className)}
      data-slot='dashboard-description'
      {...props}
    >
      {children}
    </p>
  )
}

export {
  DashboardContainer as Container,
  DashboardDescription as Description,
  DashboardHeader as Header,
  DashboardTitle as Title,
}
