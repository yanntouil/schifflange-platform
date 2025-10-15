import User from '#models/user'

export const mockUser: User = {
  id: '01HZ9YQ2K8M3R4N5P6Q7S8T9V0',
  email: 'john.doe@example.com',
  status: 'active',
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z'),
  profile: {
    firstname: 'John',
    lastname: 'Doe',
  },
} as unknown as User

export const mockAuthProps = {
  language: 'en' as const,
  email: 'john.doe@example.com',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
}

export const mockPasswordResetProps = {
  ...mockAuthProps,
}
