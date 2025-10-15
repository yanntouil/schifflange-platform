import { useAuth } from "@/features/auth"
import { AuthDialogContent, AuthDialogHeader } from "@/features/auth/components"
import { UserAvatar } from "@/features/auth/components/avatar"
import { useWorkspaces, workspaceRoleGuard, workspaceStore } from "@/features/workspaces"
import { Api, service } from "@/services"
import { useMatchable, useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { match, S } from "@compo/utils"
import { ChevronDown, Crown, LogOut, Search, Shield, User } from "lucide-react"
import React from "react"

export type AuthDialogTabWorkspacesMembers = {
  type: "workspaces-members"
  params: {
    workspaceId: string
  }
}

/**
 * dialog workspace members
 * this component is used to display the workspace members tab in the auth dialog
 */
export const WorkspacesDialogMembers: React.FC<{ tab: AuthDialogTabWorkspacesMembers }> = ({ tab }) => {
  const { _ } = useTranslation(dictionary)
  const { workspaceId } = tab.params

  const { data, isLoading, error, mutate } = useSWR(
    {
      fetch: () => service.workspaces.id(workspaceId).listMembers(),
      key: useMemoKey("workspace-members", { workspaceId }),
    },
    { fallbackData: { members: [] } }
  )

  if (isLoading) {
    return (
      <>
        <AuthDialogHeader title={_("title")} description={_("description")} sticky />
        <AuthDialogContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="bg-muted size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="bg-muted h-4 w-1/3 rounded" />
                  <div className="bg-muted h-3 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </AuthDialogContent>
      </>
    )
  }
  if (error)
    return (
      <>
        <AuthDialogHeader title={_("title")} description={_("description")} sticky />
        <AuthDialogContent>
          <Ui.Alert.Root>
            <Ui.Alert.Title>{_("error-title")}</Ui.Alert.Title>
            <Ui.Alert.Description>{_("error-description")}</Ui.Alert.Description>
          </Ui.Alert.Root>
        </AuthDialogContent>
      </>
    )
  return <WorkspaceMembersList members={data.members} workspaceId={workspaceId} onUpdate={mutate} />
}

/**
 * Workspace members list with search
 */
const WorkspaceMembersList: React.FC<{
  members: Api.WorkspaceMember[]
  workspaceId: string
  onUpdate: () => void
}> = ({ members, workspaceId, onUpdate }) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const { workspaces } = useWorkspaces()

  // Find the workspace being managed (not the current one)
  const managedWorkspace = workspaces.find((w) => w.id === workspaceId)

  const [matchable, matchIn] = useMatchable<Api.WorkspaceMember>(`workspace-members-search`, [
    "email",
    "profile.firstname",
    "profile.lastname",
  ])

  const filteredMembers = React.useMemo(() => {
    return S.isEmpty(S.trim(matchable.search)) ? members : matchIn(members)
  }, [members, matchable.search, matchIn])

  const onLeave = async () => {
    const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm-leave-workspace") })
    if (!isConfirm) return

    match(await service.workspaces.id(workspaceId).leave())
      .with({ ok: true }, () => {
        workspaceStore.actions.loadWorkspaces()
        onUpdate()
      })
      .otherwise((error) => {
        Ui.toast.error(_("error-leave"))
      })
  }

  const onRemoveMember = async (memberId: string) => {
    const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm-remove-member") })
    if (!isConfirm) return

    match(await service.workspaces.id(workspaceId).detachMember(memberId))
      .with({ ok: true }, () => {
        onUpdate()
      })
      .otherwise((error) => {
        Ui.toast.error(_("error-remove"))
      })
  }

  const onChangeMemberRole = async (memberId: string, role: string) => {
    if (!workspaceRoleGuard(role)) return

    // Confirm if user is changing their own role (potentially dangerous)
    if (memberId === me.id) {
      const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm-change-own-role") })
      if (!isConfirm) return
    }

    match(await service.workspaces.id(workspaceId).updateMember(memberId, { role }))
      .with({ ok: true }, () => {
        onUpdate()
      })
      .otherwise((error) => {
        Ui.toast.error(_("error-update-role"))
      })
  }

  const serachId = React.useId()
  return (
    <>
      <AuthDialogHeader title={_("title")} description={_("description", { count: filteredMembers.length })} sticky />
      <AuthDialogContent className="space-y-4 pt-2">
        {/* Search */}
        <div className="relative">
          <label className={variants.inputIcon({ size: "default", side: "left" })} htmlFor={serachId}>
            <Search className="text-muted-foreground" />
          </label>
          <input
            id={serachId}
            placeholder={_("search-placeholder")}
            value={matchable.search}
            onChange={(e) => matchable.setSearch(e.target.value)}
            className={variants.input({ icon: "left" })}
          />
        </div>

        {/* Members list */}
        <div className="space-y-2">
          {filteredMembers.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <User className="mx-auto mb-4 size-12 opacity-50" />
              <p>{_("no-members-found")}</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isCurrentUser={member.id === me.id}
                currentUserRole={managedWorkspace?.memberRole}
                onRemove={() => onRemoveMember(member.id)}
                onLeave={onLeave}
                onUpdateRole={(newRole) => onChangeMemberRole(member.id, newRole)}
              />
            ))
          )}
        </div>
      </AuthDialogContent>
    </>
  )
}

