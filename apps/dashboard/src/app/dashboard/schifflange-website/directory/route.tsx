import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import { Route, Switch } from "wouter"
import { RouteAssociations } from "./associations"
import { RouteOrganizationId as RouteAssociationsOrganizationId } from "./associations/[organizationId]"
import { RouteCategories } from "./categories"
import { RouteContacts } from "./contacts"
import { RouteContactId } from "./contacts/[contactId]"
import { RouteOrganizationId as RouteMunicipalityOrganizationId } from "./my-municipality/[organizationId]"
import { RouteMyMunicipality } from "./my-municipality/route"
import { RouteOrganizations } from "./organizations"
import { RouteOrganizationId as RouteOrganizationsOrganizationId } from "./organizations/[organizationId]"
import { RouteOrganizationId as RoutePinnedOrganizationId } from "./[pinnedId]/[organizationId]"
import { RoutePinnedOrganisation } from "./[pinnedId]/route"
import Page from "./page"

export const RouteDirectory: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Switch>
        <Route path="/">
          <Page />
        </Route>
        <Route path="/contacts">
          <RouteContacts />
        </Route>
        <Route path="/contacts/:contactId">{({ contactId }) => <RouteContactId contactId={contactId} />}</Route>
        <Route path="/organizations">
          <RouteOrganizations />
        </Route>
        <Route path="/organizations/:organizationId">
          {({ organizationId }) => <RouteOrganizationsOrganizationId organizationId={organizationId} />}
        </Route>
        <Route path="/categories">
          <RouteCategories />
        </Route>
        <Route path="/associations">
          <RouteAssociations />
        </Route>
        <Route path="/associations/:organizationId">
          {({ organizationId }) => <RouteAssociationsOrganizationId organizationId={organizationId} />}
        </Route>
        <Route path="/my-municipality">
          <RouteMyMunicipality />
        </Route>
        <Route path="/my-municipality/:organizationId">
          {({ organizationId }) => <RouteMunicipalityOrganizationId organizationId={organizationId} />}
        </Route>
        <Route path="/:pinnedId">
          <RoutePinnedOrganisation />
        </Route>
        <Route path="/:pinnedId/:organizationId">
          {({ organizationId }) => <RoutePinnedOrganizationId organizationId={organizationId} />}
        </Route>
      </Switch>
    </ContextualLanguageProvider>
  )
}
