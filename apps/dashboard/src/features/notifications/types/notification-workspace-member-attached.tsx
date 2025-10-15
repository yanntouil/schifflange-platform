import { Api } from "@/services"
import { UserPlus } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationWorkspaceMemberAttachedProps {
  notification: Api.Notification & { type: "workspace-member-attached" }
  onUpdate: () => void
}

export const NotificationWorkspaceMemberAttached: React.FC<NotificationWorkspaceMemberAttachedProps> = ({
  notification,
  onUpdate,
}) => {
  const memberName = `${notification.metadata.attachedByProfile.firstname} ${notification.metadata.attachedByProfile.lastname}`
  const workspaceName = notification.workspace?.name || "un workspace"

  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<UserPlus className="size-4 text-green-500" />}
      title="Nouveau membre"
      description={`${memberName} a rejoint "${workspaceName}"`}
    />
  )
}