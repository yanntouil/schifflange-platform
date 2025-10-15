import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { type ColumnDef } from "@tanstack/react-table"
import { UserDetails } from "../../users/users.details"
import { WorkspaceDetails } from "../workspaces.details"
import { ColumnCreatedAt, ColumnEvent, ColumnMetadata } from "./logs.table"

/**
 * define columns
 */
export const columns: ColumnDef<Api.Admin.WorkspaceLog>[] = [
  {
    header: "event-label",
    id: "event",
    cell: ({ row }) => <ColumnEvent row={row} />,
    size: 400,
    minSize: 200,
    maxSize: 2400,
  },
  {
    header: "workspace-label",
    id: "workspace",
    cell: ({ row }) => <WorkspaceDetails workspace={row.original.workspace} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    header: "created-by-label",
    id: "created-by",
    cell: ({ row }) => <UserDetails user={row.original.user} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    header: "created-at-label",
    id: "created-at",
    cell: ({ row }) => <ColumnCreatedAt row={row} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    id: "metadata",
    cell: ({ row }) => <ColumnMetadata row={row} />,
    size: 56,
    enableHiding: false,
    enableResizing: false,
    enablePinning: true,
  },
]
