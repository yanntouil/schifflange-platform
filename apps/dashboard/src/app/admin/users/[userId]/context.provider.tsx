import signInRouteTo from "@/app/sign-in"
import { authStore } from "@/features/auth"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Api, Payload, service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, match } from "@compo/utils"
import React from "react"
import { useLocation } from "wouter"
import adminUsersRouteTo from ".."
import { AccountEditDialog } from "../edit.account"
import { ProfileEditDialog } from "../edit.profile"
import { UserContext } from "./context"
import { useSwrUser } from "./swr"

/**
 * provider
 */
export const UserProvider: React.FC<{ children: React.ReactNode; user: Api.Admin.User; swr: ReturnType<typeof useSwrUser>["swr"] }> = ({
  children,
  user,
  swr,
}) => {
  const { _ } = useTranslation(dictionary)
  const { me, session } = useAuth()
  const isSuperadmin = me.role === "superadmin"

  // actions on user
  const [, navigate] = useLocation()
  const [editUser, editUserProps] = Ui.useQuickDialog<Api.Admin.User>({
    mutate: async (user) => swr.update(user),
  })
  const [editProfile, editProfileProps] = Ui.useQuickDialog<Api.Admin.User>({
    mutate: async (user) => swr.update(user),
  })
  const sendInvitation = React.useCallback(
    async (invitationType: Payload.Admin.Users.SendInvitation["invitationType"]) => {
      match(await service.admin.users.id(user.id).sendInvitation({ invitationType }))
        .with({ failed: true }, () => Ui.toast.error(_("invitation-error")))
        .otherwise(() => {
          Ui.toast.success(_("invitation-success"))
        })
    },
    [user.id, _]
  )

  const signInAs = React.useCallback(async () => {
    match(await service.admin.users.id(user.id).signInAs())
      .with({ failed: true }, () => Ui.toast.error(_("sign-in-as-error")))
      .otherwise(({ data }) => authStore.actions.login(data))
  }, [user.id, _])
  const revokeSession = React.useCallback(
    async (sessionId: string) => {
      // in case admin update his own session, we need to logout
      if (sessionId === session.id) {
        const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm.logout") })
        if (!isConfirm) return
        await authStore.actions.logout()
        navigate(signInRouteTo())
      } else {
        await service.admin.users.id(user.id).deactivateSession(sessionId)
        swr.rejectSession(sessionId)
      }
    },
    [swr, user.id, session.id, _, navigate]
  )
  const revokeAllSessions = React.useCallback(async () => {
    // revoke all sessions except in case admin update his own session
    await Promise.all(
      A.map(user.sessions, async (s) => {
        if (s.id !== session.id) {
          await service.admin.users.id(user.id).deactivateSession(s.id)
          swr.rejectSession(s.id)
        }
      })
    )
  }, [user.sessions, user.id, session.id, swr])
  const [deleteUser, deleteUserProps] = Ui.useConfirm({
    onAsyncConfirm: async () => {
      const enoughRights = isSuperadmin || user?.role !== "superadmin"
      if (!enoughRights) return true
      return match(await service.admin.users.id(user.id).destroy())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          if (data.user)
            swr.update(data.user) // soft delete
          else navigate(adminUsersRouteTo())
          return false
        })
    },
    t: _.prefixed(`confirm.delete`),
  })

  const handleEditProfile = React.useCallback(() => {
    editProfile(user)
  }, [editProfile, user])

  const context = {
    edit: () => editUser(user),
    editProfile: handleEditProfile,
    delete: () => deleteUser(true),
    sendInvitation,
    signInAs,
    revokeAllSessions,
    revokeSession,
    user,
    swr,
  }
  return (
    <UserContext.Provider value={context}>
      {children}
      <AccountEditDialog {...editUserProps} />
      <ProfileEditDialog {...editProfileProps} />
      <Ui.Confirm {...deleteUserProps} />
    </UserContext.Provider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "update-success": "The user has been updated",
    "update-error": "Error when updating the user",
    "invitation-success": "The invitation has been sent",
    "invitation-error": "Error when sending the invitation",
    "sign-in-as-error": "Error when signing in as user",
    confirm: {
      delete: {
        title: "Delete user",
        success: "User has been deleted",
        error: "Error while deleting user",
        progress: "Deleting user",
      },
      logout: {
        title: "Confirmation de déconnexion",
        description: "Vous allez être déconnecté de votre session. Voulez-vous vraiment continuer?",
        cancel: "Annuler",
        confirm: "Confirmer",
      },
    },
  },
  fr: {
    "update-success": "L'utilisateur a été mis à jour",
    "update-error": "Erreur lors de la mise à jour de l'utilisateur",
    "invitation-success": "L'invitation a été envoyée",
    "invitation-error": "Erreur lors de l'envoi de l'invitation",
    confirm: {
      delete: {
        title: "Supprimer l'utilisateur",
        success: "L'utilisateur a été supprimé",
        error: "Erreur lors de la suppression de l'utilisateur",
        progress: "Suppression de l'utilisateur en cours",
      },
      logout: {
        title: "Confirmation de déconnexion",
        description: "Vous allez être déconnecté de votre session. Voulez-vous vraiment continuer?",
        cancel: "Annuler",
        confirm: "Confirmer",
      },
    },
  },
  de: {
    "update-success": "Der Benutzer wurde aktualisiert",
    "update-error": "Fehler beim Aktualisieren des Benutzers",
    "invitation-success": "Die Einladung wurde versendet",
    "invitation-error": "Fehler beim Versenden der Einladung",
    "sign-in-as-error": "Fehler beim Anmelden als Benutzer",
    confirm: {
      delete: {
        title: "Benutzer löschen",
        success: "Benutzer wurde gelöscht",
        error: "Fehler beim Löschen des Benutzers",
        progress: "Benutzer wird gelöscht",
      },
      logout: {
        title: "Abmeldung bestätigen",
        description: "Sie werden von Ihrer Sitzung abgemeldet. Möchten Sie wirklich fortfahren?",
        cancel: "Abbrechen",
        confirm: "Bestätigen",
      },
    },
  },
}
