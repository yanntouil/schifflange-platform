import User from '#models/user'
import Workspace from '#models/workspace'
import LanguagesProvider from '#providers/languages_provider'
import MailService from '#services/mail'
import type { HttpContext } from '@adonisjs/core/http'
import { G } from '@mobily/ts-belt'
import { render } from '@react-email/render'

/**
 * Controller: MailsController
 * @description this controller contains the methods to preview mails for development purposes
 */
export default class mailsController {
  /**
   * registration
   */
  async registration({ request, response }: HttpContext) {
    const mail = MailService.mails.authRegistration
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * triedToRegister
   */
  async triedToRegister({ request, response }: HttpContext) {
    const mail = MailService.mails.authTriedToRegister
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * passwordReset
   */
  async passwordReset({ request, response }: HttpContext) {
    const mail = MailService.mails.authPasswordReset
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * emailChangeVerification
   */
  async emailChangeVerification({ request, response }: HttpContext) {
    const mail = MailService.mails.authEmailChangeVerification
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountDisabled
   */
  async accountDisabled({ request, response }: HttpContext) {
    const mail = MailService.mails.accountDisabled
    const props = this.makeProps(request, mail.subject)
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountActivated
   */
  async accountActivated({ request, response }: HttpContext) {
    const mail = MailService.mails.accountActivated
    const props = this.makeProps(request, mail.subject)
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountDeleted
   */
  async accountDeleted({ request, response }: HttpContext) {
    const mail = MailService.mails.accountDeleted
    const props = this.makeProps(request, mail.subject)
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountPending
   */
  async accountPending({ request, response }: HttpContext) {
    const mail = MailService.mails.accountPending
    const props = this.makeProps(request, mail.subject)
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountPasswordReset
   */
  async accountPasswordReset({ request, response }: HttpContext) {
    const mail = MailService.mails.accountPasswordReset
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountEmailChange
   */
  async accountEmailChange({ request, response }: HttpContext) {
    const mail = MailService.mails.accountEmailChange
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountWelcome
   */
  async accountWelcome({ request, response }: HttpContext) {
    const mail = MailService.mails.accountWelcome
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * accountAuthentication
   */
  async accountAuthentication({ request, response }: HttpContext) {
    const mail = MailService.mails.accountAuthentication
    const props = this.makeProps(request, mail.subject, {
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * workspaceInvitation
   */
  async workspaceInvitation({ request, response }: HttpContext) {
    const mail = MailService.mails.workspaceInvitation
    const workspace = await Workspace.query().first()
    const exists = !!request.param('exists')
    const sender = await User.query().where('email', 'yann@101.lu').preload('profile').first()
    const maybeUser = exists
      ? await User.query().where('email', 'daniel@101.lu').preload('profile').first()
      : null
    if (G.isNullable(workspace)) {
      return response.badRequest({
        name: 'E_VALIDATION_FAILURE',
        status: 400,
        message: 'Workspace, sender or maybeUser is required',
      })
    }
    const props = this.makeProps(request, mail.subject, {
      workspace,
      sender,
      maybeUser,
      token: 'abc:1234567890',
    })

    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * workspaceInvitationSignUp
   */
  async workspaceInvitationSignUp({ request, response }: HttpContext) {
    const mail = MailService.mails.workspaceInvitationSignUp
    const workspace = await Workspace.query().first()

    if (G.isNullable(workspace)) {
      return response.badRequest({
        name: 'E_VALIDATION_FAILURE',
        status: 400,
        message: 'Workspace is required',
      })
    }
    const props = this.makeProps(request, mail.subject, {
      workspace,
      token: 'abc:1234567890',
    })
    const preview = await render(mail(props))
    return response.ok(preview)
  }

  /**
   * make default props for preview
   */
  protected makeProps<T extends Record<string, unknown>>(
    request: HttpContext['request'],
    subject: (language: string) => string,
    props: T = {} as T
  ) {
    const language = LanguagesProvider.getOrDefault(request.param('locale')).code
    return {
      email: 'test@test.com',
      language,
      subject: subject(language),
      ...props,
    }
  }
}
