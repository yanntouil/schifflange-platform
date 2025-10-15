import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { Link } from "wouter"
import signInRouteTo from "../sign-in"

/**
 * Registration Done
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
        <p className="text-center">
          <Link className={Ui.buttonVariants({ className: "w-full" })} to={signInRouteTo()}>
            {_("sign-in")}
          </Link>
        </p>
      </Ui.Card.Footer>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Registration successful",
    description: "Thank you for your registration. We have sent you an email to confirm your account.",
    "inbox-check": "Please check your inbox and click on the link provided to confirm your account.",
    "sign-in": "Go to the sign-in page",
  },
  fr: {
    title: "Inscription réussie",
    description: "Merci pour votre inscription. Nous vous avons envoyé un email de confirmation à l'adresse indiquée.",
    "inbox-check": "Veuillez vérifier votre boîte mail et cliquer sur le lien fourni pour activer votre compte.",
    "sign-in": "Aller sur la page de connexion",
  },
  de: {
    title: "Registrierung erfolgreich",
    description: "Vielen Dank für Ihre Registrierung. Wir haben Ihnen eine E-Mail mit einer Bestätigung gesendet.",
    "inbox-check":
      "Bitte überprüfen Sie Ihre E-Mail-Posteingang und klicken Sie auf den bereitgestellten Link, um Ihr Konto zu aktivieren.",
    "sign-in": "Zur Anmeldeseite",
  },
}
