import { useAuthStore } from "@/features/auth"
import { login } from "@/features/auth/store/actions"
import { service } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { X } from "lucide-react"
import React from "react"
import { Link, useLocation } from "wouter"
import dashboardRouteTo from "../../dashboard"
import signInRouteTo from "../../sign-in"

/**
 * PageRefuse
 */
export const PageRefuse: React.FC<{ token: string }> = ({ token }) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const isAuthenticated = useAuthStore(D.prop("isAuthenticated"))
  const [status, setStatus] = React.useState<"loading" | "invitation-refused" | "token-expired" | "token-invalid">("loading")

  // Auto-refuse on mount
  React.useEffect(() => {
    const refuseInvitation = async () => {
      const result = await service.workspaces.invitations.refuse({ token })
      if (result.ok) {
        setStatus("invitation-refused")
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

    refuseInvitation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <Ui.Card.Root className="w-full max-w-md">
      <Ui.Card.Header className="text-center">
        {match(status)
          .with("loading", () => (
            <>
              <div className="mb-4 flex justify-center">
                <Ui.SpinIcon className="text-primary size-8" aria-hidden />
              </div>
              <Ui.Card.Title>{_("refuse-loading-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_("refuse-loading-description")}</Ui.Card.Description>
            </>
          ))
          .with("invitation-refused", () => (
            <>
              <div className="mb-4 flex justify-center">
                <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                  <X className="text-muted-foreground size-6" aria-hidden />
                </div>
              </div>
              <Ui.Card.Title>{_("invitation-refused-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_("invitation-refused-description")}</Ui.Card.Description>
            </>
          ))
          .with("token-expired", "token-invalid", () => (
            <>
              <div className="mb-4 flex justify-center">
                <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
                  <X className="text-destructive size-6" aria-hidden />
                </div>
              </div>
              <Ui.Card.Title className="text-destructive">{_("error-title")}</Ui.Card.Title>
              <Ui.Card.Description>{_(status)}</Ui.Card.Description>
            </>
          ))
          .exhaustive()}
      </Ui.Card.Header>

      {match(status)
        .with("invitation-refused", () => (
          <Ui.Card.Footer>
            <Link className={Ui.buttonVariants({ className: "w-full" })} to={isAuthenticated ? dashboardRouteTo() : signInRouteTo()}>
              {isAuthenticated ? _("go-to-dashboard") : _("sign-in")}
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
    "refuse-loading-title": "Declining Invitation",
    "refuse-loading-description": "Please wait...",
    "invitation-refused-title": "Invitation Declined",
    "invitation-refused-description": "You have declined the workspace invitation.",
    "error-title": "Link Processing Failed",
    "token-invalid":
      "This invitation link is invalid or has already been used. Invitation links are single-use only. Please contact the person who invited you.",
    "token-expired": "This invitation link has expired. Please request a new invitation.",
    "sign-in": "Go to Sign In",
    "go-to-dashboard": "Continue to Dashboard",
  },
  fr: {
    "refuse-loading-title": "Refus en cours",
    "refuse-loading-description": "Veuillez patienter...",
    "invitation-refused-title": "Invitation refusée",
    "invitation-refused-description": "Vous avez refusé l'invitation à l'espace de travail.",
    "error-title": "Échec du traitement du lien",
    "token-invalid":
      "Ce lien d'invitation est invalide ou a déjà été utilisé. Les liens d'invitation sont à usage unique. Veuillez contacter la personne qui vous a invité.",
    "token-expired": "Ce lien d'invitation a expiré. Veuillez demander une nouvelle invitation.",
    "sign-in": "Aller à la connexion",
    "go-to-dashboard": "Continuer vers le tableau de bord",
  },
  de: {
    "refuse-loading-title": "Einladung wird abgelehnt",
    "refuse-loading-description": "Bitte warten Sie...",
    "invitation-refused-title": "Einladung abgelehnt",
    "invitation-refused-description": "Sie haben die Arbeitsbereich-Einladung abgelehnt.",
    "error-title": "Link-Verarbeitung fehlgeschlagen",
    "token-invalid":
      "Dieser Einladungslink ist ungültig oder wurde bereits verwendet. Einladungslinks können nur einmal verwendet werden. Bitte wenden Sie sich an die Person, die Sie eingeladen hat.",
    "token-expired": "Dieser Einladungslink ist abgelaufen. Bitte fordern Sie eine neue Einladung an.",
    "sign-in": "Zur Anmeldung",
    "go-to-dashboard": "Weiter zum Dashboard",
  },
}
