import { useLoadWorkspaces, useWorkspaceStore, workspaceStore } from "@/features/workspaces"
import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { A, cxm, D, match, placeholder } from "@compo/utils"
import { Plus } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { dashboardRoutesByType } from "."
import { WorkspaceAvatar } from "../../features/workspaces/components/avatar"

const { signInToWorkspace, acceptInvitation, refuseInvitation } = workspaceStore.actions
type Invitation = Api.WorkspaceInvitation & { workspace: Api.Workspace }
/**
 * Root dashboard page
 * update workspaces store and render the workspace selector to switch between workspaces
 */
const Page: React.FC = () => {
  const { workspaces, invitations, isInitialized } = useLoadWorkspaces()
  if (!isInitialized) return <Skeleton />
  return <WorkspaceSelector workspaces={workspaces} invitations={invitations} />
}

export default Page

/**
 * Skeleton for the page
 */
const Skeleton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{_("welcome-title")}</h1>
          <p className="text-muted-foreground mt-2">{_("loading")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Ui.Card.Root key={i} className="animate-pulse">
              <Ui.Card.Header className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-muted size-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-4 rounded" />
                    <div className="bg-muted h-3 w-2/3 rounded" />
                  </div>
                </div>
              </Ui.Card.Header>
            </Ui.Card.Root>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Workspace Selector
 */
const WorkspaceSelector: React.FC<{
  workspaces: (Api.Workspace & Api.AsMemberOfWorkspace)[]
  invitations: Invitation[]
}> = ({ workspaces, invitations }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-medium">{_("welcome-title")}</h1>
          <p className="text-muted-foreground mt-2">{workspaces.length === 0 ? _("no-workspaces") : _("welcome-description")}</p>
        </div>
        {workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg">{_("no-workspaces-description")}</p>
            {/* <CreateWorkspaceCard /> */}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {A.map(workspaces, (workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}

            {/* <CreateWorkspaceCard /> */}
          </div>
        )}

        {invitations.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-medium">{_("pending-invitations")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {A.map(invitations, (invitation) => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Workspace Card for selection
 */
const WorkspaceCard: React.FC<{
  workspace: Api.Workspace & Api.AsMemberOfWorkspace
}> = ({ workspace }) => {
  const { _ } = useTranslation(dictionary)
  const [isLoading, setIsLoading] = React.useState(false)
  const [, navigate] = useLocation()
  const selectWorkspace = async () => {
    setIsLoading(true)
    match(await signInToWorkspace(workspace.id))
      .with({ ok: true }, ({ data }) => {
        navigate(dashboardRoutesByType(data.workspace.type))
      })
      .otherwise((error) => {})
    setIsLoading(false)
  }

  return (
    <Ui.Card.Root className="relative transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <Ui.Card.Header className="pb-6">
        <div className="flex items-center gap-3">
          <WorkspaceAvatar workspace={workspace} size="size-12" classNames={{ fallback: "text-base [&>svg]:size-6" }} />
          <div className="min-w-0 flex-1">
            <Ui.Card.Title className="truncate text-base font-semibold">{workspace.name}</Ui.Card.Title>
            <Ui.Card.Description className="flex items-center gap-2">
              <span>
                {workspace.totalMembers} {workspace.totalMembers === 1 ? _("member") : _("members")}
              </span>
              <span>•</span>
              <span className={workspace.memberRole === "owner" ? "text-blue-600" : "text-green-600"}>{_(workspace.memberRole)}</span>
            </Ui.Card.Description>
          </div>
        </div>
      </Ui.Card.Header>
      <button
        className={cxm("absolute -inset-0.5 size-[calc(var(--spacing)+100%)] rounded", variants.focusVisible())}
        type="button"
        onClick={selectWorkspace}
        disabled={isLoading}
      >
        <Ui.SrOnly>{_("select-workspace", { name: workspace.name })}</Ui.SrOnly>
      </button>
    </Ui.Card.Root>
  )
}

/**
 * Invitation Card
 */
const InvitationCard: React.FC<{ invitation: Invitation }> = ({ invitation }) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const currentWorkspace = useWorkspaceStore(D.prop("currentWorkspace"))
  const [isLoading, setIsLoading] = React.useState<"accept" | "refuse" | null>(null)

  const handleAccept = async () => {
    setIsLoading("accept")
    const result = await acceptInvitation(invitation.id)
    setIsLoading(null)
    if (result) {
      return currentWorkspace && navigate(dashboardRoutesByType(currentWorkspace.type))
    } else {
      Ui.toast.error(_("invitation-accepted-error"))
    }
  }

  const handleRefuse = async () => {
    setIsLoading("refuse")
    const result = await refuseInvitation(invitation.id)
    setIsLoading(null)
    if (!result) {
      Ui.toast.error(_("invitation-refused-error"))
    }
  }
  const invitedBy = placeholder(`${invitation.createdBy?.profile.firstname} ${invitation.createdBy?.profile.lastname}`, _("unnamed-user"))

  return (
    <Ui.Card.Root className="transition-all duration-300 hover:shadow-md">
      <Ui.Card.Header className="pb-3">
        <div className="flex items-center gap-3">
          <WorkspaceAvatar workspace={invitation.workspace} size="size-12" classNames={{ fallback: "text-base [&>svg]:size-6" }} />

          <div className="min-w-0 flex-1">
            <Ui.Card.Title className="truncate text-base font-semibold">{invitation.workspace.name}</Ui.Card.Title>
            <Ui.Card.Description className="text-xs">{_("invited-by", { name: invitedBy })}</Ui.Card.Description>
          </div>
        </div>
      </Ui.Card.Header>
      <Ui.Card.Footer className="flex gap-2">
        <Ui.Button variant="outline" size="xs" className="flex-1" onClick={handleRefuse} disabled={isLoading !== null}>
          {isLoading === "refuse" ? _("refusing") : _("refuse")}
        </Ui.Button>
        <Ui.Button size="xs" className="flex-1" onClick={handleAccept} disabled={isLoading !== null}>
          {isLoading === "accept" ? _("accepting") : _("accept")}
        </Ui.Button>
      </Ui.Card.Footer>
    </Ui.Card.Root>
  )
}

/**
 * Create Workspace Card
 */
const CreateWorkspaceCard: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  const handleCreate = () => {
    // TODO: Open create workspace dialog
    console.log("Create new workspace")
  }

  return (
    <Ui.Card.Root
      className="cursor-pointer border-dashed transition-all hover:scale-[1.02] hover:border-solid hover:shadow-md"
      onClick={handleCreate}
    >
      <Ui.Card.Header className="pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
            <Plus className="text-muted-foreground size-6" />
          </div>
          <div className="flex-1">
            <Ui.Card.Title className="text-base font-semibold">{_("create-workspace")}</Ui.Card.Title>
            <p className="text-muted-foreground text-sm">{_("create-workspace-description")}</p>
          </div>
        </div>
      </Ui.Card.Header>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "welcome-title": "Welcome back!",
    "welcome-description": "Select a workspace to continue",
    "no-workspaces": "You don't have any workspaces yet",
    "no-workspaces-description": "Contact your administrator to get access to a workspace.",
    "create-workspace": "Create Workspace",
    "create-workspace-description": "Start a new project",
    "select-workspace": "Select workspace {{name}}",
    "pending-invitations": "Pending Invitations",
    "invited-by": "Invited by {{name}}",
    accept: "Accept",
    refuse: "Decline",
    accepting: "Accepting...",
    refusing: "Declining...",
    loading: "Loading your workspaces...",
    "error-title": "Error",
    "error-description": "Failed to load workspaces. Please try again.",
    member: "member",
    members: "members",
    owner: "Owner",
    admin: "Admin",
  },
  fr: {
    "welcome-title": "Bon retour !",
    "welcome-description": "Sélectionnez un espace de travail pour continuer",
    "no-workspaces": "Vous n'avez pas encore d'espaces de travail",
    "no-workspaces-description": "Contactez votre administrateur pour obtenir l'accès à un espace de travail.",
    "create-workspace": "Créer un espace",
    "create-workspace-description": "Démarrer un nouveau projet",
    "select-workspace": "Sélectionner l'espace de travail {{name}}",
    "pending-invitations": "Invitations en attente",
    "invited-by": "Invité par {{name}}",
    accept: "Accepter",
    refuse: "Refuser",
    accepting: "Acceptation...",
    refusing: "Refus...",
    loading: "Chargement de vos espaces...",
    "error-title": "Erreur",
    "error-description": "Impossible de charger les espaces. Veuillez réessayer.",
    member: "membre",
    members: "membres",
    owner: "Propriétaire",
    admin: "Admin",
  },
  de: {
    "welcome-title": "Willkommen zurück!",
    "welcome-description": "Wählen Sie einen Arbeitsbereich zum Fortfahren",
    "no-workspaces": "Sie haben noch keine Arbeitsbereiche",
    "no-workspaces-description": "Kontaktieren Sie Ihren Administrator, um Zugang zu einem Arbeitsbereich zu erhalten.",
    "create-workspace": "Arbeitsbereich erstellen",
    "create-workspace-description": "Neues Projekt starten",
    "select-workspace": "Arbeitsbereich {{name}} auswählen",
    "pending-invitations": "Ausstehende Einladungen",
    "invited-by": "Eingeladen von {{name}}",
    accept: "Annehmen",
    refuse: "Ablehnen",
    accepting: "Wird angenommen...",
    refusing: "Wird abgelehnt...",
    loading: "Ihre Arbeitsbereiche werden geladen...",
    "error-title": "Fehler",
    "error-description": "Arbeitsbereiche konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
    member: "Mitglied",
    members: "Mitglieder",
    owner: "Eigentümer",
    admin: "Administrator",
  },
}
