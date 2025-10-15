import { useAuth } from "@/features/auth/hooks/use-auth"
import { Api, service } from "@/services"
import { useSelectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A } from "@compo/utils"
import React from "react"
import { useLocation } from "wouter"
import adminUsersIdRouteTo from "./[userId]"
import { UsersContext } from "./context"
import { CreateUserDialog } from "./create"
import { AccountEditDialog } from "./edit.account"
import { ProfileEditDialog } from "./edit.profile"
import { useSwrUsers } from "./swr"

/**
 * provider
 */
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const isSuperadmin = me.role === "superadmin"
  const [, navigate] = useLocation()
  // swr
  const { users, metadata, total, swr } = useSwrUsers()

  // actions on user
  const [createUser, createUserProps] = Ui.useQuickDialog<void, Api.Admin.User>({
    mutate: async (user) => swr.append(user),
  })
  const display = (user: Api.User) => navigate(adminUsersIdRouteTo(user.id))
  const [editUser, editUserProps] = Ui.useQuickDialog<Api.Admin.User>({
    mutate: async (user) => swr.update(user),
  })
  const [editProfile, editProfileProps] = Ui.useQuickDialog<Api.Admin.User>({
    mutate: async (user) => swr.update(user),
  })
  const [deleteUser, deleteUserProps] = Ui.useConfirm<string>({
    onAsyncConfirm: async (id) => {
      const enoughRights = isSuperadmin || A.find(users, (user) => user.id === id)?.role !== "superadmin"
      if (!enoughRights) return true
      return match(await service.admin.users.id(id).destroy())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          if (data.user)
            swr.update(data.user) // soft delete
          else swr.rejectById(id)
          return false
        })
    },
    t: _.prefixed(`confirm.delete`),
  })
  const actionsOnUser = {
    create: createUser,
    display,
    edit: editUser,
    editProfile,
    delete: deleteUser,
  }

  // actions on selection
  const selectable = useSelectable<{ id: string }>()
  // update selection on data change
  React.useEffect(() => {
    selectable.keepOnly(users)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users])
  const [deleteSelection, deleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) => {
      const enoughRights = isSuperadmin || A.find(users, (user) => user.id === id)?.role !== "superadmin"
      if (!enoughRights) return true
      return match(await service.admin.users.id(id).destroy())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          if (data.user)
            swr.update(data.user) // soft delete
          else swr.rejectById(id)
          return false
        })
    },
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed(`confirm.delete-selection`),
  })
  const actionsOnSelection = {
    deleteSelection,
  }

  const context = {
    ...selectable,
    ...actionsOnUser,
    ...actionsOnSelection,
    users,
    metadata,
    total,
    swr,
  }
  return (
    <UsersContext.Provider value={context}>
      {children}
      <CreateUserDialog {...createUserProps} />
      <AccountEditDialog {...editUserProps} />
      <ProfileEditDialog {...editProfileProps} />
      <Ui.Confirm {...deleteUserProps} />
      <Ui.Confirm {...deleteSelectionProps} />
    </UsersContext.Provider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete user",
        success: "User has been deleted",
        error: "Error while deleting user",
        progress: "Deleting user",
      },
      "delete-selection": {
        title: "Delete selected users",
        success: "Users have been deleted",
        error: "Error while deleting users",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer l'utilisateur",
        success: "L'utilisateur a été supprimé",
        error: "Erreur lors de la suppression de l'utilisateur",
        progress: "Suppression de l'utilisateur en cours",
      },
      "delete-selection": {
        title: "Supprimer les utilisateurs sélectionnés",
        success: "Les utilisateurs ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Benutzer löschen",
        success: "Benutzer wurde gelöscht",
        error: "Fehler beim Löschen des Benutzers",
        progress: "Benutzer wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Benutzer löschen",
        success: "Ausgewählte Benutzer wurden gelöscht",
        error: "Fehler beim Löschen der ausgewählten Benutzer",
        progress: "Löschen von {{counter}} / {{total}}",
      },
    },
  },
}
