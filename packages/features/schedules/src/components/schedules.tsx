import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Edit } from "lucide-react"
import React from "react"
import { type ScheduleContextType, useSchedule } from "../schedules.context"
import { ScheduleProvider } from "../schedules.context.provider"
import { SchedulePreview } from "./schedules.preview"

/**
 * Schedule
 * display the schedule and each feature to update it
 */
export type ScheduleProps = ScheduleInnerProps & Omit<ScheduleContextType, "contextId" | "edit">
export const Schedule: React.FC<ScheduleProps> = ({ title, children, ...props }) => {
  const innerProps = { title, children }
  return (
    <ScheduleProvider {...props}>
      <ScheduleInner {...innerProps} />
    </ScheduleProvider>
  )
}

/**
 * ScheduleInner
 * the inner component of the schedule component
 */
type ScheduleInnerProps = {
  title?: string
  children?: React.ReactNode
}
const ScheduleInner: React.FC<ScheduleInnerProps> = ({ title, children }) => {
  const { _ } = useTranslation(dictionary)
  const { persistedId, edit } = useSchedule()

  return (
    <Ui.CollapsibleCard.Root id={persistedId}>
      <Ui.CollapsibleCard.Header>
        <Ui.CollapsibleCard.Title>{title || _("title")}</Ui.CollapsibleCard.Title>
        <Ui.CollapsibleCard.Aside>
          <Ui.Tooltip.Quick tooltip={_("edit")} side='left' asChild>
            <Ui.Button variant='ghost' size='xs' icon onClick={edit}>
              <Edit aria-hidden />
              <Ui.SrOnly>{_("edit")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container/schedule overflow-hidden'>
        <SchedulePreview />
        {children}
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

const dictionary = {
  fr: {
    title: "Options de planification",
    edit: "Modifier les options de planification",
  },
  en: {
    title: "Schedule options",
    edit: "Edit schedule options",
  },
  de: {
    title: "Planungsoptionen",
    edit: "Planungsoptionen bearbeiten",
  },
}
