import signInRouteTo from "@/app/sign-in"
import { authStore, useAuth } from "@/features/auth"
import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, cxm, match, O, pipe, T } from "@compo/utils"
import { ClockIcon, GlobeIcon, Laptop, MonitorIcon, Smartphone, Tablet } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"

/**
 * AuthDialogAuthenticationSessions
 * this component is used to manage sessions update in the auth dialog authentication tab
 */
export const AuthDialogAuthenticationSessions: React.FC = () => {
  const { _, format } = useTranslation(dictionary)
  const { me, session } = useAuth()
  const [, navigate] = useLocation()
  const sessions = React.useMemo(
    () =>
      pipe(
        me.sessions,
        A.filterMap((session) =>
          session.isActive
            ? O.Some({
                id: session.id,
                ip: session.ipAddress,
                lastActivity: T.parseISO(session.lastActivity),
                device: prettifyDeviceInfo(session.deviceInfo),
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
    [me.sessions]
  )

  // revoke a specific session
  const revokeSession = React.useCallback(
    async (sessionId: string) => {
      if (sessionId === session.id) {
        const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm-logout") })
        if (!isConfirm) return
        await authStore.actions.logout()
        navigate(signInRouteTo())
      } else {
        await authStore.actions.deactivateSession(sessionId)
      }
    },
    [session.id, _, navigate]
  )

  // revoke all sessions except the current one
  const revokeAllSessions = React.useCallback(async () => {
    await Promise.all(
      A.map(me.sessions, (s) => {
        if (s.id !== session.id) {
          return authStore.actions.deactivateSession(s.id)
        }
      })
    )
  }, [me.sessions, session.id])

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-1">
        <Ui.Hn level={3} className="text-lg/none font-semibold">
          {_("sessions-title")}
        </Ui.Hn>
        <p className="text-muted-foreground text-sm">{_("sessions-description")}</p>
      </div>
      <div className="flex items-center justify-between">
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
      <div className="w-full overflow-x-auto">
        <table className="w-full caption-bottom">
          <thead>
            <tr className="[&_th]:text-muted-foreground border-b text-nowrap [&_th]:px-2 [&_th]:py-4 [&_th]:text-left [&_th]:align-middle [&_th]:text-xs/none [&_th]:font-medium">
              <th scope="col">{_("th-device")}</th>
              <th scope="col">{_("th-ip")}</th>
              <th scope="col">{_("th-last-activity")}</th>
              <th scope="col">
                <Ui.SrOnly>{_("th-actions")}</Ui.SrOnly>
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(({ DeviceIcon, id, ip, lastActivity, device }) => (
              <tr
                key={id}
                className={cxm(
                  "hover:bg-muted/50 transition-color text-nowrap not-last:border-b",
                  "[&_td]:px-2 [&_td]:py-2 [&_td]:align-middle [&_td]:text-xs/tight",
                  "[&_td_div]:flex [&_td_div]:w-max [&_td_div]:items-center [&_td_div]:gap-2",
                  session.id === id && "[&_td_div]:font-bold"
                )}
              >
                <td>
                  <div>
                    <span className="bg-secondary flex size-6 shrink-0 items-center justify-center rounded-sm">
                      <DeviceIcon className="text-secondary-foreground size-3.5" />
                    </span>
                    <span>{device}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <GlobeIcon className="text-muted-foreground size-3.5 shrink-0" />
                    <span>{ip}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <ClockIcon className="text-muted-foreground size-3.5 shrink-0" />
                    <span>{format(lastActivity, "PP HH:mm")}</span>
                  </div>
                </td>
                <td className="text-right">
                  <Ui.Button variant="outline" size="sm" onClick={() => revokeSession(id)}>
                    {_("revoke")}
                  </Ui.Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "sessions-title": "Sessions actives",
    "sessions-description": "Gérez vos sessions actives sur différents appareils.",
    "revoke-all-title": "Se déconnecter de tous les appareils",
    "revoke-all-description": "Vous serez déconnecté de toutes les sessions actives sur les autres appareils que celui-ci.",
    "revoke-all-button": "Se déconnecter de tous les appareils",
    "th-device": "Appareil",
    "th-ip": "Adresse IP",
    "th-last-activity": "Dernière activité",
    "th-actions": "Actions",
    revoke: "Déconnecter",
    "confirm-logout": {
      title: "Confirmation de déconnexion",
      description: "Vous allez être déconnecté de votre session. Voulez-vous vraiment continuer?",
      cancel: "Annuler",
      confirm: "Confirmer",
    },
  },
  en: {
    "sessions-title": "Active Sessions",
    "sessions-description": "Manage your active sessions across different devices.",
    "revoke-all-title": "Disconnect from all devices",
    "revoke-all-description": "You will be disconnected from all active sessions on other devices than this one.",
    "revoke-all-button": "Disconnect from all devices",
    "th-device": "Device",
    "th-ip": "IP Address",
    "th-last-activity": "Last Activity",
    "th-actions": "Actions",
    revoke: "Disconnect",
    "confirm-logout": {
      title: "Logout Confirmation",
      description: "You will be logged out of your session. Do you really want to continue?",
      cancel: "Cancel",
      confirm: "Confirm",
    },
  },
  de: {
    "sessions-title": "Aktive Sitzungen",
    "sessions-description": "Verwalten Sie Ihre aktiven Sitzungen auf verschiedenen Geräten.",
    "revoke-all-title": "Von allen Geräten abmelden",
    "revoke-all-description": "Sie werden von allen aktiven Sitzungen auf anderen Geräten als diesem abgemeldet.",
    "revoke-all-button": "Von allen Geräten abmelden",
    "th-device": "Gerät",
    "th-ip": "IP-Adresse",
    "th-last-activity": "Letzte Aktivität",
    "th-actions": "Aktionen",
    revoke: "Abmelden",
    "confirm-logout": {
      title: "Abmeldung bestätigen",
      description: "Sie werden aus Ihrer Sitzung abgemeldet. Möchten Sie wirklich fortfahren?",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
    },
  },
}

/**
 * utils
 */
const prettifyDeviceInfo = (info: Api.DeviceInfo): string => {
  const client = info.client ? [info.client.name, info.client.version].filter(Boolean).join(" ") : null
  const os = info.os ? [info.os.name, info.os.version].filter(Boolean).join(" ") : null
  const device = info.device ? [info.device.brand, info.device.model].filter(Boolean).join(" ") : null

  return [client, os, device].filter(Boolean).join(" – ") || "Unknown device"
}
