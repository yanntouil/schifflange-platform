import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { variants } from "@compo/ui"
import { cxm, placeholder } from "@compo/utils"
import { Glasses } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import adminWorkspacesIdRouteTo from "./[workspaceId]"
import { WorkspaceAvatar } from "./workspaces.avatar"

/**
 * WorkspaceDetails
 * display the details of the workspace or a placeholder
 */
export const WorkspaceDetails: React.FC<{
  workspace: Option<Api.Admin.Workspace>
  classNames?: { wrapper?: string; image?: string; fallback?: string }
  size?: string
}> = ({ workspace, classNames, size = "size-8" }) => {
  const { _ } = useTranslation(dictionary)
  if (!workspace)
    return (
      <div className="inline-flex items-center gap-2">
        <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
          <Glasses className="size-4" aria-hidden />
        </span>
        <span className="truncate font-medium">{_("workspace-unknown")}</span>
      </div>
    )

  const workspaceName = placeholder(workspace.name, _("workspace-placeholder"))
  return (
    <div className="inline-flex items-center gap-2">
      <WorkspaceAvatar workspace={workspace} size="size-8" />
      <Link to={adminWorkspacesIdRouteTo(workspace.id)} className={cxm("truncate font-medium", variants.link())}>
        {workspaceName}
      </Link>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "workspace-placeholder": "Unnamed workspace",
    "workspace-unknown": "Unknown workspace",
  },
  fr: {
    "workspace-placeholder": "Espace de travail sans nom",
    "workspace-unknown": "Espace de travail inconnu",
  },
  de: {
    "workspace-placeholder": "Unbenannter Arbeitsbereich",
    "workspace-unknown": "Unbekannter Arbeitsbereich",
  },
}
