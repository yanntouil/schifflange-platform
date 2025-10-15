import { Api } from "@/services"
import { match } from "@compo/utils"
import React from "react"
import { NotificationAccountDeleted } from "../types/notification-account-deleted"
import { NotificationAccountProfileUpdated } from "../types/notification-account-profile-updated"
import { NotificationAccountTakeover } from "../types/notification-account-takeover"
import { NotificationAccountUpdated } from "../types/notification-account-updated"
import { NotificationDefault } from "../types/notification-default"
import { NotificationInvitationToJoinWorkspace } from "../types/notification-invitation-to-join-workspace"
import { NotificationWorkspaceDeleted } from "../types/notification-workspace-deleted"
import { NotificationWorkspaceMemberAttached } from "../types/notification-workspace-member-attached"
import { NotificationWorkspaceMemberLeft } from "../types/notification-workspace-member-left"
import { NotificationWorkspaceMemberRemoved } from "../types/notification-workspace-member-removed"
import { NotificationWorkspaceMemberUpdated } from "../types/notification-workspace-member-updated"
import { NotificationWorkspaceUpdated } from "../types/notification-workspace-updated"

interface NotificationDispatcherProps {
  notification: Api.Notification
  onUpdate: () => void
}

/**
 * Notification Dispatcher
 * Dispatches notification rendering to specific components based on type
 */
export const NotificationDispatcher: React.FC<NotificationDispatcherProps> = ({ notification, onUpdate }) => {
  const Comp = match(notification)
    .with({ type: "invitation-to-join-workspace" }, () => NotificationInvitationToJoinWorkspace)
    .with({ type: "workspace-updated" }, () => NotificationWorkspaceUpdated)
    .with({ type: "workspace-deleted" }, () => NotificationWorkspaceDeleted)
    .with({ type: "workspace-member-updated" }, () => NotificationWorkspaceMemberUpdated)
    .with({ type: "workspace-member-removed" }, () => NotificationWorkspaceMemberRemoved)
    .with({ type: "workspace-member-left" }, () => NotificationWorkspaceMemberLeft)
    .with({ type: "workspace-member-attached" }, () => NotificationWorkspaceMemberAttached)
    .with({ type: "account-updated" }, () => NotificationAccountUpdated)
    .with({ type: "account-profile-updated" }, () => NotificationAccountProfileUpdated)
    .with({ type: "account-deleted" }, () => NotificationAccountDeleted)
    .with({ type: "account-takeover" }, () => NotificationAccountTakeover)
    .otherwise(() => NotificationDefault)
  // @ts-expect-error - this component is used in a generic way
  return <Comp notification={notification} onUpdate={onUpdate} />
}
