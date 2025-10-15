import { login } from "@/features/auth/store/actions"
import { Payload, service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Check, X } from "lucide-react"
import React from "react"
import { Link, useLocation } from "wouter"
import dashboardRouteTo from "../../dashboard"
import signInRouteTo from "../../sign-in"

/**
 * PageLogin
 */
export const PageLogin: React.FC<{ invitation: Payload.Workspaces.PublicInvitation; token: string }> = ({ invitation, token }) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const [status, setStatus] = React.useState<"loading" | "invitation-accepted" | "token-expired" | "token-invalid">("loading")

  // Auto-accept invitation on mount
  React.useEffect(() => {
    const acceptInvitation = async () => {
      const result = await service.workspaces.invitations.signIn({ token })
      if (result.ok) {
        setStatus("invitation-accepted")
        if ("user" in result.data) {
          login(result.data)
          setTimeout(() => navigate(dashboardRouteTo()), 4000)
        }
      } else if (result.except?.name === "E_TOKEN_EXPIRED") {
        setStatus("token-expired")
      } else {
        setStatus("token-invalid")
      }
    }

    acceptInvitation()
  }, [token])

  return (
    <Ui.Card.Root className="w-full max-w-md">
      <Ui.Card.Header className="text-center">
        {match(status)
          .with("loading", () => (
            <>
              <div className="mb-4 flex justify-center">
                <Ui.SpinIcon className="text-primary size-8" />
              </div>
              <Ui.Card.Title>{_("accept-loading-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_("accept-loading-description")}</Ui.Card.Description>
            </>
          ))
          .with("invitation-accepted", () => (
            <>
              <div className="mb-4 flex justify-center">
                <div className="bg-success/10 flex size-12 items-center justify-center rounded-full">
                  <Check className="text-success size-6" />
                </div>
              </div>
              <Ui.Card.Title className="text-success">{_("invitation-accepted-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_("invitation-accepted-description")}</Ui.Card.Description>
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
        .with("invitation-accepted", () => (
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

/**
 * translations
 */
const dictionary = {
  en: {
    "accept-loading-title": "Accepting Invitation",
    "accept-loading-description": "Please wait while we process your acceptance...",
    "invitation-accepted-title": "Invitation Accepted!",
    "invitation-accepted-description": "You have successfully joined the workspace. Redirecting to your dashboard...",
    "error-title": "Link Processing Failed",
    "token-invalid":
      "This invitation link is invalid or has already been used. Invitation links are single-use only. Please contact the person who invited you.",
    "token-expired": "This invitation link has expired. Please request a new invitation.",
    "sign-in": "Go to Sign In",
    "go-to-dashboard": "Continue to Dashboard",
  },
  fr: {
    "accept-loading-title": "Acceptation en cours",
    "accept-loading-description": "Veuillez patienter pendant le traitement de votre acceptation...",
    "invitation-accepted-title": "Invitation acceptée !",
    "invitation-accepted-description": "Vous avez rejoint l'espace de travail avec succès. Redirection vers votre tableau de bord...",
    "error-title": "Échec du traitement du lien",
    "token-invalid":
      "Ce lien d'invitation est invalide ou a déjà été utilisé. Les liens d'invitation sont à usage unique. Veuillez contacter la personne qui vous a invité.",
    "token-expired": "Ce lien d'invitation a expiré. Veuillez demander une nouvelle invitation.",
    "sign-in": "Aller à la connexion",
    "go-to-dashboard": "Continuer vers le tableau de bord",
  },
  de: {
    "accept-loading-title": "Einladung wird angenommen",
    "accept-loading-description": "Bitte warten Sie, während wir Ihre Annahme verarbeiten...",
    "invitation-accepted-title": "Einladung angenommen!",
    "invitation-accepted-description": "Sie sind dem Arbeitsbereich erfolgreich beigetreten. Weiterleitung zu Ihrem Dashboard...",
    "error-title": "Link-Verarbeitung fehlgeschlagen",
    "token-invalid":
      "Dieser Einladungslink ist ungültig oder wurde bereits verwendet. Einladungslinks können nur einmal verwendet werden. Bitte wenden Sie sich an die Person, die Sie eingeladen hat.",
    "token-expired": "Dieser Einladungslink ist abgelaufen. Bitte fordern Sie eine neue Einladung an.",
    "sign-in": "Zur Anmeldung",
    "go-to-dashboard": "Weiter zum Dashboard",
  },
}
