import { authStore } from "@/features/auth"
import { notificationStore } from "@/features/notifications/store"
import { Api, service } from "@/services"
import { match } from "@compo/utils"
import { Bell, Settings, Trash2, UserPlus, Users, UserX } from "lucide-react"
import { toast } from "sonner"

/**
 * Notification Toast
 * Display notification as toast message
 */
export const notificationToast = (notification: Api.Notification) => {
  const icon = match(notification.type)
    .with("invitation-to-join-workspace", () => <UserPlus className="size-4" />)
    .with("workspace-updated", "workspace-deleted", () => <Settings className="size-4" />)
    .with("workspace-member-updated", "workspace-member-attached", () => <Users className="size-4" />)
    .with("workspace-member-removed", "workspace-member-left", () => <UserX className="size-4" />)
    .with("account-updated", "account-profile-updated", () => <Settings className="size-4" />)
    .with("account-deleted", "account-takeover", () => <Trash2 className="size-4" />)
    .otherwise(() => <Bell className="size-4" />)

  const { title, description } = getNotificationContent(notification)

  const toastFn = match(notification.priority)
    .with("high", () => toast.error)
    .with("low", () => toast.info)
    .otherwise(() => toast)

  return toastFn(title, {
    description,
    icon,
    duration: Infinity, // stay visible until dismissed manually
    action: {
      label: "Voir",
      onClick: () => {
        // open notifications
        authStore.actions.openNotifications()
        // remove from dismiss tracking (will auto-dismiss)
        notificationStore.actions.removeDismiss(notification.id)
      },
    },
    cancel: {
      label: "Marquer comme lu",
      onClick: async () => {
        // mark as read
        await service.notifications.markAsRead(notification.id)
        notificationStore.actions.markAsRead(notification.id)
      },
    },
  })
}

/**
 * Get notification content based on type and metadata
 */
const getNotificationContent = (notification: Api.Notification) => {
  return match(notification)
    .with({ type: "invitation-to-join-workspace" }, (n) => ({
      title: "Invitation à rejoindre un workspace",
      description: `${n.metadata.senderProfile.firstname} ${n.metadata.senderProfile.lastname} vous invite à rejoindre "${n.workspace?.name}"`,
    }))
    .with({ type: "workspace-updated" }, (n) => ({
      title: "Workspace mis à jour",
      description: `"${n.workspace?.name}" a été modifié par ${n.metadata.updatedByProfile.firstname} ${n.metadata.updatedByProfile.lastname}`,
    }))
    .with({ type: "workspace-deleted" }, (n) => ({
      title: "Workspace supprimé",
      description: `"${n.workspace?.name}" a été supprimé par ${n.metadata.deletedByProfile.firstname} ${n.metadata.deletedByProfile.lastname}`,
    }))
    .with({ type: "workspace-member-updated" }, (n) => ({
      title: "Membre mis à jour",
      description: `Vos permissions dans "${n.workspace?.name}" ont été modifiées`,
    }))
    .with({ type: "workspace-member-removed" }, (n) => ({
      title: "Retiré du workspace",
      description: `Vous avez été retiré de "${n.workspace?.name}"`,
    }))
    .with({ type: "workspace-member-left" }, (n) => ({
      title: "Membre a quitté",
      description: `${n.metadata.leftByProfile.firstname} ${n.metadata.leftByProfile.lastname} a quitté "${n.workspace?.name}"`,
    }))
    .with({ type: "workspace-member-attached" }, (n) => ({
      title: "Nouveau membre",
      description: `${n.metadata.attachedByProfile.firstname} ${n.metadata.attachedByProfile.lastname} a rejoint "${n.workspace?.name}"`,
    }))
    .with({ type: "account-updated" }, () => ({
      title: "Compte mis à jour",
      description: "Votre compte a été modifié",
    }))
    .with({ type: "account-profile-updated" }, () => ({
      title: "Profil mis à jour",
      description: "Votre profil a été modifié",
    }))
    .with({ type: "account-deleted" }, () => ({
      title: "Compte supprimé",
      description: "Votre compte a été supprimé",
    }))
    .with({ type: "account-takeover" }, () => ({
      title: "Connexion suspecte",
      description: "Une connexion à votre compte a été détectée",
    }))
    .otherwise(() => ({
      title: "Notification",
      description: "Vous avez reçu une nouvelle notification",
    }))
}
