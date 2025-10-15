import { Api } from "@/services"
import { DoorClosedLocked, LucideProps, SquareCheckBig, SquareDashed } from "lucide-react"
import React from "react"

/**
 * Status icon
 */
export const StatusIcon: React.FC<{ status: Api.WorkspaceStatus } & LucideProps> = ({ status, ...props }) =>
  match(status)
    .with("active", () => <SquareCheckBig aria-hidden {...props} />)
    .with("deleted", () => <SquareDashed aria-hidden {...props} />)
    .with("suspended", () => <DoorClosedLocked aria-hidden {...props} />)
    .otherwise(() => <></>)
