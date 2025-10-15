import { Api } from "@/services"
import { Trash2 } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationWorkspaceDeletedProps {
  notification: Api.Notification & { type: "workspace-deleted" }
  onUpdate: () => void
}

export const NotificationWorkspaceDeleted: React.FC<NotificationWorkspaceDeletedProps> = ({
  notification,
  onUpdate,
}) => {
  const deleterName = `${notification.metadata.deletedByProfile.firstname} ${notification.metadata.deletedByProfile.lastname}`
  const workspaceName = notification.workspace?.name || "un workspace"

  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<Trash2 className="size-4 text-red-500" />}
      title="Workspace supprimé"
      description={`"${workspaceName}" a été supprimé par ${deleterName}`}
    />
  )
}