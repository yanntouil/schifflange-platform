import type { AuthDialogTab } from "../components/dialog/context"
import { match } from "ts-pattern"
import React from "react"
import { useSearchParams } from "wouter"

/**
 * Convert AuthDialogTab to URLSearchParams
 * Useful for creating external links that open the dialog
 */
export const authDialogTabToSearchParams = (tab: AuthDialogTab | null): URLSearchParams => {
  const params = new URLSearchParams()

  if (tab === null) {
    return params
  }

  // Set base params
  params.set("authDialog", "true")
  params.set("authDialogTab", tab.type)

  // Set additional params based on tab type
  if ("workspaceId" in tab.params && tab.params.workspaceId) {
    params.set("authDialogWorkspaceId", tab.params.workspaceId)
  }

  return params
}

/**
 * Parse URLSearchParams to AuthDialogTab
 */
export const searchParamsToAuthDialogTab = (searchParams: URLSearchParams): AuthDialogTab | null => {
  if (searchParams.get("authDialog") !== "true") return null

  const tabType = searchParams.get("authDialogTab")
  const workspaceId = searchParams.get("authDialogWorkspaceId")

  return match(tabType)
    .with("workspaces-config", (): AuthDialogTab => ({
      type: "workspaces-config",
      params: { workspaceId: workspaceId || "" }
    }))
    .with("workspaces-members", (): AuthDialogTab => ({
      type: "workspaces-members",
      params: { workspaceId: workspaceId || "" }
    }))
    .with("workspaces-invitations", (): AuthDialogTab => ({
      type: "workspaces-invitations",
      params: { workspaceId: workspaceId || "" }
    }))
    .with("profile", (): AuthDialogTab => ({ type: "profile", params: {} }))
    .with("notifications", (): AuthDialogTab => ({ type: "notifications", params: {} }))
    .otherwise((): AuthDialogTab => ({ type: "authentication", params: {} }))
}

/**
 * Hook to manage auth dialog tab state via URL params
 * Context-less implementation that can be used anywhere
 */
export const useAuthDialogTab = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive tab state from URL params
  const tab = React.useMemo<AuthDialogTab | null>(() => {
    return searchParamsToAuthDialogTab(searchParams)
  }, [searchParams])

  // Update URL to change tab
  const setTab = React.useCallback((newTab: AuthDialogTab | null) => {
    // Preserve existing non-auth-dialog params
    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.delete("authDialog")
    updatedParams.delete("authDialogTab")
    updatedParams.delete("authDialogWorkspaceId")

    // Add new auth dialog params
    const newParams = authDialogTabToSearchParams(newTab)
    newParams.forEach((value, key) => {
      updatedParams.set(key, value)
    })

    setSearchParams(updatedParams)
  }, [searchParams, setSearchParams])

  return { tab, setTab }
}