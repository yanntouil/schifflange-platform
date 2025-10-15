import { Api } from "@/services"
import { Users } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationWorkspaceMemberUpdatedProps {
  notification: Api.Notification & { type: "workspace-member-updated" }
  onUpdate: () => void
}

export const NotificationWorkspaceMemberUpdated: React.FC<NotificationWorkspaceMemberUpdatedProps> = ({
  notification,
  onUpdate,
}) => {
  const workspaceName = notification.workspace?.name || "un workspace"

  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<Users className="size-4 text-blue-500" />}
      title="Permissions modifiées"
      description={`Vos permissions dans "${workspaceName}" ont été modifiées`}
    />
  )
}