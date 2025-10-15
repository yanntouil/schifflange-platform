import { useAuth } from "@/features/auth/hooks/use-auth"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { LogIn, LogOut, MailCheck, RotateCcwKey, SendHorizontal, Trash2Icon, TrashIcon, UserCog, UserPen, UserPlus } from "lucide-react"
import React from "react"
import { useUser } from "./context"

/**
 * UserMenu
 * display the menu of the user
 */
export const UserMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const { user, ...ctx } = useUser()
  const isSuperadmin = me.role === "superadmin"
  const isMe = user.id === me.id
  const enoughRights = isSuperadmin || user.role !== "superadmin"
  return (
    <>
      <Ui.Menu.Item onClick={ctx.edit}>
        <UserCog aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={ctx.editProfile}>
        <UserPen aria-hidden />
        {_("edit-profile")}
      </Ui.Menu.Item>
      {!isMe && (
        <>
          <Ui.Menu.Sub>
            <Ui.Menu.SubTrigger>
              <SendHorizontal aria-hidden />
              {_("send-invitation")}
            </Ui.Menu.SubTrigger>
            <Ui.Menu.Portal>
              <Ui.Menu.SubContent>
                <Ui.Menu.Item onClick={() => ctx.sendInvitation("welcome")}>
                  <UserPlus aria-hidden />
                  {_("send-invitation-welcome")}
                </Ui.Menu.Item>
                <Ui.Menu.Item onClick={() => ctx.sendInvitation("authentication")}>
                  <LogIn aria-hidden />
                  {_("send-invitation-authentication")}
                </Ui.Menu.Item>
                <Ui.Menu.Item onClick={() => ctx.sendInvitation("password-reset")}>
                  <RotateCcwKey aria-hidden />
                  {_("send-invitation-password-reset")}
                </Ui.Menu.Item>
                <Ui.Menu.Item onClick={() => ctx.sendInvitation("email-change")}>
                  <MailCheck aria-hidden />
                  {_("send-invitation-email-change")}
                </Ui.Menu.Item>
              </Ui.Menu.SubContent>
            </Ui.Menu.Portal>
          </Ui.Menu.Sub>
          {isSuperadmin && (
            <Ui.Menu.Item onClick={ctx.signInAs} className="text-orange-700">
              <LogIn aria-hidden />
              {_("sign-in-as", { firstName: placeholder(user.profile.firstname, _("user-placeholder")) })}
            </Ui.Menu.Item>
          )}
        </>
      )}

      <Ui.Menu.Item onClick={() => ctx.revokeAllSessions()}>
        <LogOut aria-hidden />
        {_("revoke-all-sessions")}
      </Ui.Menu.Item>
      {enoughRights && (
        <>
          {user.status === "deleted" ? (
            <Ui.Menu.Item onClick={() => ctx.delete()}>
              <Trash2Icon aria-hidden />
              {_("delete-permanently")}
            </Ui.Menu.Item>
          ) : (
            <Ui.Menu.Item onClick={() => ctx.delete()}>
              <TrashIcon aria-hidden />
              {_("delete")}
            </Ui.Menu.Item>
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
    "user-placeholder": "this user",
    edit: "Edit account",
    "edit-profile": "Edit profile",
    "send-invitation": "Send email",
    "send-invitation-password-reset": "Password reset request",
    "send-invitation-email-change": "Email change request",
    "send-invitation-welcome": "Welcome email",
    "send-invitation-authentication": "Authentication email",
    "sign-in-as": "Sign in as {{firstName}}",
    delete: "Delete this user",
    "delete-permanently": "Delete permanently this user",
    "revoke-all-sessions": "Revoke all sessions",
  },
  fr: {
    "user-placeholder": "cet utilisateur",
    edit: "Modifier le compte",
    "edit-profile": "Modifier le profil",
    "send-invitation": "Envoyer un mail",
    "send-invitation-password-reset": "Réinitialisation de mot de passe",
    "send-invitation-email-change": "Requête de validation d'email",
    "send-invitation-welcome": "Mail de bienvenue",
    "send-invitation-authentication": "Mail d'authentification",
    "sign-in-as": "Se connecter en tant que {{firstName}}",
    delete: "Supprimer cet utilisateur",
    "delete-permanently": "Supprimer définitivement cet utilisateur",
    "revoke-all-sessions": "Déconnecter toutes les sessions",
  },
  de: {
    "user-placeholder": "dieser Benutzer",
    edit: "Konto bearbeiten",
    "edit-profile": "Profil bearbeiten",
    "send-invitation": "E-Mail senden",
    "send-invitation-password-reset": "Passwort-Reset-Anfrage",
    "send-invitation-email-change": "E-Mail-Änderungs-Anfrage",
    "send-invitation-welcome": "Willkommens-E-Mail",
    "send-invitation-authentication": "Authentifizierungs-E-Mail",
    "sign-in-as": "Als {{firstName}} anmelden",
    delete: "Diesen Benutzer löschen",
    "delete-permanently": "Diesen Benutzer dauerhaft löschen",
    "revoke-all-sessions": "Alle Sitzungen widerrufen",
  },
}
