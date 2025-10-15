import { useAuthStore } from "@/features/auth"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { Check, X } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import dashboardRouteTo from "../../dashboard"
import signInRouteTo from "../../sign-in"

/**
 * Token verification landing page
 */
const Page: React.FC<{ status: "loading" | "token-valid" | "token-expired" | "token-invalid" }> = ({ status }) => {
  const { _ } = useTranslation(dictionary)
  const isAuthenticated = useAuthStore(D.prop("isAuthenticated"))

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
            {isAuthenticated ? (
              <Link className={Ui.buttonVariants({ className: "w-full" })} to={dashboardRouteTo()}>
                {_("go-to-dashboard")}
              </Link>
            ) : (
              <Link className={Ui.buttonVariants({ className: "w-full" })} to={signInRouteTo()}>
                {_("sign-in")}
              </Link>
            )}
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
    "loading-title": "Processing Your Link",
    "loading-description": "Please wait while we authenticate you...",
    "success-title": "Success!",
    "success-description": "Authentication complete. Redirecting to your dashboard...",
    "error-title": "Link Processing Failed",
    "token-invalid":
      "This link is invalid or has already been used. Security links are single-use only. Please request a new link if needed.",
    "token-expired": "This link has expired. For security reasons, links are only valid for a limited time. Please request a new link.",
    "sign-in": "Go to Sign In",
    "go-to-dashboard": "Continue to Dashboard",
  },
  fr: {
    "loading-title": "Traitement de votre lien",
    "loading-description": "Veuillez patienter pendant votre authentification...",
    "success-title": "Succès !",
    "success-description": "Authentification réussie. Redirection vers votre tableau de bord...",
    "error-title": "Échec du traitement du lien",
    "token-invalid":
      "Ce lien est invalide ou a déjà été utilisé. Les liens de sécurité sont à usage unique. Veuillez demander un nouveau lien si nécessaire.",
    "token-expired":
      "Ce lien a expiré. Pour des raisons de sécurité, les liens ne sont valides que pour une durée limitée. Veuillez demander un nouveau lien.",
    "sign-in": "Aller à la connexion",
    "go-to-dashboard": "Continuer vers le tableau de bord",
  },
  de: {
    "loading-title": "Link wird verarbeitet",
    "loading-description": "Bitte warten Sie, während wir Sie authentifizieren...",
    "success-title": "Erfolg!",
    "success-description": "Authentifizierung abgeschlossen. Weiterleitung zu Ihrem Dashboard...",
    "error-title": "Link-Verarbeitung fehlgeschlagen",
    "token-invalid":
      "Dieser Link ist ungültig oder wurde bereits verwendet. Sicherheitslinks können nur einmal verwendet werden. Bitte fordern Sie bei Bedarf einen neuen Link an.",
    "token-expired":
      "Dieser Link ist abgelaufen. Aus Sicherheitsgründen sind Links nur für begrenzte Zeit gültig. Bitte fordern Sie einen neuen Link an.",
    "sign-in": "Zur Anmeldung",
    "go-to-dashboard": "Weiter zum Dashboard",
  },
}
