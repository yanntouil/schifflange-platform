import { Api } from "@/services"
import { Bell } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationDefaultProps {
  notification: Api.Notification
  onUpdate: () => void
}

/**
 * Default Notification Component
 * Used when no specific component exists for a notification type
 */
export const NotificationDefault: React.FC<NotificationDefaultProps> = ({
  notification,
  onUpdate,
}) => {
  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<Bell className="size-4 text-muted-foreground" />}
      title="Notification"
      description={`Type: ${notification.type}`}
    />
  )
}