import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Trash2 } from "lucide-react"
import React from "react"
import { useWorkspace } from "./context"

/**
 * InvitationMenu
 * menu for workspace invitations (delete)
 */
type InvitationMenuProps = {
  invitation: Api.Admin.WorkspaceInvitation
}

export const InvitationMenu: React.FC<InvitationMenuProps> = ({ invitation }) => {
  const { _ } = useTranslation(dictionary)
  const { removeInvitation } = useWorkspace()
  return (
    <>
      <Ui.Menu.Item onClick={() => removeInvitation(invitation)} className="text-destructive">
        <Trash2 aria-hidden />
        {_("remove-invitation")}
      </Ui.Menu.Item>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "remove-invitation": "Supprimer l'invitation",
  },
  en: {
    "remove-invitation": "Remove invitation",
  },
  de: {
    "remove-invitation": "Einladung entfernen",
  },
}
