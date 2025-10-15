import { useAuth } from "@/features/auth/hooks/use-auth"
import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A } from "@compo/utils"
import {
  SquareDashedMousePointerIcon,
  SquareMinusIcon,
  SquareMousePointerIcon,
  Trash2Icon,
  TrashIcon,
  UserCog,
  UserPen,
  UserPlusIcon,
} from "lucide-react"
import React from "react"
import { useUsers } from "./context"

/**
 * display the user menu
 */
export const UserMenu: React.FC<{ user: Api.Admin.User }> = ({ user }) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const isSuperadmin = me.role === "superadmin"
  const isMe = user.id === me.id
  const enoughRights = isSuperadmin || user.role !== "superadmin"
  const ctx = useUsers()

  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = React.useMemo(() => A.includes(ctx.selectedIds, user.id), [ctx.selectedIds, user.id])
  return (
    <>
      {isContextMenu && (
        <>
          {isSelected ? (
            <Ui.Menu.Item onClick={() => ctx.unselect({ id: user.id })}>
              <SquareDashedMousePointerIcon aria-hidden />
              {_("unselect")}
            </Ui.Menu.Item>
          ) : (
            <Ui.Menu.Item onClick={() => ctx.select({ id: user.id })}>
              <SquareMousePointerIcon aria-hidden />
              {_("select")}
            </Ui.Menu.Item>
          )}
        </>
      )}
      <Ui.Menu.Item onClick={() => ctx.edit(user)}>
        <UserCog aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editProfile(user)}>
        <UserPen aria-hidden />
        {_("edit-profile")}
      </Ui.Menu.Item>
      {enoughRights && (
        <>
          {user.status === "deleted" ? (
            <Ui.Menu.Item onClick={() => ctx.delete(user.id)}>
              <Trash2Icon aria-hidden />
              {_("delete-permanently")}
            </Ui.Menu.Item>
          ) : (
            <Ui.Menu.Item onClick={() => ctx.delete(user.id)}>
              <TrashIcon aria-hidden />
              {_("delete")}
            </Ui.Menu.Item>
          )}
        </>
      )}
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.create()}>
            <UserPlusIcon aria-hidden />
            {_("create")}
          </Ui.Menu.Item>
          {isSelected && enoughRights && (
            <>
              <Ui.Menu.Separator />
              {user.status === "deleted" ? (
                <Ui.Menu.Item onClick={() => ctx.deleteSelection()}>
                  <Trash2Icon aria-hidden />
                  {_("delete-permanently-selection")}
                </Ui.Menu.Item>
              ) : (
                <Ui.Menu.Item onClick={() => ctx.deleteSelection()}>
                  <SquareMinusIcon aria-hidden />
                  {_("delete-selection")}
                </Ui.Menu.Item>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    select: "Select",
    unselect: "Unselect",
    edit: "Edit account",
    "edit-profile": "Edit profile",
    delete: "Delete this user",
    "delete-permanently": "Delete permanently this user",
    create: "Add a new user",
    "delete-selection": "Delete selected users",
    "delete-permanently-selection": "Delete permanently selected users",
  },
  fr: {
    select: "Sélectionner",
    unselect: "Désélectionner",
    edit: "Modifier le compte",
    "edit-profile": "Modifier le profil",
    delete: "Supprimer cet utilisateur",
    "delete-permanently": "Supprimer définitivement cet utilisateur",
    create: "Ajouter un nouvel utilisateur",
    "delete-selection": "Supprimer les utilisateurs sélectionnés",
    "delete-permanently-selection": "Supprimer définitivement les utilisateurs sélectionnés",
  },
  de: {
    select: "Auswählen",
    unselect: "Abwählen",
    edit: "Konto bearbeiten",
    "edit-profile": "Profil bearbeiten",
    delete: "Diesen Benutzer löschen",
    "delete-permanently": "Diesen Benutzer endgültig löschen",
    create: "Neuen Benutzer hinzufügen",
    "delete-selection": "Ausgewählte Benutzer löschen",
    "delete-permanently-selection": "Ausgewählte Benutzer endgültig löschen",
  },
}
