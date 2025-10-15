import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { D, T } from "@compo/utils"
import { getCoreRowModel, Row, useReactTable } from "@tanstack/react-table"
import { CalendarPlus, Database } from "lucide-react"
import React from "react"
import ShikiHighlighter from "react-shiki"
import { GroupIcon } from "./logs.icons"
import { columns } from "./logs.table.columns"
import { logsStore, useLogsStore } from "./store"
import { getEventGroup } from "./utils"

/**
 * LogsTable
 * display a table of workspace logs with a menu and a checkbox (tanstack table)
 */
export const LogsTable: React.FC<{ logs: Api.Admin.WorkspaceLog[] }> = ({ logs }) => {
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
      {(row) => <Dashboard.Table.Row key={row.id} item={row.original.workspace} cells={row.getVisibleCells()} />}
    </Dashboard.Table.Tanstack>
  )
}

/**
 * prepare data and data types
 */
type DataItem = Api.Admin.WorkspaceLog
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
    "workspace-label": "Related workspace",
    "created-by-label": "Related user",
    "workspace-unknown": "Unknown workspace",
    "workspace-placeholder": "Unnamed workspace",
    "created-by-unknown": "Unknown user",
    "created-by-placeholder": "Unnamed user",
    "created-at-label": "Related date",
    "metadata-label": "Metadata",
    events: {
      created: "Workspace created",
      updated: "Workspace updated",
      deleted: "Workspace deleted",
      "member-attached": "Member attached",
      "member-updated": "Member updated",
      "member-removed": "Member removed",
      "member-left": "Member left",
      "member-joined": "Member joined",
      "invitation-created": "Invitation created",
      "invitation-deleted": "Invitation deleted",
    },
  },
  fr: {
    "event-label": "Type d'événement",
    "workspace-label": "Espace de travail concerné",
    "created-by-label": "Utilisateur concerné",
    "workspace-unknown": "Espace de travail inconnu",
    "workspace-placeholder": "Espace de travail anonyme",
    "created-by-unknown": "Utilisateur inconnu",
    "created-by-placeholder": "Utilisateur anonyme",
    "created-at-label": "Date relative",
    "metadata-label": "Métadonnées",
    events: {
      created: "Espace de travail créé",
      updated: "Espace de travail mis à jour",
      deleted: "Espace de travail supprimé",
      "member-attached": "Membre ajouté",
      "member-updated": "Membre mis à jour",
      "member-removed": "Membre supprimé",
      "member-left": "Membre parti",
      "member-joined": "Membre rejoint",
      "invitation-created": "Invitation créée",
      "invitation-deleted": "Invitation supprimée",
    },
  },
  de: {
    "event-label": "Ereignis-Typ",
    "workspace-label": "Betroffener Arbeitsbereich",
    "created-by-label": "Betroffener Benutzer",
    "workspace-unknown": "Unbekannter Arbeitsbereich",
    "workspace-placeholder": "Unbenannter Arbeitsbereich",
    "created-by-unknown": "Unbekannter Benutzer",
    "created-by-placeholder": "Unbenannter Benutzer",
    "created-at-label": "Betroffene Datum",
    "metadata-label": "Metadaten",
    events: {
      created: "Arbeitsbereich erstellt",
      updated: "Arbeitsbereich aktualisiert",
      deleted: "Arbeitsbereich gelöscht",
      "member-attached": "Mitglied angehängt",
      "member-updated": "Mitglied aktualisiert",
      "member-removed": "Mitglied entfernt",
      "member-left": "Mitglied verlassen",
      "member-joined": "Mitglied beigetreten",
      "invitation-created": "Einladung erstellt",
      "invitation-deleted": "Einladung gelöscht",
    },
  },
}
