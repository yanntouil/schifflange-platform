import User from '#models/user'
import Workspace from '#models/workspace'

export const mockSender: User = {
  id: '01HZ9YQ2K8M3R4N5P6Q7S8T9V1',
  email: 'sarah.manager@company.com',
  status: 'active',
  createdAt: new Date('2024-01-10T09:00:00Z'),
  updatedAt: new Date('2024-01-10T09:00:00Z'),
  profile: {
    firstname: 'Sarah',
    lastname: 'Manager',
  },
} as unknown as User

export const mockInvitedUser: User = {
  id: '01HZ9YQ2K8M3R4N5P6Q7S8T9V2',
  email: 'alex.developer@company.com',
  status: 'active',
  createdAt: new Date('2024-01-12T14:20:00Z'),
  updatedAt: new Date('2024-01-12T14:20:00Z'),
  profile: {
    firstname: 'Alex',
    lastname: 'Developer',
  },
} as unknown as User

export const mockWorkspace: Workspace = {
  id: '01HZ9YQ2K8M3R4N5P6Q7S8T9W1',
  name: 'Design Team',
  slug: 'design-team',
  description:
    'Collaborative workspace for our design team to share ideas, prototypes, and feedback.',
  status: 'active',
  createdAt: new Date('2024-01-05T10:00:00Z'),
  updatedAt: new Date('2024-01-15T16:45:00Z'),
} as unknown as Workspace

export const mockWorkspaceInvitationProps = {
  language: 'en' as const,
  email: 'alex.developer@company.com',
  workspace: mockWorkspace,
  sender: mockSender,
  maybeUser: mockInvitedUser,
  link: 'https://app.compo.io/workspaces/design-team/join?token=invitation123',
}

export const mockWorkspaceInvitationSignUpProps = {
  language: 'en' as const,
  email: 'new.user@company.com',
  workspace: mockWorkspace,
  user: mockInvitedUser,
  sender: mockSender,
  maybeUser: null,
  link: 'https://app.compo.io/auth/register?workspace=design-team&token=signup123',
}
