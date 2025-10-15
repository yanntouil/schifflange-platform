import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, T, pipe } from "@compo/utils"
import { CalendarArrowUp, CalendarClock, CalendarPlus2, Shield } from "lucide-react"
import React from "react"
import { useUser } from "./context"

/**
 * UserAccount
 * display the account information of the user
 */
export const UserAccount: React.FC = () => {
  const { _, format } = useTranslation(dictionary)
  const { user } = useUser()
  const sessions = React.useMemo(
    () =>
      pipe(
        user.sessions ?? [],
        A.filter(D.prop("isActive")),
        A.sort((a, b) => (T.isBefore(b.lastActivity, a.lastActivity) ? -1 : 1))
      ),
    [user.sessions]
  )
  const lastActivity = A.head(sessions)?.lastActivity
  return (
    <Ui.Card.Root>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("account-title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("account-description")}</Ui.Card.Description>
      </Ui.Card.Header>

      <Ui.Card.Content>
        <Dashboard.Field.Root variant="default" size="sm" divider={true}>
          <Dashboard.Field.Item name={_("account-role")} icon={<Shield aria-hidden />} value={_(`role-${user.role}`)} />
          <Dashboard.Field.Item
            name={_("account-created-at")}
            icon={<CalendarPlus2 aria-hidden />}
            value={format(T.parseISO(user.createdAt), "PPPp")}
          />
          <Dashboard.Field.Item
            name={_("account-updated-at")}
            icon={<CalendarClock aria-hidden />}
            value={format(T.parseISO(user.updatedAt), "PPPp")}
          />
          <Dashboard.Field.Item
            name={_("account-last-login-at")}
            icon={<CalendarArrowUp aria-hidden />}
            value={lastActivity ? format(T.parseISO(lastActivity), "PPPp") : _("never")}
          />
        </Dashboard.Field.Root>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "role-member": "Membre",
    "role-admin": "Administrateur",
    "role-superadmin": "Développeur",
    never: "Jamais",
    "account-title": "Information relative au compte",
    "account-description": "Ces informations sont utilisées pour la connexion à l'application.",
    "account-role": "Rôle",
    "account-created-at": "Création du compte",
    "account-updated-at": "Dernière mise à jour",
    "account-last-login-at": "Dernière connexion",
  },
  en: {
    "role-member": "Member",
    "role-admin": "Administrator",
    "role-superadmin": "Developer",
    never: "Never",
    "account-title": "Account information",
    "account-description": "These informations are used for the login to the application.",
    "account-role": "Role",
    "account-created-at": "Creation date",
    "account-updated-at": "Last update",
    "account-last-login-at": "Last login",
  },
  de: {
    "role-member": "Mitglied",
    "role-admin": "Administrator",
    "role-superadmin": "Entwickler",
    never: "Niemals",
    "account-title": "Kontoinformationen",
    "account-description": "Diese Informationen werden für die Anmeldung in der Anwendung verwendet.",
    "account-role": "Rolle",
    "account-created-at": "Erstellungsdatum",
    "account-updated-at": "Letzte Aktualisierung",
    "account-last-login-at": "Letzte Anmeldung",
  },
}
