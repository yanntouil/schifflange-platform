import React from 'react'

/**
 * Admin Users Index Page
 */
export const AdminUsersPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <p>Liste des utilisateurs</p>
    </div>
  )
}

/**
 * Route path generator for admin users index
 */
export const routeTo = () => '/admin/users'

export default AdminUsersPage