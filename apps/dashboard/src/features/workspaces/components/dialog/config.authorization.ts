import { Api } from "@/services"

/**
 * authorization
 * set the authorization for the workspace config form
 * @param memberRole - the role of the member in the workspace
 * @returns the authorization for the workspace config form
 */
export const makeAuthorization = (memberRole: Api.WorkspaceRole) => {
  const isOwner = memberRole === "owner"
  const isAdmin = memberRole === "admin"
  return {
    changeType: false,
    changeTheme: isOwner,
    changeName: isOwner,
    changeImage: isOwner,
    changeBranding: isOwner || isAdmin,
  }
}
