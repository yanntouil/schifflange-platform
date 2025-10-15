import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { X } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import signInRouteTo from "../../sign-in"

/**
 * PageError
 */
export const PageError: React.FC<{ error: "token-expired" | "token-invalid" }> = ({ error }) => {
  const { _ } = useTranslation(dictionary)

  return (
    <Ui.Card.Root className="w-full max-w-md">
      <Ui.Card.Header className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
            <X className="text-destructive size-6" />
          </div>
        </div>
        <Ui.Card.Title className="text-destructive">{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_(error)}</Ui.Card.Description>
      </Ui.Card.Header>
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
    title: "Verification Failed",
    "token-invalid":
      "This activation link is invalid or has already been used. Verification links are single-use only. Please use the most recent link sent to your email.",
    "token-expired": "This activation link has expired. Please request a new verification email.",
    "sign-in": "Go to Sign In",
  },
  fr: {
    title: "Echec de la vérification",
    "token-invalid":
      "Ce lien d'activation est invalide ou a déjà été utilisé. Les liens de vérification sont à usage unique. Veuillez utiliser le dernier lien envoyé à votre email.",
    "token-expired": "Ce lien d'activation a expiré. Veuillez demander un nouvel email de vérification.",
    "sign-in": "Aller à la connexion",
  },
  de: {
    title: "E-Mail-Verifizierung",
    "token-invalid":
      "Dieser Aktivierungslink ist ungültig oder wurde bereits verwendet. Verifizierungslinks können nur einmal verwendet werden. Bitte verwenden Sie den neuesten Link aus Ihrer E-Mail.",
    "token-expired": "Dieser Aktivierungslink ist abgelaufen. Bitte fordern Sie eine neue Verifizierungs-E-Mail an.",
    "sign-in": "Zur Anmeldung",
  },
}
