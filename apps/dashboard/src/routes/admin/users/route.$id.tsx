import React from 'react'
import { useParams } from 'wouter'

/**
 * Admin User Detail Page
 */
export const AdminUserPage: React.FC = () => {
  const { id } = useParams()
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Detail</h1>
      <p>User ID: {id}</p>
    </div>
  )
}

/**
 * Route path generator for admin user detail
 */
export const routeTo = (id: string) => `/admin/users/${id}`

export default AdminUserPage