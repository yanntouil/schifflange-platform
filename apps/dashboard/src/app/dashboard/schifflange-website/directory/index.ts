import parentRoute from ".."
import routeToAssociations from "./associations"
import routeToAssociationId from "./associations/[organizationId]"
import routeToCategories from "./categories"
import routeToContacts from "./contacts"
import routeToContactId from "./contacts/[contactId]"
import routeToMyMunicipality from "./my-municipality"
import routeToMunicipalityId from "./my-municipality/[organizationId]"
import routeToOrganizations from "./organizations"
import routeToOrganizationId from "./organizations/[organizationId]"
import routeToPinned from "./[pinnedId]"
import routeToPinnedId from "./[pinnedId]/[organizationId]"

export * from "./route"
const routeToHome = () => `${parentRoute()}/directory`
export default routeToHome
export const routesTo = {
  home: routeToHome,
  contacts: {
    list: routeToContacts,
    byId: routeToContactId,
  },
  organizations: {
    list: routeToOrganizations,
    byId: routeToOrganizationId,
  },
  associations: {
    list: routeToAssociations,
    byId: routeToAssociationId,
  },
  myMunicipality: {
    list: routeToMyMunicipality,
    byId: routeToMunicipalityId,
  },
  pinned: {
    list: routeToPinned,
    byId: routeToPinnedId,
  },
  categories: {
    list: routeToCategories,
  },
}
