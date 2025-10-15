import { Api } from "@/services"
import { match } from "@compo/utils"
import { Layers, Mail, UserCheck, UserMinus, UserPlus, Users, UserX } from "lucide-react"
import React, { ComponentProps } from "react"
import { getEventGroup } from "./utils"

/**
 * GroupIcon: return the icon based on the event
 */
export const GroupIcon: React.FC<{ event: Api.WorkspaceLogEventType } & ComponentProps<"svg">> = ({ event, ...props }) => {
  const group = getEventGroup(event)
  return match(group)
    .with("workspaceManagement", () => <Layers {...props} />)
    .with("memberManagement", () => <Users {...props} />)
    .with("invitationManagement", () => <Mail {...props} />)
    .otherwise(() => <Layers {...props} />)
}

/**
 * EventIcon: return the icon based on the specific event
 */
export const EventIcon: React.FC<{ event: Api.WorkspaceLogEventType } & ComponentProps<"svg">> = ({ event, ...props }) => {
  return match(event)
    .with("created", "updated", "deleted", () => <Layers {...props} />)
    .with("member-attached", () => <UserPlus {...props} />)
    .with("member-joined", () => <UserCheck {...props} />)
    .with("member-left", "member-removed", () => <UserMinus {...props} />)
    .with("member-updated", () => <Users {...props} />)
    .with("invitation-created", () => <Mail {...props} />)
    .with("invitation-deleted", () => <UserX {...props} />)
    .otherwise(() => <Layers {...props} />)
}
