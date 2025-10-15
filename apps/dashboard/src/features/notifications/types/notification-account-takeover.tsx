import { Api } from "@/services"
import { Shield } from "lucide-react"
import React from "react"
import { NotificationBase } from "./notification-base"

interface NotificationAccountTakeoverProps {
  notification: Api.Notification & { type: "account-takeover" }
  onUpdate: () => void
}

export const NotificationAccountTakeover: React.FC<NotificationAccountTakeoverProps> = ({
  notification,
  onUpdate,
}) => {
  return (
    <NotificationBase
      notification={notification}
      onUpdate={onUpdate}
      icon={<Shield className="size-4 text-red-500" />}
      title="Connexion suspecte"
      description="Une connexion à votre compte a été détectée"
    >
      <div className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-md mt-2">
        ⚠️ Si ce n'était pas vous, changez votre mot de passe immédiatement
      </div>
    </NotificationBase>
  )
}