import { login } from "@/features/auth/store/actions"
import { Payload, service } from "@/services"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Check, X } from "lucide-react"
import React from "react"
import { Link, useLocation } from "wouter"
import dashboardRouteTo from "../../dashboard"
import { FormPassword } from "../../forgot-password/[token]/password"
import signInRouteTo from "../../sign-in"

/**
 * PageRegister
 */
export const PageRegister: React.FC<{ invitation: Payload.Workspaces.PublicInvitation; token: string }> = ({ invitation, token }) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const [status, setStatus] = React.useState<"idle" | "loading" | "invitation-accepted" | "token-expired" | "token-invalid">("idle")

  const form = useForm({
    values: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ values }) => {
      if (values.password !== values.confirmPassword) {
        Ui.toast.error(_("passwords-dont-match"))
        return
      }
      setStatus("loading")
      const result = await service.workspaces.invitations.signUp({ token, password: values.password })
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
    },
  })

  const isFormDisabled = !form.values.password || !form.values.confirmPassword || form.values.password !== form.values.confirmPassword

  return (
    <Ui.Card.Root className="w-full max-w-md">
      <Ui.Card.Header className="text-center">
        {match(status)
          .with("idle", () => (
            <>
              <Ui.Card.Title>{_("invitation-title")}</Ui.Card.Title>
              <Ui.Card.Description>
                {_("invitation-description", { workspace: invitation.workspace, inviter: invitation.createdBy })}
              </Ui.Card.Description>
            </>
          ))
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
        .with("idle", () => (
          <>
            <Ui.Card.Content>
              <Form.Root form={form} className="space-y-6">
                <FormPassword />
              </Form.Root>
            </Ui.Card.Content>
            <Ui.Card.Footer>
              <Ui.Button className="w-full" onClick={() => form.submit()} disabled={isFormDisabled}>
                {_("accept-button")}
              </Ui.Button>
            </Ui.Card.Footer>
          </>
        ))
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
    "invitation-title": "Create Your Account",
    "invitation-description": "{{inviter}} has invited you to join {{workspace}}. Create your account to get started.",
    "accept-button": "Create Account & Accept",
    "accept-loading-title": "Creating Your Account",
    "accept-loading-description": "Please wait while we set up your account...",
    "invitation-accepted-title": "Account Created!",
    "invitation-accepted-description": "Your account has been created successfully. Redirecting to your dashboard...",
    "passwords-dont-match": "Passwords don't match",
    "error-title": "Link Processing Failed",
    "token-invalid":
      "This invitation link is invalid or has already been used. Invitation links are single-use only. Please contact the person who invited you.",
    "token-expired": "This invitation link has expired. Please request a new invitation.",
    "sign-in": "Go to Sign In",
    "go-to-dashboard": "Continue to Dashboard",
  },
  fr: {
    "invitation-title": "Créez votre compte",
    "invitation-description": "{{inviter}} vous a invité à rejoindre {{workspace}}. Créez votre compte pour commencer.",
    "accept-button": "Créer mon compte et accepter",
    "accept-loading-title": "Création de votre compte",
    "accept-loading-description": "Veuillez patienter pendant la configuration de votre compte...",
    "invitation-accepted-title": "Compte créé !",
    "invitation-accepted-description": "Votre compte a été créé avec succès. Redirection vers votre tableau de bord...",
    "passwords-dont-match": "Les mots de passe ne correspondent pas",
    "error-title": "Échec du traitement du lien",
    "token-invalid":
      "Ce lien d'invitation est invalide ou a déjà été utilisé. Les liens d'invitation sont à usage unique. Veuillez contacter la personne qui vous a invité.",
    "token-expired": "Ce lien d'invitation a expiré. Veuillez demander une nouvelle invitation.",
    "sign-in": "Aller à la connexion",
    "go-to-dashboard": "Continuer vers le tableau de bord",
  },
  de: {
    "invitation-title": "Erstellen Sie Ihr Konto",
    "invitation-description": "{{inviter}} hat Sie eingeladen, {{workspace}} beizutreten. Erstellen Sie Ihr Konto, um zu beginnen.",
    "accept-button": "Konto erstellen & Annehmen",
    "accept-loading-title": "Ihr Konto wird erstellt",
    "accept-loading-description": "Bitte warten Sie, während wir Ihr Konto einrichten...",
    "invitation-accepted-title": "Konto erstellt!",
    "invitation-accepted-description": "Ihr Konto wurde erfolgreich erstellt. Weiterleitung zu Ihrem Dashboard...",
    "passwords-dont-match": "Passwörter stimmen nicht überein",
    "error-title": "Link-Verarbeitung fehlgeschlagen",
    "token-invalid":
      "Dieser Einladungslink ist ungültig oder wurde bereits verwendet. Einladungslinks können nur einmal verwendet werden. Bitte wenden Sie sich an die Person, die Sie eingeladen hat.",
    "token-expired": "Dieser Einladungslink ist abgelaufen. Bitte fordern Sie eine neue Einladung an.",
    "sign-in": "Zur Anmeldung",
    "go-to-dashboard": "Weiter zum Dashboard",
  },
}
