import { Api } from "@/services"
import { UserX } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationWorkspaceMemberRemovedProps {
  notification: Api.Notification & { type: "workspace-member-removed" }
  onUpdate: () => void
}

export const NotificationWorkspaceMemberRemoved: React.FC<NotificationWorkspaceMemberRemovedProps> = ({
  notification,
  onUpdate,
}) => {
  const workspaceName = notification.workspace?.name || "un workspace"

  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<UserX className="size-4 text-red-500" />}
      title="Retiré du workspace"
      description={`Vous avez été retiré de "${workspaceName}"`}
    />
  )
}