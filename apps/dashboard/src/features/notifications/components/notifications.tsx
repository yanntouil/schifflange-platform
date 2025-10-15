import { notificationStore, useNotificationStore } from "@/features/notifications/store"
import { service } from "@/services"
import { useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Bell, Check, Trash2 } from "lucide-react"
import React from "react"
import { NotificationDispatcher } from "./notification-dispatcher"

/**
 * display list of notifications in user notifications dialog
 */
export const Notifications: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { notifications, unreadCount } = useNotificationStore()
  const { isLoading, mutate } = useSWR(
    {
      fetch: () => service.notifications.list(),
      key: "notifications",
    },
    {
      fallbackData: {
        notifications: [],
        metadata: service.fallbackMetadata,
        total: 0,
      },
      onSuccess: (data) => {
        // Populate store with SWR data
        notificationStore.actions.loadNotifications(data.notifications)
      },
    }
  )

  // Actions
  const markAllAsRead = async () => {
    const result = await service.notifications.markAllAsRead()
    if (result.ok) {
      notificationStore.actions.markAllAsRead()
      mutate()
    }
  }

  const [confirmedDeleteAll, deleteAllProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () => {
      return match(await service.notifications.destroyAll())
        .with({ failed: true }, () => true)
        .otherwise(() => {
          notificationStore.actions.loadNotifications([])
          mutate((data) => data && { ...data, notifications: [] }, { revalidate: true })
          return false
        })
    },
    t: _.prefixed(`confirm.delete-all`),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Ui.Spinner />
      </div>
    )
  }

  const notificationsList = notifications

  return (
    <div className="space-y-4">
      {/* Header avec stats et actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="size-4" />
          <span className="text-muted-foreground text-sm">
            {unreadCount > 0 ? _("unread-count", { count: unreadCount }) : _("all-read")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Ui.Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              <Check className="mr-1 size-3" />
              {_("mark-all-read")}
            </Ui.Button>
          )}

          {notificationsList.length > 0 && (
            <Ui.Button
              variant="ghost"
              size="sm"
              onClick={() => confirmedDeleteAll()}
              className="text-destructive hover:text-destructive text-xs"
            >
              <Trash2 className="mr-1 size-3" />
              {_("delete-all")}
            </Ui.Button>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="max-h-[400px] divide-y overflow-y-auto [&>*:first-child]:rounded-t [&>*:last-child]:rounded-b">
        {notificationsList.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <Bell className="mx-auto mb-2 size-8 opacity-50" />
            <p>{_("no-notifications")}</p>
          </div>
        ) : (
          notificationsList.map((notification) => (
            <NotificationDispatcher key={notification.id} notification={notification} onUpdate={mutate} />
          ))
        )}
      </div>
      <Ui.Confirm {...deleteAllProps} />
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "unread-count": "{{count}} unread notifications",
    "all-read": "All notifications read",
    "mark-all-read": "Mark all as read",
    confirm: {
      "delete-all": {
        title: "Delete all notifications",
        description: "Are you sure you want to delete all notifications? This action cannot be undone.",
        success: "All notifications have been deleted",
        error: "Error while deleting all notifications",
        progress: "Deleting workspace",
      },
    },
    "no-notifications": "No notifications yet",
  },
  fr: {
    "unread-count": "{{count}} notifications non lues",
    "all-read": "Toutes les notifications sont lues",
    "mark-all-read": "Tout marquer comme lu",
    confirm: {
      "delete-all": {
        title: "Supprimer toutes les notifications",
        description: "Êtes-vous sûr de vouloir supprimer toutes les notifications ? Cette action est irréversible.",
        success: "Toutes les notifications ont été supprimées",
        error: "Erreur lors de la suppression des notifications",
        progress: "Suppression des notifications",
      },
    },

    "no-notifications": "Aucune notification pour le moment",
  },
  de: {
    "unread-count": "{{count}} ungelesene Benachrichtigungen",
    "all-read": "Alle Benachrichtigungen gelesen",
    "mark-all-read": "Alle als gelesen markieren",
    confirm: {
      "delete-all": {
        title: "Alle Benachrichtigungen löschen",
        description:
          "Sind Sie sicher, dass Sie alle Benachrichtigungen löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
        success: "Alle Benachrichtigungen wurden gelöscht",
        error: "Fehler beim Löschen aller Benachrichtigungen",
        progress: "Löschen der Benachrichtigungen",
      },
    },
    "no-notifications": "Keine Benachrichtigungen",
  },
}
