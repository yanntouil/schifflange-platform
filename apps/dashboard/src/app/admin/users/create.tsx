import { Api } from "@/services"
import { Ui } from "@compo/ui"
import { G } from "@compo/utils"
import React from "react"
import { Account } from "./create.account"
import { Profile } from "./create.profile"

/**
 * Admin users create page
 */
export const CreateUserDialog: React.FC<{ children?: React.ReactNode } & Partial<Ui.QuickDialogProps<void, Api.Admin.User>>> = ({
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
  const [user, setUser] = React.useState<Api.Admin.User | null>(null)

  const onAccountCreate = (user: Api.Admin.User) => {
    setUser(user)
    setStep("profile")
  }

  if (step === "profile" && user) return <Profile user={user} />
  return <Account onCreate={onAccountCreate} />
}
