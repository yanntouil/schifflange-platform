import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Shield, Trash2 } from "lucide-react"
import React from "react"
import { workspaceRoleGuard } from "../utils"
import { useWorkspace } from "./context"

/**
 * MemberMenu
 * menu for workspace members (change role, remove)
 */
type MemberMenuProps = {
  member: Api.Admin.WorkspaceMember
}
export const MemberMenu: React.FC<MemberMenuProps> = ({ member }) => {
  const { _ } = useTranslation(dictionary)
  const { service, swr, removeMember, changeRole } = useWorkspace()
  const roles = ["owner", "admin", "member"]
  const onRoleChange = (role: string) => {
    if (workspaceRoleGuard(role)) changeRole(member, role)
  }

  return (
    <>
      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Shield className="size-4" />
          {_("change-role")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.RadioGroup value={member.workspaceRole} onValueChange={onRoleChange}>
            {roles.map((role) => (
              <Ui.Menu.RadioItem key={role} value={role}>
                {_(`role-${role}`)}
              </Ui.Menu.RadioItem>
            ))}
          </Ui.Menu.RadioGroup>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>

      <Ui.Menu.Separator />
      <Ui.Menu.Item onClick={() => removeMember(member)} className="text-destructive">
        <Trash2 className="size-4" />
        {_("remove-member")}
      </Ui.Menu.Item>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "change-role": "Changer le rôle",
    "remove-member": "Supprimer le membre",
    "role-owner": "Propriétaire",
    "role-admin": "Administrateur",
    "role-member": "Membre",
  },
  en: {
    "change-role": "Change role",
    "remove-member": "Remove member",
    "role-owner": "Owner",
    "role-admin": "Admin",
    "role-member": "Member",
  },
  de: {
    "change-role": "Rolle ändern",
    "remove-member": "Mitglied entfernen",
    "role-owner": "Besitzer",
    "role-admin": "Administrator",
    "role-member": "Mitglied",
  },
}
