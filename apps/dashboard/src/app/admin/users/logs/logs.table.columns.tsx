import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { type ColumnDef } from "@tanstack/react-table"
import { ColumnCreatedAt, ColumnCreatedBy, ColumnEvent, ColumnIpAddress, ColumnMetadata } from "./logs.table"

/**
 * define columns
 */
export const columns: ColumnDef<Api.Admin.SecurityLog>[] = [
  {
    header: "event-label",
    id: "event",
    cell: ({ row }) => <ColumnEvent row={row} />,
    size: 400,
    minSize: 200,
    maxSize: 2400,
  },
  {
    header: "ip-address-label",
    id: "ip-address",
    cell: ({ row }) => <ColumnIpAddress row={row} />,
    ...Dashboard.makeColumnSize({ size: 150 }),
  },
  {
    header: "created-by-label",
    id: "created-by",
    cell: ({ row }) => <ColumnCreatedBy row={row} />,
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
