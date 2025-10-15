import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { Link } from "wouter"
import signInRouteTo from "../sign-in"

/**
 * Forgot Password Done
 */
export const Done: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Card.Root className="w-full max-w-sm">
      <Ui.Card.Header className="bg-space">
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className="space-y-4 text-sm">
        <p>{_("description")}</p>
        <p>{_("inbox-check")}</p>
      </Ui.Card.Content>
      <Ui.Card.Footer>
        <Link className={Ui.buttonVariants({ className: "w-full" })} to={signInRouteTo()}>
          {_("sign-in")}
        </Link>
      </Ui.Card.Footer>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Email sent",
    description: "Thank you for your request. We have sent you an email to reset your password.",
    "inbox-check": "Please check your inbox and click on the link provided to reset your password.",
    "sign-in": "Go to the sign-in page",
  },
  fr: {
    title: "Mail envoyé",
    description: "Merci pour votre demande. Nous vous avons envoyé un email de réinitialisation à l'adresse indiquée.",
    "inbox-check": "Veuillez vérifier votre boîte mail et cliquer sur le lien fourni pour réinitialiser votre mot de passe.",
    "sign-in": "Aller sur la page de connexion",
  },
  de: {
    title: "E-Mail gesendet",
    description: "Vielen Dank für Ihre Anfrage. Wir haben Ihnen eine E-Mail zum Zurücksetzen Ihres Passworts gesendet.",
    "inbox-check": "Bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den bereitgestellten Link, um Ihr Passwort zurückzusetzen.",
    "sign-in": "Zur Anmeldeseite gehen",
  },
}
