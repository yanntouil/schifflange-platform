import legalConfig from "@/config/legal"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { Link } from "wouter"
import routeToRegister from "../register"

/**
 * Terms of Use Page
 */
const Page: React.FC = () => {
  const { _, format } = useTranslation(dictionary)
  Dashboard.usePage([], _("title"))

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">{_("title")}</h1>
          <p className="text-muted-foreground">
            {_("last-updated")}: {format(legalConfig.lastUpdated, "PPP")}
          </p>
          <p className="text-muted-foreground">
            {_("effective-date")}: {format(legalConfig.effectiveDate, "PPP")}
          </p>
        </div>

        <Ui.Separator />

        {/* Introduction */}
        <section className="space-y-4">
          <p className="leading-relaxed">{_("intro", { company: legalConfig.name, website: legalConfig.website })}</p>

          {/* Sign Up Call to Action */}
          <div className="bg-primary/5 border-primary/20 rounded-lg border p-6 text-center">
            <p className="mb-4 text-lg font-medium">{_("ready-to-start")}</p>
            <Link to={routeToRegister()} className={Ui.buttonVariants({ variant: "default", size: "lg" })}>
              {_("create-account")}
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">{_("by-signing-up")}</p>
          </div>
        </section>

        {/* Section 1: Acceptance */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-1-title")}</h2>
          <p className="leading-relaxed">{_("section-1-content")}</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>{_("section-1-point-1")}</li>
            <li>{_("section-1-point-2")}</li>
          </ul>
        </section>

        {/* Section 2: Services */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-2-title")}</h2>
          <p className="leading-relaxed">{_("section-2-content", { company: legalConfig.name })}</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>{_("section-2-point-1")}</li>
            <li>{_("section-2-point-2")}</li>
            <li>{_("section-2-point-3")}</li>
          </ul>
        </section>

        {/* Section 3: User Accounts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-3-title")}</h2>
          <p className="leading-relaxed">{_("section-3-content")}</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>{_("section-3-point-1")}</li>
            <li>{_("section-3-point-2")}</li>
            <li>{_("section-3-point-3")}</li>
            <li>{_("section-3-point-4")}</li>
          </ul>
        </section>

        {/* Section 4: Prohibited Uses */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-4-title")}</h2>
          <p className="leading-relaxed">{_("section-4-content")}</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>{_("section-4-point-1")}</li>
            <li>{_("section-4-point-2")}</li>
            <li>{_("section-4-point-3")}</li>
            <li>{_("section-4-point-4")}</li>
            <li>{_("section-4-point-5")}</li>
            <li>{_("section-4-point-6")}</li>
          </ul>
        </section>

        {/* Section 5: Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-5-title")}</h2>
          <p className="leading-relaxed">{_("section-5-content", { company: legalConfig.name })}</p>
        </section>

        {/* Section 6: Privacy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-6-title")}</h2>
          <p className="leading-relaxed">{_("section-6-content")}</p>
        </section>

        {/* Section 7: Liability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-7-title")}</h2>
          <p className="leading-relaxed">{_("section-7-content", { company: legalConfig.name })}</p>
        </section>

        {/* Section 8: Termination */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-8-title")}</h2>
          <p className="leading-relaxed">{_("section-8-content")}</p>
        </section>

        {/* Section 9: Changes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-9-title")}</h2>
          <p className="leading-relaxed">{_("section-9-content")}</p>
        </section>

        {/* Section 10: Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-10-title")}</h2>
          <p className="leading-relaxed">{_("section-10-content")}</p>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold">{legalConfig.name}</p>
            <p>{legalConfig.address}</p>
            <p>
              {_("email-label")}{" "}
              <a href={`mailto:${legalConfig.email}`} className="text-primary underline">
                {legalConfig.email}
              </a>
            </p>
            <p>
              {_("website-label")}{" "}
              <a href={legalConfig.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                {legalConfig.website}
              </a>
            </p>
          </div>
        </section>

        {/* Footer */}
        <Ui.Separator />
        <footer className="text-muted-foreground pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} {legalConfig.name}. {_("footer-rights")}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Terms of Use",
    "last-updated": "Last Updated",
    "effective-date": "Effective Date",
    intro:
      "Welcome to {{company}}. These Terms of Use govern your use of our website ({{website}}) and services. By accessing or using our services, you agree to be bound by these terms.",

    "section-1-title": "1. Acceptance of Terms",
    "section-1-content":
      "By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use this service.",
    "section-1-point-1": "You must be at least 18 years old to use this service",
    "section-1-point-2": "You are responsible for ensuring compliance with local laws",

    "section-2-title": "2. Description of Services",
    "section-2-content": "{{company}} provides a platform for project management and collaboration. Our services include:",
    "section-2-point-1": "Project creation and management tools",
    "section-2-point-2": "Team collaboration features",
    "section-2-point-3": "Content management and publishing capabilities",

    "section-3-title": "3. User Accounts",
    "section-3-content": "To access certain features, you must create an account. You agree to:",
    "section-3-point-1": "Provide accurate and complete information",
    "section-3-point-2": "Maintain the security of your password",
    "section-3-point-3": "Notify us immediately of any unauthorized access",
    "section-3-point-4": "Be responsible for all activities under your account",

    "section-4-title": "4. Prohibited Uses",
    "section-4-content": "You may not use our service to:",
    "section-4-point-1": "Violate any laws or regulations",
    "section-4-point-2": "Infringe upon intellectual property rights",
    "section-4-point-3": "Transmit harmful code or malware",
    "section-4-point-4": "Harass, abuse, or harm other users",
    "section-4-point-5": "Engage in fraudulent activities",
    "section-4-point-6": "Attempt to gain unauthorized access to our systems",

    "section-5-title": "5. Intellectual Property",
    "section-5-content":
      "All content, features, and functionality of our service are owned by {{company}} and are protected by international copyright, trademark, and other intellectual property laws.",

    "section-6-title": "6. Privacy",
    "section-6-content":
      "Your use of our service is also governed by our Privacy Policy. Please review our Privacy Policy, which explains how we collect, use, and protect your information.",

    "section-7-title": "7. Limitation of Liability",
    "section-7-content":
      "{{company}} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.",

    "section-8-title": "8. Termination",
    "section-8-content":
      "We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Use or is harmful to other users.",

    "section-9-title": "9. Changes to Terms",
    "section-9-content":
      "We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Use on this page.",

    "section-10-title": "10. Contact Information",
    "section-10-content": "If you have any questions about these Terms of Use, please contact us at:",
    "email-label": "Email:",
    "website-label": "Website:",

    "ready-to-start": "Ready to get started?",
    "create-account": "Create Your Account",
    "by-signing-up": "By signing up, you agree to these Terms of Use and our Privacy Policy.",

    "footer-rights": "All rights reserved.",
  },
  fr: {
    title: "Conditions d'utilisation",
    "last-updated": "Dernière mise à jour",
    "effective-date": "Date d'entrée en vigueur",
    intro:
      "Bienvenue sur {{company}}. Ces conditions d'utilisation régissent votre utilisation de notre site web ({{website}}) et de nos services. En accédant ou en utilisant nos services, vous acceptez d'être lié par ces conditions.",

    "section-1-title": "1. Acceptation des conditions",
    "section-1-content":
      "En accédant et en utilisant ce service, vous acceptez et acceptez d'être lié par les termes et dispositions de cet accord. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce service.",
    "section-1-point-1": "Vous devez avoir au moins 18 ans pour utiliser ce service",
    "section-1-point-2": "Vous êtes responsable de vous assurer de la conformité avec les lois locales",

    "section-2-title": "2. Description des services",
    "section-2-content": "{{company}} fournit une plateforme de gestion de projets et de collaboration. Nos services comprennent :",
    "section-2-point-1": "Outils de création et de gestion de projets",
    "section-2-point-2": "Fonctionnalités de collaboration d'équipe",
    "section-2-point-3": "Capacités de gestion et de publication de contenu",

    "section-3-title": "3. Comptes utilisateurs",
    "section-3-content": "Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous acceptez de :",
    "section-3-point-1": "Fournir des informations exactes et complètes",
    "section-3-point-2": "Maintenir la sécurité de votre mot de passe",
    "section-3-point-3": "Nous informer immédiatement de tout accès non autorisé",
    "section-3-point-4": "Être responsable de toutes les activités sous votre compte",

    "section-4-title": "4. Utilisations interdites",
    "section-4-content": "Vous ne pouvez pas utiliser notre service pour :",
    "section-4-point-1": "Violer des lois ou règlements",
    "section-4-point-2": "Porter atteinte aux droits de propriété intellectuelle",
    "section-4-point-3": "Transmettre du code nuisible ou des logiciels malveillants",
    "section-4-point-4": "Harceler, abuser ou nuire à d'autres utilisateurs",
    "section-4-point-5": "S'engager dans des activités frauduleuses",
    "section-4-point-6": "Tenter d'obtenir un accès non autorisé à nos systèmes",

    "section-5-title": "5. Propriété intellectuelle",
    "section-5-content":
      "Tout le contenu, les fonctionnalités et la fonctionnalité de notre service sont la propriété de {{company}} et sont protégés par les lois internationales sur le droit d'auteur, les marques et autres droits de propriété intellectuelle.",

    "section-6-title": "6. Confidentialité",
    "section-6-content":
      "Votre utilisation de notre service est également régie par notre Politique de confidentialité. Veuillez consulter notre Politique de confidentialité, qui explique comment nous collectons, utilisons et protégeons vos informations.",

    "section-7-title": "7. Limitation de responsabilité",
    "section-7-content":
      "{{company}} ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de votre utilisation ou de votre incapacité à utiliser le service.",

    "section-8-title": "8. Résiliation",
    "section-8-content":
      "Nous nous réservons le droit de résilier ou de suspendre votre compte et l'accès au service à notre seule discrétion, sans préavis, pour une conduite que nous estimons violer ces Conditions d'utilisation ou nuisible aux autres utilisateurs.",

    "section-9-title": "9. Modifications des conditions",
    "section-9-content":
      "Nous nous réservons le droit de modifier ces conditions à tout moment. Nous informerons les utilisateurs de tout changement important en publiant les nouvelles Conditions d'utilisation sur cette page.",

    "section-10-title": "10. Coordonnées",
    "section-10-content": "Si vous avez des questions sur ces Conditions d'utilisation, veuillez nous contacter à :",
    "email-label": "Email :",
    "website-label": "Site web :",

    "ready-to-start": "Prêt à commencer ?",
    "create-account": "Créer votre compte",
    "by-signing-up": "En vous inscrivant, vous acceptez ces Conditions d'utilisation et notre Politique de confidentialité.",

    "footer-rights": "Tous droits réservés.",
  },
  de: {
    title: "Nutzungsbedingungen",
    "last-updated": "Zuletzt aktualisiert",
    "effective-date": "Gültig ab",
    intro:
      "Willkommen bei {{company}}. Diese Nutzungsbedingungen regeln Ihre Nutzung unserer Website ({{website}}) und Dienste. Durch den Zugriff auf oder die Nutzung unserer Dienste erklären Sie sich mit diesen Bedingungen einverstanden.",

    "section-1-title": "1. Annahme der Bedingungen",
    "section-1-content":
      "Durch den Zugriff auf und die Nutzung dieses Dienstes akzeptieren und erklären Sie sich damit einverstanden, an die Bedingungen dieser Vereinbarung gebunden zu sein. Wenn Sie diesen Bedingungen nicht zustimmen, sollten Sie diesen Dienst nicht nutzen.",
    "section-1-point-1": "Sie müssen mindestens 18 Jahre alt sein, um diesen Dienst zu nutzen",
    "section-1-point-2": "Sie sind dafür verantwortlich, die Einhaltung lokaler Gesetze sicherzustellen",

    "section-2-title": "2. Beschreibung der Dienste",
    "section-2-content": "{{company}} bietet eine Plattform für Projektmanagement und Zusammenarbeit. Unsere Dienste umfassen:",
    "section-2-point-1": "Tools zur Projekterstellung und -verwaltung",
    "section-2-point-2": "Team-Kollaborationsfunktionen",
    "section-2-point-3": "Content-Management- und Veröffentlichungsfunktionen",

    "section-3-title": "3. Benutzerkonten",
    "section-3-content": "Um auf bestimmte Funktionen zuzugreifen, müssen Sie ein Konto erstellen. Sie stimmen zu:",
    "section-3-point-1": "Genaue und vollständige Informationen bereitzustellen",
    "section-3-point-2": "Die Sicherheit Ihres Passworts zu gewährleisten",
    "section-3-point-3": "Uns unverzüglich über jeden unbefugten Zugriff zu informieren",
    "section-3-point-4": "Für alle Aktivitäten unter Ihrem Konto verantwortlich zu sein",

    "section-4-title": "4. Verbotene Nutzungen",
    "section-4-content": "Sie dürfen unseren Dienst nicht verwenden, um:",
    "section-4-point-1": "Gesetze oder Vorschriften zu verletzen",
    "section-4-point-2": "Geistige Eigentumsrechte zu verletzen",
    "section-4-point-3": "Schädlichen Code oder Malware zu übertragen",
    "section-4-point-4": "Andere Benutzer zu belästigen, zu missbrauchen oder zu schädigen",
    "section-4-point-5": "Sich an betrügerischen Aktivitäten zu beteiligen",
    "section-4-point-6": "Zu versuchen, unbefugten Zugang zu unseren Systemen zu erhalten",

    "section-5-title": "5. Geistiges Eigentum",
    "section-5-content":
      "Alle Inhalte, Funktionen und Funktionalitäten unseres Dienstes sind Eigentum von {{company}} und sind durch internationale Urheberrechts-, Marken- und andere Gesetze zum geistigen Eigentum geschützt.",

    "section-6-title": "6. Datenschutz",
    "section-6-content":
      "Ihre Nutzung unseres Dienstes unterliegt auch unserer Datenschutzrichtlinie. Bitte lesen Sie unsere Datenschutzrichtlinie, die erklärt, wie wir Ihre Informationen sammeln, verwenden und schützen.",

    "section-7-title": "7. Haftungsbeschränkung",
    "section-7-content":
      "{{company}} haftet nicht für indirekte, zufällige, besondere, Folge- oder Strafschäden, die aus Ihrer Nutzung oder Unfähigkeit zur Nutzung des Dienstes resultieren.",

    "section-8-title": "8. Kündigung",
    "section-8-content":
      "Wir behalten uns das Recht vor, Ihr Konto und den Zugang zum Dienst nach eigenem Ermessen ohne Vorankündigung zu kündigen oder zu sperren, wenn wir der Meinung sind, dass Ihr Verhalten gegen diese Nutzungsbedingungen verstößt oder anderen Benutzern schadet.",

    "section-9-title": "9. Änderungen der Bedingungen",
    "section-9-content":
      "Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Wir werden Benutzer über wesentliche Änderungen informieren, indem wir die neuen Nutzungsbedingungen auf dieser Seite veröffentlichen.",

    "section-10-title": "10. Kontaktinformationen",
    "section-10-content": "Wenn Sie Fragen zu diesen Nutzungsbedingungen haben, kontaktieren Sie uns bitte unter:",
    "email-label": "E-Mail:",
    "website-label": "Webseite:",

    "ready-to-start": "Bereit loszulegen?",
    "create-account": "Konto erstellen",
    "by-signing-up": "Mit der Anmeldung stimmen Sie diesen Nutzungsbedingungen und unserer Datenschutzerklärung zu.",

    "footer-rights": "Alle Rechte vorbehalten.",
  },
}
