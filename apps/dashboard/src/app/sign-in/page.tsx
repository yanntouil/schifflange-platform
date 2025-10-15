import globalConfig from "@/config/global"
import { authStore } from "@/features/auth"
import { service } from "@/services"
import { Form, useForm, validator } from "@compo/form"
import { Interpolate, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { match } from "@compo/utils"
import React from "react"
import { useTitle } from "react-use"
import { Link, useLocation } from "wouter"
import dashboardRouteTo, { dashboardRoutesByType } from "../dashboard"
import forgotPasswordRouteTo from "../forgot-password"
import registerRouteTo from "../register"

/**
 * Sign In Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  useTitle(_("page-title"))
  const [, navigate] = useLocation()
  const { isEmail, min } = validator
  const form = useForm({
    allowErrorSubmit: true,
    values: {
      email: globalConfig.signin.email,
      password: globalConfig.signin.password,
    },
    validate: validator({
      email: [isEmail(_("error-invalid-credentials"))],
      password: [min(1, _("error-invalid-credentials"))],
    }),
    onSubmit: async ({ values, isValid }) => {
      // if form is not valid, return global error
      if (!isValid) {
        return _("error-invalid-credentials")
      }
      // if form is valid, submit form
      return match(await service.auth.login({ email: values.email, password: values.password }))
        .with({ ok: true }, ({ data }) => {
          authStore.actions.login(data)
          const route = data.user.workspace ? dashboardRoutesByType(data.user.workspace.type) : dashboardRouteTo()
          navigate(route)
        })
        .otherwise(({ except }) =>
          match(except?.name)
            .with("E_TOO_MANY_REQUESTS", () => _("error-too-many-requests"))
            .with("E_ACCOUNT_NOT_ACTIVE", () => _("error-account-not-active"))
            .with("E_ACCOUNT_DELETED", () => _("error-account-deleted"))
            .with("E_ACCOUNT_SUSPENDED", () => _("error-account-suspended"))
            .otherwise(() => _("error-invalid-credentials"))
        )
    },
  })

  return (
    <Ui.Card.Root className="w-full max-w-sm">
      <Ui.Card.Header className="bg-space">
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <Form.Root form={form}>
          <div className="flex flex-col gap-6">
            <Form.Assertive />
            <Form.Input type="email" name="email" label={_("email-label")} placeholder={_("email-placeholder")} required />
            <Form.Password name="password" label={_("password-label")} placeholder={_("password-placeholder")} required />
            <div className="flex flex-col gap-3">
              <Ui.Button type="submit" className="w-full">
                {_("login-button")}
              </Ui.Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            <Interpolate
              text={_("register-link")}
              replacements={{
                a: (text) => (
                  <Link to={registerRouteTo()} className={variants.link({ variant: "underline" })}>
                    {text}
                  </Link>
                ),
              }}
            />
          </div>
          <div className="mt-4 text-center text-sm">
            <Interpolate
              text={_("forgot-password")}
              replacements={{
                a: (text) => (
                  <Link to={forgotPasswordRouteTo()} className={variants.link({ variant: "underline" })}>
                    {text}
                  </Link>
                ),
              }}
            />
          </div>
        </Form.Root>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    "page-title": "Schifflange Dashboard - Sign In",
    title: "Login to your account",
    description: "Enter your email below to login to your account",
    "email-label": "Email",
    "email-placeholder": "m@example.com",
    "password-label": "Password",
    "password-placeholder": "••••••••••••",
    "login-button": "Login",
    "register-link": "Don't have an account? {{a:Sign up}}",
    "forgot-password": "Forgot password? {{a:Reset password}}",
    "error-too-many-requests": "You have made too many requests with wrong credentials, please try again later",
    "error-invalid-credentials": "You have entered an invalid email or password",
    "error-account-not-active": "Your account is not active, check your email to activate your account",
    "error-account-deleted": "Your account has been deleted, please contact support to restore your account",
    "error-account-suspended": "Your account has been suspended, please contact support to restore your account",
    "error-validation-failure": "Your email or password is invalid, please try again",
  },
  fr: {
    "page-title": "Schifflange Dashboard - Connexion",
    title: "Connexion à votre compte",
    description: "Entrez votre email ci-dessous pour vous connecter à votre compte",
    "email-label": "Email",
    "email-placeholder": "m@example.com",
    "password-label": "Mot de passe",
    "password-placeholder": "••••••••••••",
    "login-button": "Connexion",
    "register-link": "Vous n'avez pas de compte? {{a:Inscrivez-vous}}",
    "forgot-password": "Mot de passe oublié? {{a:Réinitialiser le mot de passe}}",
    "error-too-many-requests":
      "Vous avez fait trop de tentatives de connexion avec des identifiants invalides, veuillez réessayer plus tard",
    "error-invalid-credentials": "Vous avez entré un email ou un mot de passe invalide, veuillez réessayer",
    "error-account-not-active": "Votre compte n'est pas actif, veuillez vérifier votre email pour activer votre compte",
    "error-account-deleted": "Votre compte a été supprimé, veuillez contacter le support pour restaurer votre compte",
    "error-account-suspended": "Votre compte a été suspendu, veuillez contacter le support pour restaurer votre compte",
    "error-validation-failure": "Votre email ou mot de passe est invalide, veuillez réessayer",
  },
  de: {
    "page-title": "Schifflange Dashboard - Anmeldung",
    title: "Bei Ihrem Konto anmelden",
    description: "Geben Sie Ihre E-Mail-Adresse unten ein, um sich bei Ihrem Konto anzumelden",
    "email-label": "E-Mail",
    "email-placeholder": "m@beispiel.com",
    "password-label": "Passwort",
    "password-placeholder": "••••••••••••",
    "login-button": "Anmelden",
    "register-link": "Sie haben noch kein Konto? {{a:Registrieren}}",
    "forgot-password": "Passwort vergessen? {{a:Passwort zurücksetzen}}",
    "error-too-many-requests":
      "Sie haben zu viele Anmeldeversuche mit falschen Anmeldedaten unternommen, bitte versuchen Sie es später erneut",
    "error-invalid-credentials": "Sie haben eine ungültige E-Mail-Adresse oder ein ungültiges Passwort eingegeben",
    "error-account-not-active": "Ihr Konto ist nicht aktiv, überprüfen Sie Ihre E-Mail, um Ihr Konto zu aktivieren",
    "error-account-deleted": "Ihr Konto wurde gelöscht, bitte wenden Sie sich an den Support, um Ihr Konto wiederherzustellen",
    "error-account-suspended": "Ihr Konto wurde gesperrt, bitte wenden Sie sich an den Support, um Ihr Konto wiederherzustellen",
    "error-validation-failure": "Ihre E-Mail-Adresse oder Ihr Passwort ist ungültig, bitte versuchen Sie es erneut",
  },
}
