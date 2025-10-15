import { Api } from "@/services"
import { Settings } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationAccountUpdatedProps {
  notification: Api.Notification & { type: "account-updated" }
  onUpdate: () => void
}

export const NotificationAccountUpdated: React.FC<NotificationAccountUpdatedProps> = ({
  notification,
  onUpdate,
}) => {
  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<Settings className="size-4 text-blue-500" />}
      title="Compte mis à jour"
      description="Votre compte a été modifié"
    />
  )
}