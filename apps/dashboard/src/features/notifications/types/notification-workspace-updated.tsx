import { Api } from "@/services"
import { Settings } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationWorkspaceUpdatedProps {
  notification: Api.Notification & { type: "workspace-updated" }
  onUpdate: () => void
}

/**
 * Workspace Updated Notification
 */
export const NotificationWorkspaceUpdated: React.FC<NotificationWorkspaceUpdatedProps> = ({
  notification,
  onUpdate,
}) => {
  const updaterName = `${notification.metadata.updatedByProfile.firstname} ${notification.metadata.updatedByProfile.lastname}`
  const workspaceName = notification.workspace?.name || "un workspace"
  const isAdmin = notification.metadata.byAdmin

  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<Settings className="size-4 text-orange-500" />}
      title="Workspace mis à jour"
      description={`"${workspaceName}" a été modifié par ${updaterName}${isAdmin ? " (admin)" : ""}`}
    >
      {notification.metadata.changes && Object.keys(notification.metadata.changes).length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          Modifications : {Object.keys(notification.metadata.changes).join(", ")}
        </div>
      )}
    </NotificationBase>
  )
}