import { AuthDialogContent, AuthDialogHeader } from "@/features/auth/components"
import { useWorkspaces } from "@/features/workspaces"
import { Api, service } from "@/services"
import { useMatchable, useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { match, S } from "@compo/utils"
import { Calendar, Mail, Plus, Search, Trash2, UserPlus } from "lucide-react"
import React from "react"
import { WorkspacesDialogInvitationsAdd } from "./invitations.add"

export type AuthDialogTabWorkspacesInvitations = {
  type: "workspaces-invitations"
  params: {
    workspaceId: string
  }
}

/**
 * dialog workspace invitations
 * this component is used to display the workspace invitations tab in the auth dialog
 */
export const WorkspacesDialogInvitations: React.FC<{ tab: AuthDialogTabWorkspacesInvitations }> = ({ tab }) => {
  const { _ } = useTranslation(dictionary)
  const { workspaceId } = tab.params

  const { data, isLoading, error, mutate } = useSWR({
    key: useMemoKey("workspace-invitations", { workspaceId }),
    fetch: () => service.workspaces.id(workspaceId).listInvitations(),
  })

  if (isLoading) {
    return (
      <>
        <AuthDialogHeader title={_("title")} description={_("description")} sticky />
        <AuthDialogContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
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

  if (error || !data)
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
  return <WorkspaceInvitationsList invitations={data.invitations} workspaceId={workspaceId} onUpdate={mutate} />
}

/**
 * Workspace invitations list with create form
 */
const WorkspaceInvitationsList: React.FC<{
  invitations: Api.WorkspaceInvitation[]
  workspaceId: string
  onUpdate: () => void
}> = ({ invitations, workspaceId, onUpdate }) => {
  const { _ } = useTranslation(dictionary)
  const { workspaces } = useWorkspaces()

  // Find the workspace being managed (not the current one)
  const managedWorkspace = workspaces.find((w) => w.id === workspaceId)

  const [matchable, matchIn] = useMatchable<Api.WorkspaceInvitation>(`workspace-invitations-search`, ["email"])

  const filteredInvitations = React.useMemo(() => {
    return S.isEmpty(S.trim(matchable.search)) ? invitations : matchIn(invitations)
  }, [invitations, matchable.search, matchIn])

  const canCreateInvitations = managedWorkspace?.memberRole === "owner" || managedWorkspace?.memberRole === "admin"

  const handleDeleteInvitation = async (invitationId: string) => {
    const isConfirm = await Ui.confirmAlert({ t: _.prefixed("confirm-delete-invitation") })
    if (!isConfirm) return

    match(await service.workspaces.id(workspaceId).deleteInvitation(invitationId))
      .with({ ok: true }, () => {
        onUpdate()
      })
      .otherwise((error) => {
        Ui.toast.error(_("error-delete"))
      })
  }

  const [addInvitation, addInvitationProps] = Ui.useQuickDialog<string, Api.WorkspaceInvitation>({
    mutate: async () => onUpdate(),
  })
  const searchId = React.useId()

  return (
    <>
      <AuthDialogHeader title={_("title")} description={_("description", { count: filteredInvitations.length })} sticky />

      <AuthDialogContent className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative grow">
            <label className={variants.inputIcon({ size: "default", side: "left" })} htmlFor={searchId}>
              <Search className="text-muted-foreground" aria-hidden="true" />
            </label>
            <input
              id={searchId}
              placeholder={_("search-placeholder")}
              value={matchable.search}
              onChange={(e) => matchable.setSearch(e.target.value)}
              className={variants.input({ icon: "left" })}
            />
          </div>
          {/* Create invitation button */}
          {canCreateInvitations && (
            <Ui.Button size="sm" onClick={() => addInvitation(workspaceId)}>
              <Plus className="size-4" aria-hidden="true" />
              {_("create-invitation")}
            </Ui.Button>
          )}
        </div>

        {/* Invitations list */}
        <div className="space-y-2">
          {filteredInvitations.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <Mail className="mx-auto mb-4 size-12 opacity-50" aria-hidden="true" />
              <p>{_("no-invitations-found")}</p>
              {canCreateInvitations && <p className="mt-2 text-sm">{_("create-first-invitation")}</p>}
            </div>
          ) : (
            filteredInvitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                canDelete={canCreateInvitations}
                onDelete={() => handleDeleteInvitation(invitation.id)}
              />
            ))
          )}
        </div>
      </AuthDialogContent>
      <WorkspacesDialogInvitationsAdd {...addInvitationProps} />
    </>
  )
}

/**
 * Invitation card component
 */
