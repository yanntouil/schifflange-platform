import { useAuth } from "@/features/auth/hooks/use-auth"
import { Api } from "@/services"
import { decorateStore } from "@/utils/zustand"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, O, pipe, T } from "@compo/utils"
import { ColumnDef, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table"
import { ClockIcon, GlobeIcon, Laptop, MonitorIcon, Smartphone, Tablet, Trash2Icon } from "lucide-react"
import React from "react"
import { create } from "zustand"
import { useUser } from "./context"

/**
 * UserSessions
 * display the sessions of the user
 */
export const UserSessions: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { user, revokeAllSessions, revokeSession } = useUser()

  const columnSizing = Dashboard.useTableColumnSizing(sessionsStore.use(D.prop("columnSizing")), sessionsStore.actions.setColumnSizing)

  const sessions = useData(user.sessions)
  const table = useReactTable<DataItem>({
    data: sessions,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnSizing: columnSizing.state,
    },
    onColumnSizingChange: columnSizing.onChange,
    initialState: {
      columnPinning: {
        right: ["revoke"],
      },
      columnSizing: columnSizing.initial,
    },
  })

  return (
    <Ui.Card.Root>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>

      <Ui.Card.Content>
        <div className="mb-4 flex items-center justify-between border p-6">
          <div>
            <Ui.Hn level={3} className="text-sm font-medium">
              {_("revoke-all-title")}
            </Ui.Hn>
            <p className="text-muted-foreground text-xs">{_("revoke-all-description")}</p>
          </div>
          <Ui.Button variant="outline" size="sm" onClick={revokeAllSessions}>
            {_("revoke-all-button")}
          </Ui.Button>
        </div>
        <Dashboard.Table.Tanstack
          table={table}
          t={_}
          // fixed
          classNames={{
            wrapper: "relative isolate max-h-96 overflow-y-auto",
            headerRow: "sticky z-10 top-0 bg-card/90 backdrop-blur-sm",
          }}
        >
          {(row) => <Dashboard.Table.Row key={row.id} item={row.original} cells={row.getVisibleCells()} />}
        </Dashboard.Table.Tanstack>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}
/**
 * prepare data and data types
 */
const useData = (sessions: Api.Admin.User["sessions"]) => {
  const { _ } = useTranslation(dictionary)
  return React.useMemo(
    () =>
      pipe(
        sessions,
        A.filterMap((session) =>
          session.isActive
            ? O.Some({
                id: session.id,
                ip: session.ipAddress,
                lastActivity: T.parseISO(session.lastActivity),
                device: prettifyDeviceInfo(session.deviceInfo, _("unknown-device")),
                DeviceIcon: match(session.deviceInfo.device?.type?.toLowerCase())
                  .with("desktop", () => Laptop)
                  .with("mobile", () => Smartphone)
                  .with("tablet", () => Tablet)
                  .otherwise(() => MonitorIcon),
              })
            : O.None
        ),
        A.sort((a, b) => (T.isBefore(b.lastActivity, a.lastActivity) ? -1 : 1))
      ),
    [sessions, _]
  )
}
type DataItem = ReturnType<typeof useData>[number]
type ColumnProps = { row: Row<DataItem> }

/**
 * configure columns rendering
 */