/**
 * Member card component
 */
const MemberCard: React.FC<{
  member: Api.WorkspaceMember
  isCurrentUser: boolean
  currentUserRole?: string
  onRemove: () => void
  onLeave: () => void
  onUpdateRole: (newRole: string) => void
}> = ({ member, isCurrentUser, currentUserRole, onRemove, onLeave, onUpdateRole }) => {
  const { _ } = useTranslation(dictionary)

  const getRoleIcon = (role: string) => {
    return match(role)
      .with("owner", () => <Crown className="size-4 text-yellow-600" />)
      .with("admin", () => <Shield className="size-4 text-blue-600" />)
      .otherwise(() => <User className="size-4 text-gray-600" />)
  }

  // Determine if current user can change this member's role
  const canChangeRole =
    // Can change others' roles if you're owner/admin with appropriate permissions
    (!isCurrentUser && (currentUserRole === "owner" || (currentUserRole === "admin" && member.workspaceRole !== "owner"))) ||
    // Owners can change their own role (with confirmation)
    (isCurrentUser && currentUserRole === "owner")

  const availableRoles = currentUserRole === "owner" ? ["member", "admin", "owner"] : ["member", "admin"] // admins can assign up to admin

  // Determine if current user can remove this member
  const canRemove = !isCurrentUser && (currentUserRole === "owner" || (currentUserRole === "admin" && member.workspaceRole !== "owner"))

  return (
    <div className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors">
      <UserAvatar user={member} size="size-10" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">
            {member.profile.firstname && member.profile.lastname
              ? `${member.profile.firstname} ${member.profile.lastname}`
              : _("member-name-placeholder")}
          </p>
          {isCurrentUser && <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">{_("you")}</span>}
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          {getRoleIcon(member.workspaceRole)}
          {canChangeRole ? (
            <Ui.DropdownMenu.Root>
              <Ui.DropdownMenu.Trigger className="hover:text-foreground flex items-center gap-1 capitalize transition-colors">
                {_(member.workspaceRole)}
                <ChevronDown className="size-3" aria-hidden />
              </Ui.DropdownMenu.Trigger>
              <Ui.DropdownMenu.Content align="start">
                {availableRoles.map((role) => (
                  <Ui.DropdownMenu.Item key={role} onClick={() => onUpdateRole(role)} disabled={role === member.workspaceRole}>
                    {getRoleIcon(role)}
                    <span>{_(role)}</span>
                  </Ui.DropdownMenu.Item>
                ))}
              </Ui.DropdownMenu.Content>
            </Ui.DropdownMenu.Root>
          ) : (
            <span>{_(member.workspaceRole)}</span>
          )}
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-1">
        {isCurrentUser ? (
          <Ui.Button variant="ghost" size="sm" onClick={onLeave} className="text-destructive hover:text-destructive">
            <LogOut className="size-4" />
            {_("leave")}
          </Ui.Button>
        ) : canRemove ? (
          <Ui.Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
            {_("remove")}
          </Ui.Button>
        ) : null}
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Members",
    description: "View and manage workspace members ({{count}} members).",
    "error-title": "Error",
    "error-description": "Failed to load workspace members. Please try again.",
    "search-placeholder": "Search members...",
    "no-members-found": "No members found.",
    "leave-confirm": "Are you sure you want to leave this workspace?",
    "remove-confirm": "Are you sure you want to remove this member?",
    "leave-success": "You have left the workspace",
    "remove-success": "Member removed successfully",
    "update-role-success": "Member role updated successfully",
    "error-leave": "Failed to leave workspace",
    "error-remove": "Failed to remove member",
    "error-update-role": "Failed to update member role",
    you: "You",
    leave: "Leave",
    remove: "Remove",
    owner: "Owner",
    admin: "Admin",
    member: "Member",
    "member-name-placeholder": "Workspace Member",
    "confirm-remove-member": {
      title: "Remove member",
      description: "This member will lose access to the workspace immediately. This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Remove member",
    },
    "confirm-leave-workspace": {
      title: "Leave workspace",
      description: "You will no longer have access to this workspace. You'll need to be re-invited to join again.",
      cancel: "Cancel",
      confirm: "Leave workspace",
    },
    "confirm-change-own-role": {
      title: "Change your own role",
      description:
        "Warning: You are about to change your own role. If you reduce your permissions, you may not be able to change them back. Only do this if you're sure.",
      cancel: "Cancel",
      confirm: "Change my role",
    },
  },
  fr: {
    title: "Membres",
    description: "Voir et gérer les membres de l'espace ({{count}} membres).",
    "error-title": "Erreur",
    "error-description": "Impossible de charger les membres. Veuillez réessayer.",
    "search-placeholder": "Rechercher des membres...",
    "no-members-found": "Aucun membre trouvé.",
    "leave-confirm": "Êtes-vous sûr de vouloir quitter cet espace de travail ?",
    "remove-confirm": "Êtes-vous sûr de vouloir supprimer ce membre ?",
    "leave-success": "Vous avez quitté l'espace de travail",
    "remove-success": "Membre supprimé avec succès",
    "update-role-success": "Rôle du membre mis à jour avec succès",
    "error-leave": "Impossible de quitter l'espace de travail",
    "error-remove": "Impossible de supprimer le membre",
    "error-update-role": "Impossible de mettre à jour le rôle du membre",
    you: "Vous",
    leave: "Quitter",
    remove: "Supprimer",
    owner: "Propriétaire",
    admin: "Admin",
    member: "Membre",
    "member-name-placeholder": "Membre de l'espace",
    "confirm-remove-member": {
      title: "Supprimer le membre",
      description: "Ce membre perdra immédiatement l'accès à l'espace de travail. Cette action est irréversible.",
      cancel: "Annuler",
      confirm: "Supprimer le membre",
    },
    "confirm-leave-workspace": {
      title: "Quitter l'espace",
      description: "Vous n'aurez plus accès à cet espace de travail. Vous devrez être ré-invité pour le rejoindre.",
      cancel: "Annuler",
      confirm: "Quitter l'espace",
    },
    "confirm-change-own-role": {
      title: "Modifier votre rôle",
      description:
        "Attention : Vous êtes sur le point de modifier votre propre rôle. Si vous réduisez vos permissions, vous ne pourrez peut-être plus les modifier. Ne faites ceci que si vous en êtes sûr.",
      cancel: "Annuler",
      confirm: "Modifier mon rôle",
    },
  },
  de: {
    title: "Mitglieder",
    description: "Ansicht und Verwaltung der Mitglieder des Arbeitsbereichs ({{count}} Mitglieder).",
    "error-title": "Fehler",
    "error-description": "Laden der Arbeitsbereichsmitglieder fehlgeschlagen. Bitte versuchen Sie es erneut.",
    "search-placeholder": "Mitglieder suchen...",
    "no-members-found": "Keine Mitglieder gefunden.",
    "leave-confirm": "Sind Sie sicher, dass Sie diesen Arbeitsbereich verlassen möchten?",
    "remove-confirm": "Sind Sie sicher, dass Sie dieses Mitglied entfernen möchten?",
    "leave-success": "Sie haben den Arbeitsbereich verlassen",
    "remove-success": "Mitglied erfolgreich entfernt",
    "update-role-success": "Mitgliederrolle erfolgreich aktualisiert",
    "error-leave": "Fehler beim Verlassen des Arbeitsbereichs",
    "error-remove": "Fehler beim Entfernen des Mitglieds",
    "error-update-role": "Fehler beim Aktualisieren der Mitgliederrolle",
    you: "Sie",
    leave: "Verlassen",
    remove: "Entfernen",
    owner: "Eigentümer",
    admin: "Admin",
    member: "Mitglied",
    "member-name-placeholder": "Arbeitsbereichsmitglied",
    "confirm-remove-member": {
      title: "Mitglied entfernen",
      description: "Dieses Mitglied wird sofort aus dem Arbeitsbereich entfernt. Diese Aktion kann nicht rückgängig gemacht werden.",
      cancel: "Abbrechen",
      confirm: "Mitglied entfernen",
    },
    "confirm-leave-workspace": {
      title: "Arbeitsbereich verlassen",
      description:
        "Sie werden keinen Zugriff mehr auf diesen Arbeitsbereich haben. Sie müssen erneut eingeladen werden, um wieder beitreten zu können.",
      cancel: "Abbrechen",
      confirm: "Arbeitsbereich verlassen",
    },
    "confirm-change-own-role": {
      title: "Eigene Rolle ändern",
      description:
        "Warnung: Sie sind dabei, Ihre eigene Rolle zu ändern. Wenn Sie Ihre Berechtigungen reduzieren, könnten Sie sie möglicherweise nicht mehr ändern. Tun Sie dies nur, wenn Sie sicher sind.",
      cancel: "Abbrechen",
      confirm: "Meine Rolle ändern",
    },
  },
}
