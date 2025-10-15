import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * DispatchStatusStats
 * Display the dispatch of the users beetwwen the different status
 */
export const DispatchStatusStats: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({ stats, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const usersByStatus = [
    { label: _("pending"), count: stats.usersByStatus?.pending ?? 0 },
    { label: _("active"), count: stats.usersByStatus?.active ?? 0 },
    { label: _("deleted"), count: stats.usersByStatus?.deleted ?? 0 },
    { label: _("suspended"), count: stats.usersByStatus?.suspended ?? 0 },
  ]
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2}>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className="flex min-h-16 items-center justify-around gap-8">
        {usersByStatus.map(({ label, count }) => (
          <p className="flex flex-col items-center gap-2" key={label}>
            <span className="text-xl/none font-bold">{count}</span>
            <span className="text-muted-foreground text-xs/none">{label}</span>
          </p>
        ))}
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "User status distribution",
    description: "Display the distribution of users accounts beetween the different status",
    pending: "Pending",
    active: "Active",
    deleted: "Deleted",
    suspended: "Suspended",
  },
  fr: {
    title: "Répartition des statuts",
    description: "Affiche la répartition des comptes utilisateurs entre les différents statuts",
    pending: "En attente",
    active: "Actif",
    deleted: "Supprimé",
    suspended: "Suspendu",
  },
  de: {
    title: "Benutzerstatus-Verteilung",
    description: "Zeigt die Verteilung der Benutzerkonten zwischen den verschiedenen Status an",
    pending: "Ausstehend",
    active: "Aktiv",
    deleted: "Gelöscht",
    suspended: "Gesperrt",
  },
}