const InvitationCard: React.FC<{
  invitation: Api.WorkspaceInvitation
  canDelete: boolean
  onDelete: () => void
}> = ({ invitation, canDelete, onDelete }) => {
  const { _, format } = useTranslation(dictionary)

  const getStatusColor = (status: string) => {
    return match(status)
      .with("pending", () => "text-yellow-600")
      .with("accepted", () => "text-green-600")
      .with("refused", () => "text-red-600")
      .otherwise(() => "text-gray-600")
  }

  return (
    <div className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors">
      <div className="bg-muted flex size-10 items-center justify-center rounded-md">
        <Mail className="text-muted-foreground size-5" aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{invitation.email}</p>
          <span className={`rounded-full border px-2 py-0.5 text-xs ${getStatusColor(invitation.status)}`}>{_(invitation.status)}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:size-4">
          <UserPlus aria-hidden />
          <Ui.SrOnly>{_("role")}</Ui.SrOnly>
          <span className="capitalize">{_(invitation.role)}</span>
          <span>•</span>
          <Calendar aria-hidden />
          <Ui.SrOnly>{_("created-at")}</Ui.SrOnly>
          <span>{format(invitation.createdAt, "PPPp")}</span>
        </div>
      </div>

      {/* Actions */}
      {canDelete && invitation.status === "pending" && (
        <Ui.Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 aria-hidden />
          <Ui.SrOnly>{_("delete-invitation")}</Ui.SrOnly>
        </Ui.Button>
      )}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Invitations",
    description: "Manage workspace invitations ({{count}} invitations).",
    "error-title": "Error",
    "error-description": "Failed to load workspace invitations. Please try again.",
    "create-invitation": "Invite member",
    "quick-invite": "Quick invite",
    "no-invitations-found": "No invitations found.",
    "create-first-invitation": "Invite your first member to get started.",
    "search-placeholder": "Search invitations...",
    "delete-invitation": "Delete invitation",
    "error-create": "Failed to create invitation",
    "error-delete": "Failed to delete invitation",
    "email-label": "Email address",
    "email-placeholder": "Enter email address",
    "created-at": "Created at",
    role: "Role",
    "role-label": "Role",
    "role-placeholder": "Select role",
    "send-invitation": "Send invitation",
    cancel: "Cancel",
    pending: "Pending",
    accepted: "Accepted",
    refused: "Refused",
    member: "Member",
    admin: "Admin",
    owner: "Owner",
    "confirm-delete-invitation": {
      title: "Delete invitation",
      description: "This invitation will be permanently deleted and can no longer be used. This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Delete invitation",
    },
  },
  fr: {
    title: "Invitations",
    description: "Gérer les invitations de l'espace ({{count}} invitations).",
    "error-title": "Erreur",
    "error-description": "Impossible de charger les invitations. Veuillez réessayer.",
    "create-invitation": "Inviter un membre",
    "quick-invite": "Invitation rapide",
    "no-invitations-found": "Aucune invitation trouvée.",
    "create-first-invitation": "Invitez votre premier membre pour commencer.",
    "search-placeholder": "Rechercher des invitations...",
    "delete-invitation": "Supprimer l'invitation",
    "error-create": "Impossible de créer l'invitation",
    "error-delete": "Impossible de supprimer l'invitation",
    "email-label": "Adresse email",
    "email-placeholder": "Saisissez l'adresse email",
    "created-at": "Créé le",
    role: "Rôle",
    "role-label": "Rôle",
    "role-placeholder": "Sélectionnez un rôle",
    "send-invitation": "Envoyer l'invitation",
    cancel: "Annuler",
    pending: "En attente",
    accepted: "Acceptée",
    refused: "Refusée",
    member: "Membre",
    admin: "Admin",
    owner: "Propriétaire",
    "confirm-delete-invitation": {
      title: "Supprimer l'invitation",
      description: "Cette invitation sera définitivement supprimée et ne pourra plus être utilisée. Cette action est irréversible.",
      cancel: "Annuler",
      confirm: "Supprimer l'invitation",
    },
  },
  de: {
    title: "Einladungen",
    description: "Arbeitsbereich-Einladungen verwalten ({{count}} Einladungen).",
    "error-title": "Fehler",
    "error-description": "Die Einladungen konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
    "create-invitation": "Mitglied einladen",
    "quick-invite": "Schnelleinladung",
    "no-invitations-found": "Keine Einladungen gefunden.",
    "create-first-invitation": "Laden Sie Ihr erstes Mitglied ein, um zu beginnen.",
    "search-placeholder": "Einladungen suchen...",
    "delete-invitation": "Einladung löschen",
    "error-create": "Einladung konnte nicht erstellt werden",
    "error-delete": "Einladung konnte nicht gelöscht werden",
    "email-label": "E-Mail-Adresse",
    "email-placeholder": "E-Mail-Adresse eingeben",
    "created-at": "Erstellt am",
    role: "Rolle",
    "role-label": "Rolle",
    "role-placeholder": "Rolle auswählen",
    "send-invitation": "Einladung senden",
    cancel: "Abbrechen",
    pending: "Ausstehend",
    accepted: "Angenommen",
    refused: "Abgelehnt",
    member: "Mitglied",
    admin: "Administrator",
    owner: "Eigentümer",
    "confirm-delete-invitation": {
      title: "Einladung löschen",
      description:
        "Diese Einladung wird dauerhaft gelöscht und kann nicht mehr verwendet werden. Diese Aktion kann nicht rückgängig gemacht werden.",
      cancel: "Abbrechen",
      confirm: "Einladung löschen",
    },
  },
}
