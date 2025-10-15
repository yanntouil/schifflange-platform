import env from '#start/env'

export default class DashboardService {
  public static url = env.get('DASHBOARD_URL')

  /**
   * makeUrl
   * @description make a url from the dashboard url and the paths
   * @param paths - the paths to make the url from
   * @returns the url
   */
  public static makeUrl = (...paths: string[]) => makeUrl(this.url, ...paths)

  /**
   * auth
   */
  // @see file: dashboard/src/app/sign-in
  public static makeLoginUrl = () => makeUrl(this.url, 'sign-in')
  // @see file: dashboard/src/app/register/[token]
  public static makeRegisterUrl = (token: string) => makeUrl(this.url, 'register', token)
  // @see file: dashboard/src/app/token/[token]
  public static makeAuthenticationUrl = (token: string) => makeUrl(this.url, 'token', token)
  // @see file: dashboard/src/app/token/[token]
  public static makeVerifyEmailUrl = (token: string) => makeUrl(this.url, 'token', token)
  // @see file: dashboard/src/app/forgot-password/[token]
  public static makeResetPasswordUrl = (token: string) =>
    makeUrl(this.url, 'forgot-password', token)
  // @see file: dashboard/src/app/token/[token]
  public static makeEmailChangeUrl = (token: string) => makeUrl(this.url, 'token', token)

  /**
   * workspace
   */
  public static makeWorkspaceInvitationUrl = (token: string, accept: boolean = false) =>
    makeUrl(this.url, 'invitation', accept ? 'accept' : 'refuse', token)
  public static makeWorkspaceInvitationSignUpUrl = (token: string) =>
    makeUrl(this.url, 'invitation', 'sign-up', token)
}

/**
 * helper used to make a url from the dashboard url and the paths
 */
const makeUrl = (...paths: string[]) => {
  const trimmedPaths = paths.map((path) => path.replace(/^\/|\/$/g, ''))
  return trimmedPaths.join('/')
}
