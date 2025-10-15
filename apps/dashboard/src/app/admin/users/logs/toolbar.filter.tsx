import { Query } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, NonNullableRecord } from "@compo/utils"
import { FilterIcon, FunnelX, User2Icon } from "lucide-react"
import React from "react"
import { eventGuard, securityEventsGrouped } from "./utils"

type FilterBy = NonNullableRecord<Query.Admin.Users.SecurityLogs>["filterBy"]
/**
 * Admin users toolbar sort
 */
type ToolbarFilterProps = {
  filterBy: FilterBy
  setFilterBy: (filterBy: FilterBy) => void
  resetFilterBy: () => void
}

export const ToolbarFilter: React.FC<ToolbarFilterProps> = ({ filterBy, setFilterBy, resetFilterBy }) => {
  const { _ } = useTranslation(dictionary)
  const { size: toolbarSize } = Dashboard.useToolbar()

  // status
  const onEventChange = (event: string) => {
    const typedEvent = eventGuard(event) ? event : undefined
    setFilterBy({ ...filterBy, event: typedEvent })
  }

  const selectedEvent = filterBy.event ? _(`event-${filterBy.event}`) : _("event-all")

  return (
    <Ui.DropdownMenu.Root>
      <Ui.Tooltip.Quick asChild tooltip={_("tooltip", { selectedEvent })} side="top" align="center">
        <Ui.DropdownMenu.Trigger asChild>
          <Ui.Button variant="outline" icon size={toolbarSize}>
            <FilterIcon />
          </Ui.Button>
        </Ui.DropdownMenu.Trigger>
      </Ui.Tooltip.Quick>
      <Ui.DropdownMenu.Content side="left" align="start">
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>
            <User2Icon aria-hidden />
            {_("event-label", { selectedEvent })}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent className="isolate z-10">
            <Ui.DropdownMenu.RadioGroup value={filterBy.event} onValueChange={onEventChange}>
              {A.map(D.toPairs(securityEventsGrouped), ([group, events]) => (
                <Ui.DropdownMenu.Sub key={group}>
                  <Ui.DropdownMenu.SubTrigger>{_(`event-${group}`)}</Ui.DropdownMenu.SubTrigger>
                  <Ui.DropdownMenu.SubContent>
                    {events.map((event) => (
                      <Ui.DropdownMenu.RadioItem key={event} value={event}>
                        {_(`event-${event}`)}
                      </Ui.DropdownMenu.RadioItem>
                    ))}
                  </Ui.DropdownMenu.SubContent>
                </Ui.DropdownMenu.Sub>
              ))}
            </Ui.DropdownMenu.RadioGroup>
          </Ui.DropdownMenu.SubContent>
        </Ui.DropdownMenu.Sub>

        <Ui.DropdownMenu.Separator />
        <Ui.DropdownMenu.Item onClick={resetFilterBy}>
          <FunnelX />
          {_("reset-all")}
        </Ui.DropdownMenu.Item>
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    tooltip: "Displaying {{selectedEvent}}",
    "event-label": "Event: {{selectedEvent}}",
    "event-all": "all events",
    "reset-all": "Reset all filters",
    "event-auth": "Authentication",
    "event-email": "Email",
    "event-password": "Password",
    "event-accountStatus": "Account status",
    "event-accountActivity": "Account activity",
    "event-session": "Session",
    "event-userManagement": "User management",
    "event-login_success": "Login success",
    "event-login_failed": "Login failed",
    "event-logout": "Logout",
    "event-register": "Register",
    "event-email_verified": "Email verified",
    "event-password_reset_requested": "Password reset requested",
    "event-password_reset_completed": "Password reset completed",
    "event-email_change_requested": "Email change requested",
    "event-email_change_completed": "Email change completed",
    "event-account_locked": "Account locked",
    "event-account_unlocked": "Account unlocked",
    "event-account_updated": "Account updated",
    "event-account_deleted": "Account deleted",
    "event-session_created": "Session created",
    "event-session_terminated": "Session terminated",
    "event-profile_updated": "Profile updated",
    "event-user_created": "User created",
    "event-user_updated": "User updated",
    "event-user_deleted": "User deleted",
    "event-adminManagement": "Admin management",
    "event-account_sign_in_as": "Role takeover",
  },
  fr: {
    tooltip: "Afficher {{selectedEvent}}",
    "event-label": "Événement: {{selectedEvent}}",
    "event-all": "tous les événements",
    "reset-all": "Réinitialiser tous les filtres",
    "event-auth": "Authentification",
    "event-email": "Email",
    "event-password": "Mot de passe",
    "event-accountStatus": "Statut du compte",
    "event-accountActivity": "Activité du compte",
    "event-session": "Session",
    "event-userManagement": "Gestion des utilisateurs",
    "event-login_success": "Connexion réussie",
    "event-login_failed": "Connexion échouée",
    "event-logout": "Déconnexion",
    "event-register": "Inscription",
    "event-email_verified": "Email vérifié",
    "event-password_reset_requested": "Demande de réinitialisation de mot de passe",
    "event-password_reset_completed": "Réinitialisation de mot de passe terminée",
    "event-email_change_requested": "Demande de changement d'email",
    "event-email_change_completed": "Changement d'email terminé",
    "event-account_locked": "Compte bloqué",
    "event-account_unlocked": "Compte débloqué",
    "event-account_updated": "Compte mis à jour",
    "event-account_deleted": "Compte supprimé",
    "event-session_created": "Session créée",
    "event-session_terminated": "Session terminée",
    "event-profile_updated": "Profil mis à jour",
    "event-user_created": "Utilisateur créé",
    "event-user_updated": "Utilisateur mis à jour",
    "event-user_deleted": "Utilisateur supprimé",
    "event-adminManagement": "Gestion des administrateurs",
    "event-account_sign_in_as": "Prise de contrôle",
  },
  de: {
    tooltip: "Anzeigen von {{selectedEvent}}",
    "event-label": "Ereignis: {{selectedEvent}}",
    "event-all": "alle Ereignisse",
    "reset-all": "Alle Filter zurücksetzen",
    "event-auth": "Authentifizierung",
    "event-email": "E-Mail",
    "event-password": "Passwort",
    "event-accountStatus": "Kontostatus",
    "event-accountActivity": "Kontoaktivität",
    "event-session": "Sitzung",
    "event-userManagement": "Benutzerverwaltung",
    "event-login_success": "Anmeldung erfolgreich",
    "event-login_failed": "Anmeldung fehlgeschlagen",
    "event-logout": "Abmeldung",
    "event-register": "Registrierung",
    "event-email_verified": "E-Mail verifiziert",
    "event-password_reset_requested": "Passwort-Reset angefordert",
    "event-password_reset_completed": "Passwort-Reset abgeschlossen",
    "event-email_change_requested": "E-Mail-Änderung angefordert",
    "event-email_change_completed": "E-Mail-Änderung abgeschlossen",
    "event-account_locked": "Konto gesperrt",
    "event-account_unlocked": "Konto entsperrt",
    "event-account_updated": "Konto aktualisiert",
    "event-account_deleted": "Konto gelöscht",
    "event-session_created": "Sitzung erstellt",
    "event-session_terminated": "Sitzung beendet",
    "event-profile_updated": "Profil aktualisiert",
    "event-user_created": "Benutzer erstellt",
    "event-user_updated": "Benutzer aktualisiert",
    "event-user_deleted": "Benutzer gelöscht",
    "event-adminManagement": "Administrator-Verwaltung",
    "event-account_sign_in_as": "Rollenübernahme",
  },
}
