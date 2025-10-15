import { service } from "@/services"
import { Form, useForm, validator } from "@compo/form"
import { Interpolate, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { match } from "@compo/utils"
import React from "react"
import { Link } from "wouter"
import signInRouteTo from "../sign-in"

/**
 * Forgot Password Request
 */
export const Request: React.FC<{ setStepDone: () => void }> = ({ setStepDone }) => {
  const { _ } = useTranslation(dictionary)

  const { isEmail, min } = validator
  const form = useForm({
    allowErrorSubmit: true,
    allowSubmitAttempt: true,
    values: {
      email: "",
    },
    validate: validator({
      email: [min(1, _("email-required")), isEmail(_("email-invalid"))],
    }),
    onSubmit: async ({ values, isValid }) => {
      if (!isValid) {
        return _("error-validation-failure")
      }
      return match(await service.auth.forgotPassword(values))
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
        </Ui.Card.Content>
        <Ui.Card.Footer className="flex flex-col gap-4">
          <Form.Submit className="w-full">{_("submit")}</Form.Submit>
          <div className="mt-4 text-center text-sm">
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
          </div>
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
    title: "Forgot Password",
    description: "Enter your email address below to receive a password reset request by email",
    "email-label": "Email",
    "email-placeholder": "example@email.lu",
    "email-required": "You need to enter an email",
    "email-invalid": "This is not a valid email",
    "sign-in": "Return to {{a:the sign-in page}}",
    submit: "Send request",
    "error-validation-failure": "Please enter your email before submitting the request.",
  },
  fr: {
    title: "Réinitialisation de mot de passe",
    description: "Veuillez entrer votre adresse email pour recevoir un mail de réinitialisation de mot de passe.",
    "email-label": "Adresse email",
    "email-placeholder": "exemple@email.lu",
    "email-required": "Vous devez entrer une adresse email",
    "email-invalid": "L'adresse email est invalide",
    "sign-in": "Retourner sur {{a:la page de connexion}}",
    submit: "Envoyer la demande",
    "error-validation-failure": "Merci de renseigner votre adresse email avant de soumettre la demande.",
  },
  de: {
    title: "Passwort vergessen",
    description: "Geben Sie Ihre E-Mail-Adresse ein, um eine Passwort-Zurücksetzung per E-Mail zu erhalten",
    "email-label": "E-Mail",
    "email-placeholder": "beispiel@email.lu",
    "email-required": "Sie müssen eine E-Mail-Adresse eingeben",
    "email-invalid": "Dies ist keine gültige E-Mail-Adresse",
    "sign-in": "Zurück zur {{a:Anmeldeseite}}",
    submit: "Anfrage senden",
    "error-validation-failure": "Bitte geben Sie Ihre E-Mail-Adresse ein, bevor Sie die Anfrage absenden.",
  },
}
