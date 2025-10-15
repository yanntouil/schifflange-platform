import { Api } from "@/services"
import { BadgeCheck, BadgeX, Clock, LucideProps } from "lucide-react"
import React from "react"

/**
 * display an icon based on the email status
 */
export const StatusIcon: React.FC<{ status: Api.Admin.EmailStatus } & LucideProps> = ({ status, ...props }) => {
  return match(status)
    .with("sent", () => <BadgeCheck {...props} aria-hidden />)
    .with("failed", () => <BadgeX {...props} aria-hidden />)
    .with("queued", () => <Clock {...props} aria-hidden />)
    .otherwise(() => null)
}
