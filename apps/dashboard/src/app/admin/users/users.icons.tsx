import { Api } from "@/services"
import { BanIcon, BugPlay, CircleUserRound, ClockFadingIcon, LucideProps, ShieldUser, UserRoundCheck, UserRoundX } from "lucide-react"
import React from "react"

/**
 * Status icon
 */
export const StatusIcon: React.FC<{ status: Api.Admin.User["status"] } & LucideProps> = ({ status, ...props }) =>
  match(status)
    .with("pending", () => <ClockFadingIcon aria-hidden {...props} />)
    .with("active", () => <UserRoundCheck aria-hidden {...props} />)
    .with("deleted", () => <UserRoundX aria-hidden {...props} />)
    .with("suspended", () => <BanIcon aria-hidden {...props} />)
    .otherwise(() => <></>)

/**
 * Role icon
 */
export const RoleIcon: React.FC<{ role: Api.Admin.User["role"] } & LucideProps> = ({ role, ...props }) =>
  match(role)
    .with("member", () => <CircleUserRound aria-hidden {...props} />)
    .with("admin", () => <ShieldUser aria-hidden {...props} />)
    .with("superadmin", () => <BugPlay aria-hidden {...props} />)
    .otherwise(() => <></>)
