import { Api } from "@/services"
import { UserX } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationWorkspaceMemberLeftProps {
  notification: Api.Notification & { type: "workspace-member-left" }
  onUpdate: () => void
}

export const NotificationWorkspaceMemberLeft: React.FC<NotificationWorkspaceMemberLeftProps> = ({
  notification,
  onUpdate,
}) => {
  const memberName = `${notification.metadata.leftByProfile.firstname} ${notification.metadata.leftByProfile.lastname}`
  const workspaceName = notification.workspace?.name || "un workspace"

  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<UserX className="size-4 text-orange-500" />}
      title="Membre a quitté"
      description={`${memberName} a quitté "${workspaceName}"`}
    />
  )
}