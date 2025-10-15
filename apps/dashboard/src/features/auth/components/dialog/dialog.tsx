import signInRouteTo from "@/app/sign-in"
import { AuthLabel, authStore } from "@/features/auth"
import { WorkspacesDialogConfig } from "@/features/workspaces/components/dialog/config"
import { WorkspacesDialogInvitations } from "@/features/workspaces/components/dialog/invitations"
import { WorkspacesDialogMembers } from "@/features/workspaces/components/dialog/members"
import { WorkspacesDialogSidebar } from "@/features/workspaces/components/dialog/sidebar"
import { useTranslation } from "@compo/localize"
import { Icon, Ui, variants } from "@compo/ui"
import { cxm, match } from "@compo/utils"
import { XIcon } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { AuthDialogAuthentication } from "./authentication"
import { AuthDialogTab } from "./context"
import { AuthDialogNotifications } from "./notifications"
import { AuthDialogProfile } from "./profile"

/**
 * dialog modal with sidebar
 */
export const AuthDialog: React.FC<{ tab: AuthDialogTab; setTab: (tab: AuthDialogTab) => void }> = ({ tab, setTab }) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const logout = () => {
    authStore.actions.logout()
    navigate(signInRouteTo())
  }
  const authenticationRef = React.useRef<Icon.KeySquareHandle>(null)
  const profileRef = React.useRef<Icon.IdCardHandle>(null)
  const notificationsRef = React.useRef<Icon.BellHandle>(null)
  const logoutRef = React.useRef<Icon.LogoutHandle>(null)
  return (
    <Ui.Dialog.Content
      showCloseButton={false}
      classNames={{
        content: "h-[min(calc(100vh),44rem)] w-[min(calc(100vw),72rem)] overflow-hidden",
        wrapper: "p-0 overflow-hidden grid",
      }}
    >
      <Ui.Sidebar.Provider className="isolate grid min-h-full w-full grid-cols-1 md:grid-cols-[auto_1fr]" sidebarWidth="16rem">
        {/* Sidebar Navigation */}
        <Ui.Sidebar.Root collapsible={"icon"} className={cxm("h-full overflow-y-auto", variants.scrollbar({ variant: "thin" }))}>
          {/* header */}
          <Ui.Sidebar.Header className="bg-sidebar sticky top-0 z-10 border-b">
            <div className="flex items-center gap-2 p-0 px-1 py-1.5">
              <AuthLabel classNames={{ avatar: "group-data-[collapsible=icon]:size-6" }} />
            </div>
          </Ui.Sidebar.Header>
          <Ui.Sidebar.Content>
            <Ui.Sidebar.Group>
              <Ui.Sidebar.GroupContent>
                <Ui.Sidebar.GroupLabel>{_("account")}</Ui.Sidebar.GroupLabel>
                <Ui.Sidebar.Menu>
                  {/* Account */}
                  <Ui.Sidebar.MenuItem>
                    <Ui.Sidebar.MenuButton
                      isActive={tab.type === "authentication"}
                      onClick={() => setTab({ type: "authentication", params: { section: "general" } })}
                      tooltip={_("authentication")}
                      onMouseEnter={() => authenticationRef.current?.startAnimation()}
                      onMouseLeave={() => authenticationRef.current?.stopAnimation()}
                    >
                      <Icon.KeySquare ref={authenticationRef} className="size-4" />
                      <span>{_("authentication")}</span>
                    </Ui.Sidebar.MenuButton>
                  </Ui.Sidebar.MenuItem>

                  {/* Profile */}
                  <Ui.Sidebar.MenuItem>
                    <Ui.Sidebar.MenuButton
                      isActive={tab.type === "profile"}
                      onClick={() => setTab({ type: "profile", params: { section: "personal" } })}
                      tooltip={_("profile")}
                      onMouseEnter={() => profileRef.current?.startAnimation()}
                      onMouseLeave={() => profileRef.current?.stopAnimation()}
                    >
                      <Icon.IdCard ref={profileRef} className="size-4" />
                      <span>{_("profile")}</span>
                    </Ui.Sidebar.MenuButton>
                  </Ui.Sidebar.MenuItem>

                  {/* Notifications */}
                  <Ui.Sidebar.MenuItem>
                    <Ui.Sidebar.MenuButton
                      isActive={tab.type === "notifications"}
                      onClick={() => setTab({ type: "notifications", params: { section: "preferences" } })}
                      tooltip={_("notifications")}
                      onMouseEnter={() => notificationsRef.current?.startAnimation()}
                      onMouseLeave={() => notificationsRef.current?.stopAnimation()}
                    >
                      <Icon.Bell ref={notificationsRef} className="size-4" />
                      <span>{_("notifications")}</span>
                    </Ui.Sidebar.MenuButton>
                  </Ui.Sidebar.MenuItem>
                </Ui.Sidebar.Menu>
              </Ui.Sidebar.GroupContent>
            </Ui.Sidebar.Group>
            <WorkspacesDialogSidebar />
          </Ui.Sidebar.Content>
          {/* footer */}
          <Ui.Sidebar.Footer>
            <Ui.Sidebar.Menu>
              {/* signOut */}
              <Ui.Sidebar.MenuItem>
                <Ui.Sidebar.MenuButton
                  onClick={logout}
                  onMouseEnter={() => logoutRef.current?.startAnimation()}
                  onMouseLeave={() => logoutRef.current?.stopAnimation()}
                  tooltip={_("logout")}
                >
                  <Icon.Logout ref={logoutRef} className="size-4" aria-hidden />
                  {_("logout")}
                </Ui.Sidebar.MenuButton>
              </Ui.Sidebar.MenuItem>
            </Ui.Sidebar.Menu>
          </Ui.Sidebar.Footer>
        </Ui.Sidebar.Root>

        {/* Main Content */}
        <main className="relative isolate h-full overflow-y-auto">
          {/* Content */}
          <div className={cxm("", variants.scrollbar({ variant: "thin" }))}>
            {match(tab)
              .with({ type: "authentication" }, (tab) => <AuthDialogAuthentication tab={tab} />)
              .with({ type: "profile" }, (tab) => <AuthDialogProfile tab={tab} />)
              .with({ type: "notifications" }, (tab) => <AuthDialogNotifications tab={tab} />)
              .with({ type: "workspaces-config" }, (tab) => <WorkspacesDialogConfig tab={tab} />)
              .with({ type: "workspaces-members" }, (tab) => <WorkspacesDialogMembers tab={tab} />)
              .with({ type: "workspaces-invitations" }, (tab) => <WorkspacesDialogInvitations tab={tab} />)
              .otherwise(() => null)}
          </div>

          <Ui.Dialog.Close className={cxm(Ui.buttonVariants({ variant: "ghost", icon: true, size: "sm" }), "absolute top-2 right-4 z-10")}>
            <XIcon aria-hidden />
            <Ui.SrOnly>{_("close")}</Ui.SrOnly>
          </Ui.Dialog.Close>
        </main>
      </Ui.Sidebar.Provider>
    </Ui.Dialog.Content>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    account: "Compte",
    authentication: "Authentification",
    profile: "Profil",
    notifications: "Notifications",
    logout: "Se déconnecter",
    close: "Fermer la boîte de dialogue",
  },
  en: {
    account: "Account",
    authentication: "Authentication",
    profile: "Profile",
    notifications: "Notifications",
    logout: "Sign out",
    close: "Close dialog",
  },
  de: {
    account: "Konto",
    authentication: "Authentifizierung",
    profile: "Profil",
    notifications: "Benachrichtigungen",
    logout: "Abmelden",
    close: "Dialog schließen",
  },
}
