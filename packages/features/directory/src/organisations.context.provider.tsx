import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { OrganisationsCreateDialog } from "./components/organisations.create"
import { OrganisationsEditDialog } from "./components/organisations.edit"
import { OrganisationsContext } from "./organisations.context"
import { useManageOrganisations } from "./organisations.context.actions"
import { SWROrganisations } from "./swr.organisations"

/**
 * OrganisationsProvider
 */
type OrganisationsProviderProps = {
  swr: SWROrganisations
  children: React.ReactNode
}

export const OrganisationsProvider: React.FC<OrganisationsProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.Organisation>()

  useKeepOnly(swr.organisations, selectable.keepOnly)

  const [manageOrganisations, manageOrganisationsProps] = useManageOrganisations(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageOrganisations,
      swr,
    }),
    [contextProps, manageOrganisations, swr]
  )

  return (
    <OrganisationsContext.Provider key={contextId} value={value}>
      {children}
      <ManageOrganisations {...manageOrganisationsProps} key={`${contextId}-manageOrganisations`} />
    </OrganisationsContext.Provider>
  )
}

/**
 * ManageOrganisations
 */
export type ManageOrganisationsProps = ReturnType<typeof useManageOrganisations>[1]
const ManageOrganisations: React.FC<ManageOrganisationsProps> = ({
  createOrganisationProps,
  editOrganisationProps,
  confirmDeleteOrganisationProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <OrganisationsCreateDialog {...createOrganisationProps} />
      <OrganisationsEditDialog {...editOrganisationProps} />
      <Ui.Confirm {...confirmDeleteOrganisationProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
