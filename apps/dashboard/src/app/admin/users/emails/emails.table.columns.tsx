import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { type ColumnDef } from "@tanstack/react-table"
import {
  ColumnCreatedAt,
  ColumnCreatedBy,
  ColumnEmail,
  ColumnMetadata,
  ColumnRetryAttempts,
  ColumnStatus,
  ColumnSubject,
  ColumnTemplate,
} from "./emails.table"

/**
 * define columns
 */
export const columns: ColumnDef<Api.Admin.EmailLog>[] = [
  {
    header: "status-label",
    id: "status",
    cell: ({ row }) => <ColumnStatus row={row} />,
    size: 200,
    minSize: 150,
    maxSize: 400,
  },
  {
    header: "email-label",
    id: "email",
    cell: ({ row }) => <ColumnEmail row={row} />,
    ...Dashboard.makeColumnSize({ size: 250 }),
  },
  {
    header: "template-label",
    id: "template",
    cell: ({ row }) => <ColumnTemplate row={row} />,
    ...Dashboard.makeColumnSize({ size: 200 }),
  },
  {
    header: "subject-label",
    id: "subject",
    cell: ({ row }) => <ColumnSubject row={row} />,
    ...Dashboard.makeColumnSize({ size: 300 }),
  },
  {
    header: "retry-attempts-label",
    id: "retry-attempts",
    cell: ({ row }) => <ColumnRetryAttempts row={row} />,
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
