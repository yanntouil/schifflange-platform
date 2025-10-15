import { service } from "@/services"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"

// Types temporaires
type Workspace = {
  id: string
  name: string
  status: string
  type: string
  createdAt: string
  updatedAt: string
  members: any[]
  invitations: any[]
}

/**
 * useSwrWorkspace
 */
export const useSwrWorkspace = (id: string) => {
  const { data, mutate, ...props } = useSWR({
    fetch: () => service.admin.workspaces.id(id).read(),
    key: useMemoKey("admin-workspace", { id }),
  })

  const workspace = data?.workspace
  type Workspace = NonNullable<typeof workspace>
  type Member = Workspace["members"][number]
  type Invitation = Workspace["invitations"][number]

  const mutateMembers = (fn: (items: Member[]) => Member[]) =>
    mutate((data) => data && { ...data, workspace: { ...data.workspace, members: fn(data.workspace.members) } }, { revalidate: true })

  const mutateInvitations = (fn: (items: Invitation[]) => Invitation[]) =>
    mutate((data) => data && { ...data, workspace: { ...data.workspace, invitations: fn(data.workspace.invitations) } }, {
      revalidate: true,
    })

  const swr = {
    ...props,
    mutate,
    update: (workspace: Partial<Workspace>) => void mutate((data) => data && { ...data, workspace: { ...data.workspace, ...workspace } }),
    // Members
    appendMember: (member: Member) => void mutateMembers(A.append(member)),
    rejectMember: (member: Member) => void mutateMembers(A.filter((m) => m.id !== member.id)),
    rejectMemberById: (id: string) => void mutateMembers(A.filter((m) => m.id !== id)),
    updateMember: (member: Member) => void mutateMembers(A.map((m) => (m.id === member.id ? member : m))),
    // Invitations
    appendInvitation: (invitation: Invitation) => void mutateInvitations(A.append(invitation)),
    rejectInvitation: (invitation: Invitation) => void mutateInvitations(A.filter((i) => i.id !== invitation.id)),
    rejectInvitationById: (id: string) => void mutateInvitations(A.filter((i) => i.id !== id)),
    updateInvitation: (invitation: Invitation) => void mutateInvitations(A.map((i) => (i.id === invitation.id ? invitation : i))),
  }

  return { workspace, swr }
}
