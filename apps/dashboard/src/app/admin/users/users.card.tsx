import { Api, service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, pipe, placeholder, T } from "@compo/utils"
import { LanguagesIcon, LogInIcon } from "lucide-react"
import React from "react"
import { useUsers } from "./context"
import { RoleIcon } from "./users.icons"
import { UserMenu } from "./users.menu"

/**
 * UserCards
 * display a list of users as cards with a menu and a checkbox (grid list)
 */
export const UserCards: React.FC<{ users: Api.Admin.User[] }> = ({ users }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(users, (user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </section>
  )
}

/**
 * UserCard
 * display a user as a card
 */
const UserCard: React.FC<{ user: Api.Admin.User }> = ({ user }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { selectable, display } = useUsers()
  const fullname = placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("placeholder"))
  const image = service.getImageUrl(user.profile.image) as string
  const sessions = React.useMemo(
    () =>
      pipe(
        user.sessions ?? [],
        A.filter(D.prop("isActive")),
        A.sort((a, b) => (T.isBefore(b.lastActivity, a.lastActivity) ? -1 : 1))
      ),
    [user.sessions]
  )
  const lastActivity = A.head(sessions)?.lastActivity

  return (
    <Dashboard.Card.Root
      key={user.id}
      menu={<UserMenu user={user} />}
      item={user}
      selectable={selectable}
      {...smartClick(user, selectable, () => display(user))}
    >
      <Dashboard.Card.Image src={image} alt={fullname} />
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{fullname}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{user.email}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          <LanguagesIcon aria-hidden />
          {_("language-label", { language: _(`language-${user.language?.code}`) })}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field
          tooltip={_("last-activity-label", { date: lastActivity ? format(T.parseISO(lastActivity), "PPPp") : _("last-activity-never") })}
        >
          <LogInIcon aria-hidden />
          {_("last-activity-label", { date: lastActivity ? formatDistance(T.parseISO(lastActivity)) : _("last-activity-never") })}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field>
          <RoleIcon role={user.role} />
          {_("role-label", { role: _(`role-${user.role}`) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
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
