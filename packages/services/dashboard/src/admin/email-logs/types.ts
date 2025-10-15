import { User } from "../types"

export type EmailLog = {
  id: string
  userId: string | null
  user: User | null
  email: string
  template: string
  subject: string
  status: EmailStatus
  metadata: Record<string, unknown>
  retryAttempts: number
  createdAt: string
  updatedAt: string
}
export type EmailStatus = "queued" | "sent" | "failed"
