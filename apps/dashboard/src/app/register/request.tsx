import { FormTerms } from "@/app/register/terms"
import { service } from "@/services"
import { Form, useForm, validator } from "@compo/form"
import { Interpolate, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import React from "react"
import { Link } from "wouter"
import signInRouteTo from "../sign-in"

/**
 * Registration Request
 */
export const Request: React.FC<{ setStepDone: () => void }> = ({ setStepDone }) => {
  const { _ } = useTranslation(dictionary)
  const { isEmail, min, isTrue } = validator
  const form = useForm({
    allowErrorSubmit: true,
    allowSubmitAttempt: true,
    values: {
      email: "",
      password: "",
      terms: false,
    },
    validate: validator({
      email: [min(1, _("email-required")), isEmail(_("email-invalid"))],
      password: [min(1, _("password-required")), min(8, _("password-min-8"))],
      terms: [isTrue("terms-required")],
    }),
    onSubmit: async ({ values, isValid }) => {
      const { terms, ...payload } = values
      // if form is not valid, return global error
      if (!isValid) {
        return _("error-validation-failure")
      }
      // if form is valid, submit form
      return match(await service.auth.register(payload))
        .with({ ok: true }, () => setStepDone())
        .otherwise(() => _("error-validation-failure"))
    },
  })
  return (
    <Ui.Card.Root className="w-full max-w-sm">
      <Ui.Card.Header className="bg-space">
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Form.Root form={form}>
        <Ui.Card.Content className="space-y-6">
          <Form.Assertive />
          <Form.Input type="email" name="email" label={_("email-label")} placeholder={_("email-placeholder")} required />
          <Form.Password name="password" label={_("password-label")} placeholder={_("password-placeholder")} required />
          <FormTerms name="terms" />
        </Ui.Card.Content>
        <Ui.Card.Footer className="flex flex-col gap-4">
          <Form.Submit type="submit" className="w-full">
            {_("submit")}
          </Form.Submit>
          <p className="text-center text-sm">
            <Interpolate
              text={_("sign-in")}
              replacements={{
                a: (text) => (
                  <Link to={signInRouteTo()} className={variants.link({ variant: "underline" })}>
                    {text}
                  </Link>
                ),
              }}
            />
          </p>
        </Ui.Card.Footer>
      </Form.Root>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Create account",
    description: "Please create an account to access the application",
    "email-label": "Email",
    "email-placeholder": "example@email.lu",
    "email-required": "You need to enter an email",
    "email-invalid": "This is not a valid email",
    "password-label": "Password",
    "password-placeholder": "••••••••••••",
    "password-required": "You need to enter a password",
    "password-min-8": "The password must contain at least 8 characters",
    "sign-in": "Already have an account? Sign in here",
    submit: "Create your account",
    "error-validation-failure": "Please check your entry and accept the terms of use and privacy policy before creating your account.",
  },
  fr: {
    title: "Création de compte",
    description: "Veuillez créer un compte pour accéder à l'application",
    "email-label": "Adresse email",
    "email-placeholder": "exemple@email.lu",
    "email-required": "Vous devez entrer une adresse email",
    "email-invalid": "L'adresse email est invalide",
    "password-label": "Mot de passe",
    "password-placeholder": "••••••••••••",
    "password-min-8": "Le mot de passe doit contenir au moins 8 caractères",
    "sign-in": "Déjà un compte ? Connectez-vous {{a:en cliquant ici}}",
    submit: "Créer votre compte",
    "error-validation-failure":
      "Veuillez vérifier votre saisie et accepter les conditions d'utilisation et la politique de confidentialité avant de créer votre compte.",
  },
  de: {
    title: "Konto erstellen",
    description: "Bitte erstellen Sie ein Konto, um auf die Anwendung zuzugreifen",
    "email-label": "E-Mail",
    "email-placeholder": "beispiel@email.lu",
    "email-required": "Sie müssen eine E-Mail-Adresse eingeben",
    "email-invalid": "Dies ist keine gültige E-Mail-Adresse",
    "password-label": "Passwort",
    "password-placeholder": "••••••••••••",
    "password-required": "Sie müssen ein Passwort eingeben",
    "password-min-8": "Das Passwort muss mindestens 8 Zeichen enthalten",
    "sign-in": "Haben Sie bereits ein Konto? Melden Sie sich hier an",
    submit: "Ihr Konto erstellen",
    "error-validation-failure":
      "Bitte überprüfen Sie Ihre Eingaben und akzeptieren Sie die Nutzungsbedingungen und Datenschutzrichtlinie, bevor Sie Ihr Konto erstellen.",
  },
}
