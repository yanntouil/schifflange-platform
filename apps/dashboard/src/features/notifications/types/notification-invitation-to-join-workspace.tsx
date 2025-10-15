import { Api } from "@/services"
import { UserPlus } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationInvitationToJoinWorkspaceProps {
  notification: Api.Notification & { type: "invitation-to-join-workspace" }
  onUpdate: () => void
}

/**
 * Invitation to Join Workspace Notification
 */
export const NotificationInvitationToJoinWorkspace: React.FC<NotificationInvitationToJoinWorkspaceProps> = ({
  notification,
  onUpdate,
}) => {
  const senderName = `${notification.metadata.senderProfile.firstname} ${notification.metadata.senderProfile.lastname}`
  const workspaceName = notification.workspace?.name || "un workspace"

  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<UserPlus className="size-4 text-blue-500" />}
      title="Invitation à rejoindre un workspace"
      description={`${senderName} vous invite à rejoindre "${workspaceName}"`}
    >
      <div className="flex items-center gap-2 mt-2">
        <button className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/90">
          Accepter
        </button>
        <button className="text-xs border px-2 py-1 rounded-md hover:bg-muted">
          Refuser
        </button>
      </div>
    </NotificationBase>
  )
}