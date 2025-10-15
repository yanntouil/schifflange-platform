import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Check, X } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import dashboardRouteTo from "../../dashboard"
import signInRouteTo from "../../sign-in"

/**
 * Register Token landing page
 */
const Page: React.FC<{ status: "loading" | "token-valid" | "token-expired" | "token-invalid" }> = ({ status }) => {
  const { _ } = useTranslation(dictionary)

  return (
    <Ui.Card.Root className="w-full max-w-md">
      <Ui.Card.Header className="text-center">
        {match(status)
          .with("loading", () => (
            <>
              <div className="mb-4 flex justify-center">
                <Ui.SpinIcon className="text-primary size-8" />
              </div>
              <Ui.Card.Title>{_("loading-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_("loading-description")}</Ui.Card.Description>
            </>
          ))
          .with("token-valid", () => (
            <>
              <div className="mb-4 flex justify-center">
                <div className="bg-success/10 flex size-12 items-center justify-center rounded-full">
                  <Check className="text-success size-6" />
                </div>
              </div>
              <Ui.Card.Title className="text-success">{_("success-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_("success-description")}</Ui.Card.Description>
            </>
          ))
          .with("token-expired", "token-invalid", () => (
            <>
              <div className="mb-4 flex justify-center">
                <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
                  <X className="text-destructive size-6" />
                </div>
              </div>
              <Ui.Card.Title className="text-destructive">{_("error-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_(status)}</Ui.Card.Description>
            </>
          ))
          .exhaustive()}
      </Ui.Card.Header>
      {match(status)
        .with("token-valid", () => (
          <Ui.Card.Footer>
            <Link className={Ui.buttonVariants({ className: "w-full" })} to={dashboardRouteTo()}>
              {_("go-to-dashboard")}
            </Link>
          </Ui.Card.Footer>
        ))
        .with("token-expired", "token-invalid", () => (
          <Ui.Card.Footer>
            <Link className={Ui.buttonVariants({ className: "w-full" })} to={signInRouteTo()}>
              {_("sign-in")}
            </Link>
          </Ui.Card.Footer>
        ))
        .with("loading", () => null)
        .exhaustive()}
    </Ui.Card.Root>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    "loading-title": "Verifying Your Email",
    "loading-description": "Please wait while we activate your account...",
    "success-title": "Welcome Aboard!",
    "success-description": "Your email has been verified. Redirecting to your dashboard...",
    "error-title": "Verification Failed",
    "token-invalid":
      "This activation link is invalid or has already been used. Verification links are single-use only. Please use the most recent link sent to your email.",
    "token-expired": "This activation link has expired. Please request a new verification email.",
    "sign-in": "Go to Sign In",
    "go-to-dashboard": "Continue to Dashboard",
  },
  fr: {
    "loading-title": "Vérification de votre email",
    "loading-description": "Veuillez patienter pendant l'activation de votre compte...",
    "success-title": "Bienvenue !",
    "success-description": "Votre email a été vérifié. Redirection vers votre tableau de bord...",
    "error-title": "Echec de la vérification",
    "token-invalid":
      "Ce lien d'activation est invalide ou a déjà été utilisé. Les liens de vérification sont à usage unique. Veuillez utiliser le dernier lien envoyé à votre email.",
    "token-expired": "Ce lien d'activation a expiré. Veuillez demander un nouvel email de vérification.",
    "sign-in": "Aller à la connexion",
    "go-to-dashboard": "Continuer vers le tableau de bord",
  },
  de: {
    "loading-title": "E-Mail-Verifizierung",
    "loading-description": "Bitte warten Sie, während wir Ihr Konto aktivieren...",
    "success-title": "Willkommen!",
    "success-description": "Ihre E-Mail wurde verifiziert. Weiterleitung zu Ihrem Dashboard...",
    "error-title": "Verifizierung fehlgeschlagen",
    "token-invalid":
      "Dieser Aktivierungslink ist ungültig oder wurde bereits verwendet. Verifizierungslinks können nur einmal verwendet werden. Bitte verwenden Sie den neuesten Link aus Ihrer E-Mail.",
    "token-expired": "Dieser Aktivierungslink ist abgelaufen. Bitte fordern Sie eine neue Verifizierungs-E-Mail an.",
    "sign-in": "Zur Anmeldung",
    "go-to-dashboard": "Weiter zum Dashboard",
  },
}
