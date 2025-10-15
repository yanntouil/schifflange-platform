import { Query } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, NonNullableRecord } from "@compo/utils"
import { FilterIcon, FunnelX, Layers } from "lucide-react"
import React from "react"
import { eventGuard, workspaceEventsGrouped } from "./utils"

type FilterBy = NonNullableRecord<Query.Workspaces.Logs>["filterBy"]
/**
 * Admin workspaces toolbar filter
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
            <Layers aria-hidden />
            {_("event-label", { selectedEvent })}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent className="isolate z-10">
            <Ui.DropdownMenu.RadioGroup value={filterBy.event} onValueChange={onEventChange}>
              {A.map(D.toPairs(workspaceEventsGrouped), ([group, events]) => (
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
    "event-workspaceManagement": "Workspace Management",
    "event-memberManagement": "Member Management",
    "event-invitationManagement": "Invitation Management",
    "event-created": "Workspace created",
    "event-updated": "Workspace updated",
    "event-deleted": "Workspace deleted",
    "event-member-attached": "Member attached",
    "event-member-updated": "Member updated",
    "event-member-removed": "Member removed",
    "event-member-left": "Member left",
    "event-member-joined": "Member joined",
    "event-invitation-created": "Invitation created",
    "event-invitation-deleted": "Invitation deleted",
  },
  fr: {
    tooltip: "Afficher {{selectedEvent}}",
    "event-label": "Événement: {{selectedEvent}}",
    "event-all": "tous les événements",
    "reset-all": "Réinitialiser tous les filtres",
    "event-workspaceManagement": "Gestion de l'espace de travail",
    "event-memberManagement": "Gestion des membres",
    "event-invitationManagement": "Gestion des invitations",
    "event-created": "Espace de travail créé",
    "event-updated": "Espace de travail mis à jour",
    "event-deleted": "Espace de travail supprimé",
    "event-member-attached": "Membre ajouté",
    "event-member-updated": "Membre mis à jour",
    "event-member-removed": "Membre supprimé",
    "event-member-left": "Membre parti",
    "event-member-joined": "Membre rejoint",
    "event-invitation-created": "Invitation créée",
    "event-invitation-deleted": "Invitation supprimée",
  },
  de: {
    tooltip: "Anzeigen von {{selectedEvent}}",
    "event-label": "Ereignis: {{selectedEvent}}",
    "event-all": "alle Ereignisse",
    "reset-all": "Alle Filter zurücksetzen",
    "event-workspaceManagement": "Arbeitsbereich-Verwaltung",
    "event-memberManagement": "Mitglieder-Verwaltung",
    "event-invitationManagement": "Einladungen-Verwaltung",
    "event-created": "Arbeitsbereich erstellt",
    "event-updated": "Arbeitsbereich aktualisiert",
    "event-deleted": "Arbeitsbereich gelöscht",
    "event-member-attached": "Mitglied angehängt",
    "event-member-updated": "Mitglied aktualisiert",
    "event-member-removed": "Mitglied entfernt",
    "event-member-left": "Mitglied verlassen",
    "event-member-joined": "Mitglied beigetreten",
    "event-invitation-created": "Einladung erstellt",
    "event-invitation-deleted": "Einladung gelöscht",
  },
}
