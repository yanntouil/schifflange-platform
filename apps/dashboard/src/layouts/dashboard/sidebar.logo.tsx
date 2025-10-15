import { useWorkspaces } from "@/features/workspaces"
import { Api, service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cx } from "class-variance-authority"
import { Layers2 } from "lucide-react"
import React from "react"

/**
 * SidebarLogo
 * if current workspace customized the logo and the name otherwise use the default
 */
export const SidebarLogo: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { state } = Ui.useSidebar()
  const { currentWorkspace } = useWorkspaces()

  return (
    <div className={cx("flex h-8 items-center justify-start", state === "collapsed" ? "w-8" : "w-full")}>
      {currentWorkspace ? <CustomizedLogo workspace={currentWorkspace} /> : <DefaultLogo />}
    </div>
  )
}

/**
 * CustomizedLogo
 */
const CustomizedLogo: React.FC<{ workspace: Api.Workspace & Api.WithProfile }> = ({ workspace }) => {
  const { _ } = useTranslation(dictionary)
  const logo = service.getImageUrl(workspace.profile?.logo, "preview")
  const image = service.getImageUrl(workspace.image, "preview")
  return (
    <span className="flex h-full items-center justify-center gap-4">
      <span className="flex size-8 h-full items-center justify-center">
        {logo ? (
          <Ui.Image src={logo} className="size-8 shrink-0 rounded-sm" aria-label={_("logo-aria-label")} />
        ) : image ? (
          <Ui.Image src={image} className="size-8 shrink-0 rounded-sm" aria-label={_("logo-aria-label")} />
        ) : (
          <Layers2 className="size-5 shrink-0" aria-label={_("logo-aria-label")} />
        )}
      </span>
      <span className="text-base">{_("logo-text")}</span>
    </span>
  )
}

/**
 * DefaultLogo
 * this is the default logo for the sidebar header
 */
const DefaultLogo: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <span className="flex h-full items-center justify-center gap-4">
      <span className="flex size-8 h-full items-center justify-center">
        <Layers2 className="size-5 shrink-0" aria-label={_("logo-aria-label")} />
      </span>
      <span className="text-base">{_("logo-text")}</span>
    </span>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "logo-aria-label": "Compo",
    "logo-text": "Dashboard",
  },
  en: {
    "logo-aria-label": "Compo",
    "logo-text": "Dashboard",
  },
  de: {
    "logo-aria-label": "Compo",
    "logo-text": "Dashboard",
  },
}
