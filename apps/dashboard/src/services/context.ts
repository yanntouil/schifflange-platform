import React from "react"

/**
 * types
 */
type ServiceContext = {}

/**
 * contexts
 */
export const ServiceContext = React.createContext<ServiceContext>({})

/**
 * hooks
 */
export const useService = () => {
  const context = React.useContext(ServiceContext)
  if (!context) {
    throw new Error("useService must be used within a ServiceContext")
  }
  return context
}
