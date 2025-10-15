import { Api } from "@/services"
import { Ui } from "@compo/ui"
import { G } from "@compo/utils"
import React from "react"
import { Profile } from "./create.profile"
import { Workspace } from "./create.workspace"

/**
 * Admin workspaces create page
 */
export const CreateWorkspaceDialog: React.FC<{ children?: React.ReactNode } & Partial<Ui.QuickDialogProps<void, any>>> = ({
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState(false)
  const onOpenChange = (open: boolean) => {
    setOpen(open)
    props.onOpenChange?.(open)
  }
  const mergeOpen = G.isNotNullable(props.open) ? props.open : open
  return (
    <Ui.QuickDialogRoot open={mergeOpen} onOpenChange={onOpenChange}>
      {children}
      {mergeOpen && <CreateContent />}
    </Ui.QuickDialogRoot>
  )
}

const CreateContent: React.FC = () => {
  const [step, setStep] = React.useState<"account" | "profile">("account")
  const [workspace, setWorkspace] = React.useState<Api.Admin.Workspace | null>(null)

  const onAccountCreate = (workspace: Api.Admin.Workspace) => {
    setWorkspace(workspace)
    setStep("profile")
  }

  if (step === "profile" && workspace) return <Profile workspace={workspace} />
  return <Workspace onCreate={onAccountCreate} />
}
