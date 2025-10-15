import { Api } from "@/services"
import { A } from "@compo/utils"

/**
 * event guard for workspace logs
 */
export const eventGuard = (event: string): event is Api.WorkspaceLogEventType =>
  Object.values(workspaceEventsGrouped)
    .flat()
    .includes(event as Api.WorkspaceLogEventType)

/**
 * workspace events grouped
 */
export const workspaceEventsGrouped = {
  workspaceManagement: ["created", "updated", "deleted"],
  memberManagement: ["member-attached", "member-updated", "member-removed", "member-left", "member-joined"],
  invitationManagement: ["invitation-created", "invitation-deleted"],
} satisfies Record<string, Api.WorkspaceLogEventType[]>

/**
 * get event group
 */
export const getEventGroup = (event: Api.WorkspaceLogEventType) => {
  const groups = Object.entries(workspaceEventsGrouped)
  return A.find(groups, ([group, events]) => [...events].includes(event))?.[0] as keyof typeof workspaceEventsGrouped | undefined
}
