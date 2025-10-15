/**
 * Frontend notification types
 * These should match the backend types from the notification model
 */

export interface NotificationBase {
  id: string
  userId: string
  workspaceId: string | null
  status: 'unread' | 'read'
  priority: 'low' | 'default' | 'high'
  deliveredAt: string | null
  expiresAt: string | null
  updatedAt: string
  createdAt: string
}

export interface NotificationInvitationToJoinWorkspace extends NotificationBase {
  type: 'invitation-to-join-workspace'
  workspace: {
    id: string
    name: string
    description: string | null
  }
  metadata: {
    senderId: string
    senderProfile: {
      firstname: string
      lastname: string
    }
  }
}

export interface NotificationWorkspaceUpdated extends NotificationBase {
  type: 'workspace-updated'
  workspace: {
    id: string
    name: string
    description: string | null
  }
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

export interface NotificationWorkspaceDeleted extends NotificationBase {
  type: 'workspace-deleted'
  workspace: {
    id: string
    name: string
    description: string | null
  }
  metadata: {
    deletedById: string
    deletedByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export interface NotificationWorkspaceMemberUpdated extends NotificationBase {
  type: 'workspace-member-updated'
  workspace: {
    id: string
    name: string
    description: string | null
  }
  metadata: {
    changes: Record<string, any>
    updatedById: string
    updatedByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export interface NotificationWorkspaceMemberRemoved extends NotificationBase {
  type: 'workspace-member-removed'
  workspace: {
    id: string
    name: string
    description: string | null
  }
  metadata: {
    removedById: string
    removedByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export interface NotificationWorkspaceMemberLeft extends NotificationBase {
  type: 'workspace-member-left'
  workspace: {
    id: string
    name: string
    description: string | null
  }
  metadata: {
    leftById: string
    leftByProfile: {
      firstname: string
      lastname: string
    }
  }
}

export interface NotificationWorkspaceMemberAttached extends NotificationBase {
  type: 'workspace-member-attached'
  workspace: {
    id: string
    name: string
    description: string | null
  }
  metadata: {
    attachedById: string
    attachedByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export interface NotificationAccountUpdated extends NotificationBase {
  type: 'account-updated'
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

export interface NotificationAccountProfileUpdated extends NotificationBase {
  type: 'account-profile-updated'
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

export interface NotificationAccountDeleted extends NotificationBase {
  type: 'account-deleted'
  metadata: {
    deletedById: string
    deletedByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export interface NotificationAccountTakeover extends NotificationBase {
  type: 'account-takeover'
  metadata: {
    signedInById: string
    signedInByProfile: {
      firstname: string
      lastname: string
    }
    byAdmin?: boolean
  }
}

export type Notification =
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