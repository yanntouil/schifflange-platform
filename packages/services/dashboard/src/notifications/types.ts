import { Workspace } from "../types"

/**
 * notification types
 */
export type NotificationInvitationToJoinWorkspace = {
  type: "invitation-to-join-workspace"
  workspace: Workspace
  metadata: {
    senderId: string
    senderProfile: {
      firstname: string
      lastname: string
    }
  }
}
export type NotificationWorkspaceUpdated = {
  type: "workspace-updated"
  workspace: Workspace
  metadata: {
    changes: Record<string, any>
    updatedById: string
    updatedByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export type NotificationWorkspaceDeleted = {
  type: "workspace-deleted"
  workspace: Workspace
  metadata: {
    deletedById: string
    deletedByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export type NotificationWorkspaceMemberUpdated = {
  type: "workspace-member-updated"
  workspace: Workspace
  metadata: {
    changes: Record<string, any>
    updatedById: string
    updatedByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export type NotificationWorkspaceMemberRemoved = {
  type: "workspace-member-removed"
  workspace: Workspace
  metadata: {
    removedById: string
    removedByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export type NotificationWorkspaceMemberLeft = {
  type: "workspace-member-left"
  workspace: Workspace
  metadata: {
    leftById: string
    leftByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export type NotificationWorkspaceMemberAttached = {
  type: "workspace-member-attached"
  workspace: Workspace
  metadata: {
    attachedById: string
    attachedByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export type NotificationAccountUpdated = {
  type: "account-updated"
  metadata: {
    changes: Record<string, string>
    updatedById: string
    updatedByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export type NotificationAccountProfileUpdated = {
  type: "account-profile-updated"
  metadata: {
    changes: Record<string, string>
    updatedById: string
    updatedByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export type NotificationAccountDeleted = {
  type: "account-deleted"
  metadata: {
    deletedById: string
    deletedByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export type NotificationAccountTakeover = {
  relatedType: "user"
  relatedId: string
  type: "account-takeover"
  metadata: {
    signedInById: string
    signedInByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export type NotificationVariant =
  | NotificationInvitationToJoinWorkspace
  | NotificationWorkspaceUpdated
  | NotificationWorkspaceDeleted
  | NotificationWorkspaceMemberUpdated
  | NotificationWorkspaceMemberRemoved
  | NotificationWorkspaceMemberLeft
  | NotificationWorkspaceMemberAttached
  | NotificationAccountUpdated
  | NotificationAccountProfileUpdated
  | NotificationAccountDeleted
  | NotificationAccountTakeover

export type NotificationStatus = "unread" | "read"
export type NotificationPriority = "low" | "default" | "high"
export type NotificationGroupedType = "account" | "invitation" | "workspace"

export type Notification = {
  id: string
  userId: string
  workspaceId: string | null
  status: NotificationStatus
  priority: NotificationPriority
  expiresAt: string | null
  deliveredAt: string | null
  createdAt: string
  updatedAt: string
} & NotificationVariant
