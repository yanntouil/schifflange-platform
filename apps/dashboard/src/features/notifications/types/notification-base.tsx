import { notificationStore } from "@/features/notifications/store"
import { Api, service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Check, Trash2 } from "lucide-react"
import React from "react"

interface NotificationBaseProps {
  notification: Api.Notification
  onUpdate: () => void
  icon: React.ReactNode
  title: string
  description: string
  children?: React.ReactNode
}

/**
 * Base Notification Component
 * Provides common layout and actions for all notification types
 */
export const NotificationBase: React.FC<NotificationBaseProps> = ({ notification, onUpdate, icon, title, description, children }) => {
  const { _, format } = useTranslation(dictionary)

  const markAsRead = async () => {
    const result = await service.notifications.markAsRead(notification.id)
    if (result.ok) {
      notificationStore.actions.markAsRead(notification.id)
      onUpdate()
    }
  }

  const deleteNotification = async () => {
    const result = await service.notifications.destroy(notification.id)
    if (result.ok) {
      notificationStore.actions.removeNotification(notification.id)
      onUpdate()
    }
  }

  const isUnread = notification.status === "unread"
  const priorityColor = match(notification.priority)
    .with("high", () => "border-l-destructive")
    .with("low", () => "border-l-muted")
    .otherwise(() => "border-l-primary")

  return (
    <div
      className={`group hover:bg-muted/30 relative px-6 py-3 transition-colors ${isUnread ? "bg-muted/50" : ""} ${priorityColor}`}
      onClick={markAsRead}
    >
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="mt-0.5 flex-shrink-0" aria-hidden>
          <div className="bg-muted flex size-8 items-center justify-center rounded-full [&>svg]:size-4 [&>svg]:stroke-1">{icon}</div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-medium">{title}</h4>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{description}</p>
              {children && <div className="mt-2">{children}</div>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity delay-300 duration-200 group-hover:opacity-100">
              {isUnread && (
                <Ui.Button variant="ghost" size="sm" onClick={markAsRead}>
                  <Check className="size-3" />
                </Ui.Button>
              )}

              <Ui.Button variant="ghost" size="sm" onClick={deleteNotification}>
                <Trash2 className="size-3" />
              </Ui.Button>
            </div>
          </div>

          {/* Timestamp */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs">{format(notification.createdAt, "PPPPp")}</span>

            {notification.priority !== "default" && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                  notification.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                }`}
              >
                {_(notification.priority)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "delete-title": "Delete notification",
    "delete-description": "Are you sure you want to delete this notification?",
    high: "High",
    low: "Low",
    default: "Normal",
  },
  fr: {
    "delete-title": "Supprimer la notification",
    "delete-description": "Êtes-vous sûr de vouloir supprimer cette notification ?",
    high: "Haute",
    low: "Basse",
    default: "Normale",
  },
  de: {
    "delete-title": "Benachrichtigung löschen",
    "delete-description": "Sind Sie sicher, dass Sie diese Benachrichtigung löschen möchten?",
    high: "Hoch",
    low: "Niedrig",
    default: "Normal",
  },
}
