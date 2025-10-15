import { Api, service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import { Layers2 } from "lucide-react"
import React from "react"
import { useWorkspaces } from "./context"
import { WorkspaceMenu } from "./workspaces.menu"

/**
 * UserCards
 * display a list of users as cards with a menu and a checkbox (grid list)
 */
export const WorkspacesCards: React.FC<{ workspaces: Api.Admin.Workspace[] }> = ({ workspaces }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(workspaces, (workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </section>
  )
}

/**
 * UserCard
 * display a user as a card
 */
const WorkspaceCard: React.FC<{ workspace: Api.Admin.Workspace }> = ({ workspace }) => {
  const { _ } = useTranslation(dictionary)
  const { selectable, display } = useWorkspaces()
  const image = service.getImageUrl(workspace.image) as string

  return (
    <Dashboard.Card.Root
      key={workspace.id}
      menu={<WorkspaceMenu workspace={workspace} />}
      item={workspace}
      selectable={selectable}
      {...smartClick(workspace, selectable, () => display(workspace))}
    >
      <Dashboard.Card.Image src={image} alt={workspace.name}>
        <Layers2 aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{workspace.name}</Dashboard.Card.Title>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content></Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    placeholder: "Unnamed user",

    "last-activity-label": "Last activity: {{date}}",
    "last-activity-never": "Never",
    "role-label": "Role: {{role}}",
    "role-member": "Member",
    "role-admin": "Admin",
    "role-superadmin": "Super admin",
    "language-label": "Language: {{language}}",
    "language-fr": "French",
    "language-en": "English",
    "language-de": "German",
  },
  fr: {
    "last-activity-label": "Dernière activité: {{date}}",
    "last-activity-never": "Jamais",
    "role-label": "Rôle: {{role}}",
    "role-member": "Membre",
    "role-admin": "Administrateur",
    "role-superadmin": "Super administrateur",
    "language-label": "Langue: {{language}}",
    "language-fr": "Français",
    "language-en": "Anglais",
    "language-de": "Allemand",
  },
  de: {
    placeholder: "Unbenannter Benutzer",
    "last-activity-label": "Letzte Aktivität: {{date}}",
    "last-activity-never": "Niemals",
    "role-label": "Rolle: {{role}}",
    "role-member": "Mitglied",
    "role-admin": "Administrator",
    "role-superadmin": "Super-Administrator",
    "language-label": "Sprache: {{language}}",
    "language-fr": "Französisch",
    "language-en": "Englisch",
    "language-de": "Deutsch",
  },
}
