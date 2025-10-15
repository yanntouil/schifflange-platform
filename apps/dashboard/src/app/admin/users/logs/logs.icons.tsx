import { Api } from "@/services"
import { LockIcon, LogIn, LucideProps, Mail, ShieldCheck, TimerReset, UserPen, UserRoundCog } from "lucide-react"
import React from "react"
import { getEventGroup } from "./utils"

/**
 * display an icon based on the event group
 */
export const GroupIcon: React.FC<{ event: Api.Admin.SecurityEventType } & LucideProps> = ({ event, ...props }) => {
  const group = getEventGroup(event)
  return match(group)
    .with("auth", () => <LogIn {...props} aria-hidden />)
    .with("email", () => <Mail {...props} aria-hidden />)
    .with("password", () => <LockIcon {...props} aria-hidden />)
    .with("accountStatus", () => <LockIcon {...props} aria-hidden />)
    .with("accountActivity", () => <UserPen {...props} aria-hidden />)
    .with("session", () => <TimerReset {...props} aria-hidden />)
    .with("userManagement", () => <UserRoundCog {...props} aria-hidden />)
    .with("adminManagement", () => <ShieldCheck {...props} aria-hidden />)
    .otherwise(() => null)
}