const ColumnDevice: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { session } = useAuth()
  const { DeviceIcon, device } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <DeviceIcon className="size-4" aria-hidden />
      <span>{device}</span>
      {session.id === row.original.id && <Ui.Badge>{_("current-session")}</Ui.Badge>}
    </span>
  )
}
const ColumnIp: React.FC<ColumnProps> = ({ row }) => {
  const { ip } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <GlobeIcon className="size-4" aria-hidden />
      <span>{ip}</span>
    </span>
  )
}
const ColumnLastActivity: React.FC<ColumnProps> = ({ row }) => {
  const { _, format } = useTranslation(dictionary)
  const { lastActivity } = row.original
  return (
    <span className="inline-flex items-center gap-2">
      <ClockIcon className="size-4" aria-hidden />
      <span>{format(lastActivity, _("last-activity-format"))}</span>
    </span>
  )
}
const ColumnActions: React.FC<ColumnProps> = ({ row }) => {
  const { _ } = useTranslation(dictionary)
  const { revokeSession } = useUser()
  const { id } = row.original
  const [pending, setPending] = React.useState(false)
  const onClick = async () => {
    setPending(true)
    await revokeSession(id)
    setPending(false)
  }

  return (
    <span className="flex shrink-0 items-center justify-end">
      <Ui.Tooltip.Quick tooltip={_("revoke-tooltip")} side="left" asChild>
        <Ui.Button variant="outline" size="sm" icon onClick={onClick} disabled={pending}>
          <Trash2Icon aria-hidden />
          <Ui.SrOnly>{_("revoke")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.Tooltip.Quick>
    </span>
  )
}

/**
 * store
 */
const sessionsStore = decorateStore(
  { columnSizing: {} },
  create,
  { persist: { name: "admin-users-sessions-store", enabled: true } },
  { setColumnSizing: (columnSizing) => sessionsStore.set({ columnSizing }) }
)

/**
 * define columns
 */
const columns: ColumnDef<DataItem>[] = [
  {
    header: "device-label",
    id: "device",
    cell: ({ row }) => <ColumnDevice row={row} />,
    size: 400,
    minSize: 200,
    maxSize: 2400,
  },
  {
    header: "ip-label",
    id: "ip",
    cell: ({ row }) => <ColumnIp row={row} />,
    ...Dashboard.makeColumnSize({ size: 150 }),
  },
  {
    header: "last-activity-label",
    id: "lastActivity",
    cell: ({ row }) => <ColumnLastActivity row={row} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    header: "revoke-label",
    id: "revoke",
    cell: ({ row }) => <ColumnActions row={row} />,
    size: 56,
    enableResizing: false,
    enablePinning: true,
  },
]

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Sessions de l'utilisateur",
    description:
      "Gérez les sessions de l'utilisateur. Vous pouvez déconnecter un utilisateur d'une session spécifique ou de l'ensemble de ses appareils.",
    "revoke-all-title": "Déconnecter l'utilisateur de tous les appareils",
    "revoke-all-description": "L'utilisateur sera déconnecté de toutes ses sessions actives sur tous ses appareils.",
    "revoke-all-button": "Déconnecter tous les appareils",
    "device-label": "Appareil",
    "unknown-device": "Appareil inconnu",
    "current-session": "Session en cours",
    "ip-label": "Adresse IP",
    "last-activity-label": "Dernière activité",
    "last-activity-format": "PPP 'à' H'h'mm",
    revoke: "Déconnecter",
    "revoke-tooltip": "Déconnecter cette session",
  },
  en: {
    title: "User sessions",
    description: "Manage the user sessions. You can disconnect a user from a specific session or from all his devices.",
    "revoke-all-title": "Disconnect from all devices",
    "revoke-all-description": "You will be disconnected from all active sessions on all your devices.",
    "revoke-all-button": "Disconnect from all devices",
    "device-label": "Device",
    "unknown-device": "Unknown device",
    "current-session": "Current session",
    "ip-label": "IP Address",
    "last-activity-label": "Last Activity",
    "last-activity-format": "PPP 'at' H'h'mm",
    revoke: "Disconnect",
    "revoke-tooltip": "Disconnect this session",
  },
  de: {
    title: "Benutzersitzungen",
    description:
      "Verwalten Sie die Benutzersitzungen. Sie können einen Benutzer von einer bestimmten Sitzung oder von allen seinen Geräten trennen.",
    "revoke-all-title": "Von allen Geräten trennen",
    "revoke-all-description": "Der Benutzer wird von allen aktiven Sitzungen auf allen seinen Geräten getrennt.",
    "revoke-all-button": "Von allen Geräten trennen",
    "device-label": "Gerät",
    "unknown-device": "Unbekanntes Gerät",
    "current-session": "Aktuelle Sitzung",
    "ip-label": "IP-Adresse",
    "last-activity-label": "Letzte Aktivität",
    "last-activity-format": "PPP 'um' H'h'mm",
    revoke: "Trennen",
    "revoke-tooltip": "Diese Sitzung trennen",
  },
}

/**
 * utils
 */
const prettifyDeviceInfo = (info: Api.DeviceInfo, unknown: string): string => {
  const client = info.client ? [info.client.name, info.client.version].filter(Boolean).join(" ") : null
  const os = info.os ? [info.os.name, info.os.version].filter(Boolean).join(" ") : null
  const device = info.device ? [info.device.brand, info.device.model].filter(Boolean).join(" ") : null
  return [client, os, device].filter(Boolean).join(" – ") || unknown
}
