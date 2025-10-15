import env from '#start/env'
export const config = {
  appName: env.get('MAIL_APP_NAME'),
  supportEmail: env.get('MAIL_APP_SUPPORT_EMAIL'),
  dashboardUrl: env.get('DASHBOARD_URL'),
  baseUrl: env.get('APP_URL'),
}
