import { DefaultProps, EmailComponent } from '#mails/_utils/types'
import * as mails from '#mails/index'
import EmailLog from '#models/email-log'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { G } from '@mobily/ts-belt'
import { render } from '@react-email/render'
import { match } from 'ts-pattern'

export default class MailService {
  public static mails = {
    // mail related to authentication
    authRegistration: mails.authRegistration,
    authTriedToRegister: mails.authTriedToRegister,
    authPasswordReset: mails.authPasswordReset,
    authEmailChangeVerification: mails.authEmailChangeVerification,

    // mail related to accounts
    accountActivated: mails.accountActivated,
    accountDisabled: mails.accountDisabled,
    accountDeleted: mails.accountDeleted,
    accountPending: mails.accountPending,
    accountPasswordReset: mails.accountPasswordReset,
    accountEmailChange: mails.accountEmailChange,
    accountWelcome: mails.accountWelcome,
    accountAuthentication: mails.accountAuthentication,

    // mail related to workspaces
    workspaceInvitation: mails.workspaceInvitation,
    workspaceInvitationSignUp: mails.workspaceInvitationSignUp,
  }
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * mail core methods
   */

  public static async resend(id: string) {
    const log = await EmailLog.find(id)
    if (G.isNullable(log)) {
      return null
    }

    // prepare template and props
    const template = mails[log.template as keyof typeof mails]
    const props = log.metadata as any

    // in case the email is already sent or queued, or the template is not found, return the log
    if (log.status === 'sent' || log.status === 'queued' || !template) {
      return log
    }

    // update the log as queued
    await log.merge({ status: 'queued' }).save()

    // in development, redirect all emails
    const recipient = env.get('MAIL_REDIRECT') ? env.get('MAIL_REDIRECT_TO') : log.email
    try {
      // render the React template to HTML
      const html = await render(template(props))

      // send the email
      await mail.send((message) => {
        message.to(recipient).subject(log.subject).html(html)
      })

      // update the log as sent
      await log.merge({ status: 'sent' }).save()
      logger.info('Email sent successfully:', { to: recipient, subject: log.subject })
    } catch (error) {
      // update the log as failed
      await log.merge({ status: 'failed' }).save()
      logger.error('Failed to send email:', error, { to: recipient, subject: log.subject })
    }
    return log
  }

  /**
   * Send an email using a React template
   */
  protected static async send<P extends Record<string, unknown>>(
    to: string,
    subject: string,
    template: ComponentType<P>,
    props: P,
    templateName: string,
    userId?: string
  ) {
    // Log the email as queued
    const log = await EmailLog.create({
      userId: userId ?? null,
      email: to,
      template: templateName,
      subject,
      status: 'queued',
      metadata: props,
    })
    try {
      // in development, redirect all emails
      const recipient = env.get('MAIL_REDIRECT') ? env.get('MAIL_REDIRECT_TO') : to

      // render the React template to HTML
      const html = await render(template(props))

      // send the email
      await mail.send((message) => {
        message.to(recipient).subject(subject).html(html)
      })

      // update the log as sent
      await log.merge({ status: 'sent' }).save()
      logger.info('Email sent successfully:', { to: recipient, subject })
    } catch (error) {
      // update the log as failed
      await log.merge({ status: 'failed' }).save()
      logger.error('Failed to send email:', error, { to, subject })
    }
  }

  /**
   * Preview an email template as HTML
   */
  public static async preview(log: EmailLog): Promise<string | null> {
    const template = mails[log.template as keyof typeof mails]
    if (!template) {
      return null
    }
    const props = log.metadata as any
    return await render(template(props))
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * mail related to authentication
   */

  /**
   * Send mail: Someone tried to register with your email
   */
  public static async sendTriedToRegister(
    email: string,
    language: string,
    props: MailProps<typeof this.mails.authTriedToRegister>,
    options: MailOptions = {}
  ) {
    const name: MailType = 'authTriedToRegister'
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /**
   * Send mail: New user registration email address must be verified
   */
  public static async sendRegistration(
    email: string,
    language: string,
    props: MailProps<typeof this.mails.authRegistration>,
    options: MailOptions = {}
  ) {
    const name: keyof typeof this.mails = 'authRegistration'
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /**
   * Send mail: Email change verification
   */
  public static async sendEmailChangeVerification(
    email: string,
    language: string,
    props: MailProps<typeof this.mails.authEmailChangeVerification>,
    options: MailOptions = {}
  ) {
    const name: keyof typeof this.mails = 'authEmailChangeVerification'
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /**
   * Send mail: Password reset
   */
  public static async sendPasswordReset(
    email: string,
    language: string,
    props: MailProps<typeof this.mails.authPasswordReset>,
    options: MailOptions = {}
  ) {
    const name: MailType = 'authPasswordReset'
    const mail = this.mails.authPasswordReset
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * mail related to accounts
   */

  /**
   * Send mail: account password reset
   */
  public static async sendAccountPasswordReset(
    email: string,
    language: string,
    props: MailProps<typeof this.mails.accountPasswordReset>,
    options: MailOptions = {}
  ) {
    const name: MailType = 'accountPasswordReset'
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /**
   * Send mail: when an account changes status
   */
  public static async sendAccountChangeStatus(
    email: string,
    language: string,
    status: string,
    props: MailProps<typeof this.mails.accountActivated>,
    options: MailOptions = {}
  ) {
    const name: MailType = match(status)
      .with('active', () => 'accountActivated' as const)
      .with('inactive', () => 'accountDisabled' as const)
      .with('deleted', () => 'accountDeleted' as const)
      .otherwise(() => 'accountPending' as const)
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /**
   * Send mail: invitation to a user
   */
  public static async sendAccountInvitation(
    email: string,
    language: string,
    invitationType: string,
    props: MailProps<typeof this.mails.accountAuthentication>,
    options: MailOptions = {}
  ) {
    const name: MailType = match(invitationType)
      .with('password-reset', () => 'accountPasswordReset' as const)
      .with('email-change', () => 'accountEmailChange' as const)
      .with('welcome', () => 'accountWelcome' as const)
      .otherwise(() => 'accountAuthentication' as const)
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * mail related to workspaces
   */

  /**
   * Send mail: invitation to a user
   */
  public static async sendWorkspaceInvitation(
    email: string,
    language: string,
    props: MailProps<typeof this.mails.workspaceInvitation>,
    options: MailOptions = {}
  ) {
    const name: MailType = 'workspaceInvitation'
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }

  /**
   * Send mail: invitation to sign up
   */
  public static async sendWorkspaceInvitationSignUp(
    email: string,
    language: string,
    props: MailProps<typeof this.mails.workspaceInvitationSignUp>,
    options: MailOptions = {}
  ) {
    const name: MailType = 'workspaceInvitationSignUp'
    const mail = this.mails[name]
    await MailService.send(
      email,
      mail.subject(language),
      mail,
      { ...props, language, email },
      name,
      options.userId
    )
  }
}

/**
 * types
 */
type ComponentType<P> = (props: P) => React.JSX.Element
type MailProps<T extends EmailComponent<any>> = Omit<
  NonNullable<Parameters<T>[0]>,
  keyof DefaultProps
>
type MailOptions = {
  userId?: string
  metadata?: Record<string, unknown>
}
type MailType = keyof typeof MailService.mails
