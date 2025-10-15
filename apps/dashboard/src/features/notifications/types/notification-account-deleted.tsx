import { Api } from "@/services"
import { Trash2 } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationAccountDeletedProps {
  notification: Api.Notification & { type: "account-deleted" }
  onUpdate: () => void
}

export const NotificationAccountDeleted: React.FC<NotificationAccountDeletedProps> = ({
  notification,
  onUpdate,
}) => {
  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<Trash2 className="size-4 text-red-500" />}
      title="Compte supprimé"
      description="Votre compte a été supprimé"
    />
  )
}