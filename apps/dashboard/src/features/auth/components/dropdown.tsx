import signInRouteTo from "@/app/sign-in"
import { AuthLabel, authStore } from "@/features/auth"
import { WorkspaceMenu } from "@/features/workspaces/components/menu"
import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import React from "react"
import { useLocation } from "wouter"
import { useAuthDialog } from "./dialog/context"

/**
 * AuthDropdown
 * This component is used to display the user dropdown menu
 */
type AuthDropdownProps = {
  children: React.ReactNode
} & Pick<React.ComponentProps<typeof Ui.DropdownMenu.Content>, "sideOffset" | "align" | "side">
export const AuthDropdown: React.FC<AuthDropdownProps> = ({ children, sideOffset = 4, align = "end", side = "bottom" }) => {
  const { _, languages, language, setLanguage, isLocalizeLanguage } = useTranslation(dictionary)
  const { tab, setTab } = useAuthDialog()
  const [, navigate] = useLocation()
  const handleTabClick = (type: "notifications" | "profile" | "authentication") => {
    setTab({ type, params: {} })
  }

  const logout = () => {
    authStore.actions.logout()
    navigate(signInRouteTo())
  }
  const changeLanguage = (language: string) => {
    if (isLocalizeLanguage(language)) {
      setLanguage(language)
    }
  }
  const authenticationRef = React.useRef<Icon.KeySquareHandle>(null)
  const profileRef = React.useRef<Icon.UserHandle>(null)
  const notificationsRef = React.useRef<Icon.BellHandle>(null)
  const languagesRef = React.useRef<Icon.LanguagesHandle>(null)
  const logoutRef = React.useRef<Icon.LogoutHandle>(null)
  return (
    <Ui.Tooltip.Root>
      <Ui.DropdownMenu.Root>
        <Ui.Tooltip.Trigger asChild>
          <Ui.DropdownMenu.Trigger asChild>{children}</Ui.DropdownMenu.Trigger>
        </Ui.Tooltip.Trigger>
        <Ui.DropdownMenu.Content
          sideOffset={sideOffset}
          align={align}
          side={side}
          className="w-[max(var(--radix-popper-anchor-width),16rem)]"
        >
          <Ui.DropdownMenu.Label className="flex items-center gap-2 p-0 px-1 py-1.5">
            <AuthLabel />
          </Ui.DropdownMenu.Label>
          <Ui.DropdownMenu.Separator />
          <Ui.DropdownMenu.Label>{_("account")}</Ui.DropdownMenu.Label>
          {/* authentication */}
          <Ui.DropdownMenu.Item
            onClick={() => handleTabClick("authentication")}
            onMouseEnter={() => authenticationRef.current?.startAnimation()}
            onMouseLeave={() => authenticationRef.current?.stopAnimation()}
          >
            <Icon.KeySquare ref={authenticationRef} className="size-4" aria-hidden />
            {_("authentication")}
          </Ui.DropdownMenu.Item>
          {/* profile */}
          <Ui.DropdownMenu.Item
            onClick={() => handleTabClick("profile")}
            onMouseEnter={() => profileRef.current?.startAnimation()}
            onMouseLeave={() => profileRef.current?.stopAnimation()}
          >
            <Icon.IdCard ref={profileRef} className="size-4" aria-hidden />
            {_("profile")}
          </Ui.DropdownMenu.Item>
          {/* notifications */}
          <Ui.DropdownMenu.Item
            onClick={() => handleTabClick("notifications")}
            onMouseEnter={() => notificationsRef.current?.startAnimation()}
            onMouseLeave={() => notificationsRef.current?.stopAnimation()}
          >
            <Icon.Bell ref={notificationsRef} className="size-4" aria-hidden />
            {_("notifications")}
          </Ui.DropdownMenu.Item>
          <Ui.DropdownMenu.Separator />
          <Ui.DropdownMenu.Sub>
            <Ui.DropdownMenu.SubTrigger
              onMouseEnter={() => languagesRef.current?.startAnimation()}
              onMouseLeave={() => languagesRef.current?.stopAnimation()}
            >
              <Icon.Languages ref={languagesRef} className="size-4" aria-hidden />
              {_("languages")}
            </Ui.DropdownMenu.SubTrigger>
            <Ui.DropdownMenu.Portal>
              <Ui.DropdownMenu.SubContent>
                {languages.map((current) => (
                  <Ui.DropdownMenu.CheckboxItem
                    key={current}
                    checked={language === current}
                    onCheckedChange={(value) => value && changeLanguage(current)}
                  >
                    {_(`languages-${current}`)}
                  </Ui.DropdownMenu.CheckboxItem>
                ))}
              </Ui.DropdownMenu.SubContent>
            </Ui.DropdownMenu.Portal>
          </Ui.DropdownMenu.Sub>
          <Ui.DropdownMenu.Separator />
          <WorkspaceMenu />
          <Ui.DropdownMenu.Separator />
          {/* signOut */}
          <Ui.DropdownMenu.Item
            onClick={logout}
            onMouseEnter={() => logoutRef.current?.startAnimation()}
            onMouseLeave={() => logoutRef.current?.stopAnimation()}
          >
            <Icon.Logout ref={logoutRef} className="size-4" aria-hidden />
            {_("logout")}
          </Ui.DropdownMenu.Item>
        </Ui.DropdownMenu.Content>
        <Ui.Tooltip.Content side="right" align="center">
          <span>{_("tooltip")}</span>
        </Ui.Tooltip.Content>
      </Ui.DropdownMenu.Root>
    </Ui.Tooltip.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    account: "Mon compte",
    authentication: "Mettre à jour votre compte",
    profile: "Modifier votre profil",
    notifications: "Afficher les notifications",
    languages: "Changer votre langue",
    "languages-fr": "Français",
    "languages-en": "Anglais",
    "languages-de": "Allemand",
    logout: "Se déconnecter",
    tooltip: "Ouvrir le menu utilisateur",
  },
  en: {
    account: "My account",
    authentication: "Update your account",
    profile: "Edit your profile",
    notifications: "Display notifications",
    languages: "Change your language",
    "languages-fr": "French",
    "languages-en": "English",
    "languages-de": "German",
    logout: "Sign out",
    tooltip: "Open user menu",
  },
  de: {
    account: "Mein Konto",
    authentication: "Ihr Konto aktualisieren",
    profile: "Ihr Profil bearbeiten",
    notifications: "Benachrichtigungen anzeigen",
    languages: "Ihre Sprache ändern",
    "languages-fr": "Französisch",
    "languages-en": "Englisch",
    "languages-de": "Deutsch",
    logout: "Abmelden",
    tooltip: "Benutzermenü öffnen",
  },
}
