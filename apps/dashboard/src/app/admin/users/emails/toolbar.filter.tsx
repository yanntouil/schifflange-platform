import { Query } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { NonNullableRecord } from "@compo/utils"
import { FilterIcon, FunnelX, MailIcon } from "lucide-react"
import React from "react"
import { statusGuard } from "./utils"

type FilterBy = NonNullableRecord<Query.Admin.EmailLogs.List>["filterBy"]
/**
 * Admin users emails toolbar filter
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
  const onStatusChange = (status: string) => {
    const typedStatus = statusGuard(status) ? status : null
    setFilterBy({ ...filterBy, status: typedStatus })
  }

  const selectedStatus = filterBy.status ? _(`status-${filterBy.status}`) : _("status-all")

  return (
    <Ui.DropdownMenu.Root>
      <Ui.Tooltip.Quick asChild tooltip={_("tooltip", { selectedStatus })} side="top" align="center">
        <Ui.DropdownMenu.Trigger asChild>
          <Ui.Button variant="outline" icon size={toolbarSize}>
            <FilterIcon />
          </Ui.Button>
        </Ui.DropdownMenu.Trigger>
      </Ui.Tooltip.Quick>
      <Ui.DropdownMenu.Content side="left" align="start">
        <Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.SubTrigger>
            <MailIcon aria-hidden />
            {_("status-label", { selectedStatus })}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.SubContent className="isolate z-10">
            <Ui.DropdownMenu.RadioGroup value={filterBy.status ?? ""} onValueChange={onStatusChange}>
              <Ui.DropdownMenu.RadioItem value="">{_("status-all")}</Ui.DropdownMenu.RadioItem>
              <Ui.DropdownMenu.RadioItem value="queued">{_("status-queued")}</Ui.DropdownMenu.RadioItem>
              <Ui.DropdownMenu.RadioItem value="sent">{_("status-sent")}</Ui.DropdownMenu.RadioItem>
              <Ui.DropdownMenu.RadioItem value="failed">{_("status-failed")}</Ui.DropdownMenu.RadioItem>
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
    tooltip: "Displaying {{selectedStatus}}",
    "status-label": "Status: {{selectedStatus}}",
    "status-all": "All statuses",
    "status-queued": "Queued",
    "status-sent": "Sent",
    "status-failed": "Failed",
    "reset-all": "Reset all filters",
  },
  fr: {
    tooltip: "Afficher {{selectedStatus}}",
    "status-label": "Statut: {{selectedStatus}}",
    "status-all": "Tous les statuts",
    "status-queued": "En attente",
    "status-sent": "Envoyé",
    "status-failed": "Échoué",
    "reset-all": "Réinitialiser tous les filtres",
  },
  de: {
    tooltip: "Anzeigen von {{selectedStatus}}",
    "status-label": "Status: {{selectedStatus}}",
    "status-all": "Alle Status",
    "status-queued": "In Warteschlange",
    "status-sent": "Gesendet",
    "status-failed": "Fehlgeschlagen",
    "reset-all": "Alle Filter zurücksetzen",
  },
}
