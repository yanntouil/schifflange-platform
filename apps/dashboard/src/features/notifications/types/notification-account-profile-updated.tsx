import { Api } from "@/services"
import { UserPen } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationAccountProfileUpdatedProps {
  notification: Api.Notification & { type: "account-profile-updated" }
  onUpdate: () => void
}

export const NotificationAccountProfileUpdated: React.FC<NotificationAccountProfileUpdatedProps> = ({ notification, onUpdate }) => {
  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<UserPen />}
      title="Profil mis à jour"
      description="Votre profil a été modifié"
    />
  )
}
