import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, D, placeholder, T } from "@compo/utils"
import { getCoreRowModel, Row, useReactTable } from "@tanstack/react-table"
import { CalendarPlus, Database, Glasses, GlobeIcon } from "lucide-react"
import React from "react"
import ShikiHighlighter from "react-shiki"
import { Link } from "wouter"
import adminUsersIdRouteTo from "../[userId]"
import { UserAvatar } from "../users.avatar"
import { GroupIcon } from "./logs.icons"
import { columns } from "./logs.table.columns"
import { logsStore, useLogsStore } from "./store"
import { getEventGroup } from "./utils"

/**
 * UsersTable
 * display a table of users with a menu and a checkbox (tanstack table)
 */
export const LogsTable: React.FC<{ logs: Api.Admin.SecurityLog[] }> = ({ logs }) => {
  const { _ } = useTranslation(dictionary)
  const columnSizing = Dashboard.useTableColumnSizing(useLogsStore(D.prop("columnSizing")), logsStore.actions.setColumnSizing)
  const table = useReactTable<DataItem>({
    data: logs,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: { columnSizing: columnSizing.state },
    onColumnSizingChange: columnSizing.onChange,
    defaultColumn: Dashboard.makeColumnSize(),
    initialState: {
      columnPinning: { right: ["metadata"] },
      columnSizing: columnSizing.initial,
    },
  })
  return (
    <Dashboard.Table.Tanstack table={table} t={_}>
      {(row) => <Dashboard.Table.Row key={row.id} item={row.original.user} cells={row.getVisibleCells()} />}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * prepare data and data types
 */
type DataItem = Api.Admin.SecurityLog
type ColumnProps = { row: Row<DataItem> }

/**
 * configure columns rendering
 */
export const ColumnEvent: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { event } = row.original
  const group = getEventGroup(event)
  return (
    <span className="inline-flex items-center gap-4 font-medium">
      <span className="bg-muted flex size-8 items-center justify-center rounded-md">
        <GroupIcon event={event} className="size-4" aria-hidden />
      </span>
      <Ui.Tooltip.Quick tooltip={`${group?.toUpperCase()} : ${event}`} className={variants.focusVisible({ className: "rounded" })}>
        {_(`events.${event}`)}
      </Ui.Tooltip.Quick>
    </span>
  )
}
export const ColumnIpAddress: React.FC<ColumnProps> = ({ row }) => {
  const { ipAddress } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <GlobeIcon className="size-4" aria-hidden />
      <span>{ipAddress}</span>
    </span>
  )
}
export const ColumnCreatedBy: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { user } = row.original
  if (!user)
    return (
      <div className="inline-flex items-center gap-2">
        <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
          <Glasses className="size-4" aria-hidden />
        </span>
        <span className="truncate font-medium">{_("created-by-unknown")}</span>
      </div>
    )
  const { firstname, lastname } = user.profile
  const fullname = placeholder(`${firstname} ${lastname}`, _("created-by-placeholder"))
  return (
    <div className="inline-flex items-center gap-2">
      <UserAvatar user={user} size="size-8" />
      <div className="space-y-.5">
        <Link to={adminUsersIdRouteTo(user.id)} className={cxm("truncate font-medium", variants.link())}>
          {fullname}
        </Link>
        <div className="text-muted-foreground text-xs">{user.email}</div>
      </div>
    </div>
  )
}
export const ColumnCreatedAt: React.FC<ColumnProps> = ({ row }) => {
  const { _, format } = useTranslation(dictionary)
  const { createdAt } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <CalendarPlus className="size-4" aria-hidden />
      <span>{format(T.parseISO(createdAt), "PPPpp")}</span>
    </span>
  )
}
export const ColumnMetadata: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { metadata } = row.original
  return (
    <Ui.HoverCard.Root>
      <span className="flex shrink-0 items-center justify-end">
        <Ui.HoverCard.Trigger asChild>
          <Ui.Button variant="outline" size="sm" className="inline-flex items-center gap-2">
            <Database aria-hidden />
            <Ui.SrOnly>{_("metadata-label")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.HoverCard.Trigger>
      </span>
      <Ui.HoverCard.Content
        className={cxm("w-max !bg-[--shiki-background] p-0", variants.scrollbar({ variant: "thin" }))}
        side="left"
        align="start"
        style={{ "--shiki-background": "#282a35" } as React.CSSProperties}
      >
        <ShikiHighlighter
          language="json"
          theme="dracula"
          className="h-max w-max text-xs leading-snug"
          style={{ padding: 0 }}
          langStyle={{ color: "white" }}
        >
          {JSON.stringify(metadata, null, 2)}
        </ShikiHighlighter>
      </Ui.HoverCard.Content>
    </Ui.HoverCard.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "event-label": "Type of event",
    "ip-address-label": "IP address",
    "created-by-label": "Related user",
    "created-by-unknown": "Unknown user",
    "created-by-placeholder": "Unnamed user",
    "created-at-label": "Related date",
    "metadata-label": "Metadata",
    events: {
      login_success: "Login success",
      login_failed: "Login failed",
      logout: "Logout",
      register: "Register",
      email_verified: "Email verified",
      password_reset_requested: "Password reset requested",
      password_reset_completed: "Password reset completed",
      email_change_requested: "Email change requested",
      email_change_completed: "Email change completed",
      account_locked: "Account locked",
      account_unlocked: "Account unlocked",
      account_updated: "Account updated",
      account_deleted: "Account deleted",
      session_created: "Session created",
      session_terminated: "Session terminated",
      profile_updated: "Profile updated",
      user_created: "User created",
      user_updated: "User updated",
      user_deleted: "User deleted",
      account_sign_in_as: "Role takeover",
    },
  },
  fr: {
    "event-label": "Type d'événement",
    "ip-address-label": "Adresse IP",
    "created-by-label": "Utilisateur concerné",
    "created-by-unknown": "Utilisateur inconnu",
    "created-by-placeholder": "Utilisateur anonyme",
    "created-at-label": "Date relative",
    "metadata-label": "Métadonnées",
    events: {
      login_success: "Connexion réussie",
      login_failed: "Connexion échouée",
      logout: "Déconnexion",
      register: "Inscription",
      email_verified: "Email vérifié",
      password_reset_requested: "Demande de réinitialisation de mot de passe",
      password_reset_completed: "Réinitialisation de mot de passe effectuée",
      email_change_requested: "Demande de changement d'email",
      email_change_completed: "Changement d'email effectué",
      account_locked: "Compte bloqué",
      account_unlocked: "Compte débloqué",
      account_updated: "Compte mis à jour",
      account_deleted: "Compte supprimé",
      session_created: "Session créée",
      session_terminated: "Session terminée",
      profile_updated: "Profil mis à jour",
      user_created: "Utilisateur créé",
      user_updated: "Utilisateur mis à jour",
      user_deleted: "Utilisateur supprimé",
      account_sign_in_as: "Prise de contrôle",
    },
  },
  de: {
    "event-label": "Ereignis-Typ",
    "ip-address-label": "IP-Adresse",
    "created-by-label": "Betroffener Benutzer",
    "created-by-unknown": "Unbekannter Benutzer",
    "created-by-placeholder": "Unbenannter Benutzer",
    "created-at-label": "Betroffenes Datum",
    "metadata-label": "Metadaten",
    events: {
      login_success: "Anmeldung erfolgreich",
      login_failed: "Anmeldung fehlgeschlagen",
      logout: "Abmeldung",
      register: "Registrierung",
      email_verified: "E-Mail verifiziert",
      password_reset_requested: "Passwort-Reset angefordert",
      password_reset_completed: "Passwort-Reset abgeschlossen",
      email_change_requested: "E-Mail-Änderung angefordert",
      email_change_completed: "E-Mail-Änderung abgeschlossen",
      account_locked: "Konto gesperrt",
      account_unlocked: "Konto entsperrt",
      account_updated: "Konto aktualisiert",
      account_deleted: "Konto gelöscht",
      session_created: "Sitzung erstellt",
      session_terminated: "Sitzung beendet",
      profile_updated: "Profil aktualisiert",
      user_created: "Benutzer erstellt",
      user_updated: "Benutzer aktualisiert",
      user_deleted: "Benutzer gelöscht",
      account_sign_in_as: "Rollenübernahme",
    },
  },
}
