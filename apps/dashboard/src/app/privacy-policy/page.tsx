import legalConfig from "@/config/legal"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { Link } from "wouter"
import routeToRegister from "../register"

/**
 * Privacy Policy Page
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
          <p className="leading-relaxed">{_("intro", { company: legalConfig.name })}</p>

          {/* Sign Up Call to Action */}
          <div className="bg-primary/5 border-primary/20 rounded-lg border p-6 text-center">
            <p className="mb-4 text-lg font-medium">{_("ready-to-start")}</p>
            <Link to={routeToRegister()} className={Ui.buttonVariants({ variant: "default", size: "lg" })}>
              {_("create-account")}
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">{_("by-signing-up")}</p>
          </div>
        </section>

        {/* Section 1: Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-1-title")}</h2>
          <p className="leading-relaxed">{_("section-1-content")}</p>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">{_("section-1-subtitle-1")}</h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>{_("section-1-1-point-1")}</li>
              <li>{_("section-1-1-point-2")}</li>
              <li>{_("section-1-1-point-3")}</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">{_("section-1-subtitle-2")}</h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>{_("section-1-2-point-1")}</li>
              <li>{_("section-1-2-point-2")}</li>
              <li>{_("section-1-2-point-3")}</li>
            </ul>
          </div>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-2-title")}</h2>
          <p className="leading-relaxed">{_("section-2-content")}</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>{_("section-2-point-1")}</li>
            <li>{_("section-2-point-2")}</li>
            <li>{_("section-2-point-3")}</li>
            <li>{_("section-2-point-4")}</li>
            <li>{_("section-2-point-5")}</li>
            <li>{_("section-2-point-6")}</li>
          </ul>
        </section>

        {/* Section 3: Information Sharing */}
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

        {/* Section 4: Data Security */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-4-title")}</h2>
          <p className="leading-relaxed">{_("section-4-content")}</p>
        </section>

        {/* Section 5: Data Retention */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-5-title")}</h2>
          <p className="leading-relaxed">{_("section-5-content")}</p>
        </section>

        {/* Section 6: Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-6-title")}</h2>
          <p className="leading-relaxed">{_("section-6-content")}</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>{_("section-6-point-1")}</li>
            <li>{_("section-6-point-2")}</li>
            <li>{_("section-6-point-3")}</li>
          </ul>
        </section>

        {/* Section 7: Your Rights */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-7-title")}</h2>
          <p className="leading-relaxed">{_("section-7-content")}</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>{_("section-7-point-1")}</li>
            <li>{_("section-7-point-2")}</li>
            <li>{_("section-7-point-3")}</li>
            <li>{_("section-7-point-4")}</li>
            <li>{_("section-7-point-5")}</li>
            <li>{_("section-7-point-6")}</li>
          </ul>
        </section>

        {/* Section 8: Children's Privacy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-8-title")}</h2>
          <p className="leading-relaxed">{_("section-8-content")}</p>
        </section>

        {/* Section 9: International Data Transfers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-9-title")}</h2>
          <p className="leading-relaxed">{_("section-9-content")}</p>
        </section>

        {/* Section 10: Changes to This Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-10-title")}</h2>
          <p className="leading-relaxed">{_("section-10-content")}</p>
        </section>

        {/* Section 11: Contact Us */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{_("section-11-title")}</h2>
          <p className="leading-relaxed">{_("section-11-content")}</p>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold">{legalConfig.name}</p>
            <p>{_("data-protection-officer")}</p>
            <p>{legalConfig.address}</p>
            <p>
              {_("email-label")}{" "}
              <a href={`mailto:${legalConfig.privacyEmail || legalConfig.email}`} className="text-primary underline">
                {legalConfig.privacyEmail || legalConfig.email}
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
    title: "Privacy Policy",
    "last-updated": "Last Updated",
    "effective-date": "Effective Date",
    intro:
      "At {{company}}, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. Please read this privacy policy carefully.",

    "section-1-title": "1. Information We Collect",
    "section-1-content":
      "We collect information you provide directly to us and information automatically collected when you use our services.",
    "section-1-subtitle-1": "Personal Information",
    "section-1-1-point-1": "Name, email address, and contact information",
    "section-1-1-point-2": "Account credentials and profile information",
    "section-1-1-point-3": "Payment information (processed securely through third-party providers)",
    "section-1-subtitle-2": "Automatically Collected Information",
    "section-1-2-point-1": "Usage data and activity logs",
    "section-1-2-point-2": "IP address, browser type, and device information",
    "section-1-2-point-3": "Cookies and similar tracking technologies",

    "section-2-title": "2. How We Use Your Information",
    "section-2-content": "We use the information we collect to:",
    "section-2-point-1": "Provide, maintain, and improve our services",
    "section-2-point-2": "Process transactions and send related information",
    "section-2-point-3": "Send technical notices, updates, security alerts, and support messages",
    "section-2-point-4": "Respond to your comments, questions, and requests",
    "section-2-point-5": "Monitor and analyze usage patterns and trends",
    "section-2-point-6": "Comply with legal obligations and protect our rights",

    "section-3-title": "3. Information Sharing and Disclosure",
    "section-3-content":
      "We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:",
    "section-3-point-1": "With your consent or at your direction",
    "section-3-point-2": "With service providers who assist us in operating our services",
    "section-3-point-3": "To comply with legal obligations or respond to legal requests",
    "section-3-point-4": "To protect the rights, property, and safety of our company, users, or others",

    "section-4-title": "4. Data Security",
    "section-4-content":
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.",

    "section-5-title": "5. Data Retention",
    "section-5-content":
      "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.",

    "section-6-title": "6. Cookies and Tracking Technologies",
    "section-6-content": "We use cookies and similar tracking technologies to:",
    "section-6-point-1": "Keep you logged in and remember your preferences",
    "section-6-point-2": "Analyze how our services are used",
    "section-6-point-3": "Personalize your experience",

    "section-7-title": "7. Your Rights and Choices",
    "section-7-content": "Depending on your location, you may have certain rights regarding your personal information:",
    "section-7-point-1": "Access and receive a copy of your personal information",
    "section-7-point-2": "Correct or update inaccurate information",
    "section-7-point-3": "Delete your personal information",
    "section-7-point-4": "Object to or restrict certain processing",
    "section-7-point-5": "Data portability",
    "section-7-point-6": "Withdraw consent at any time",

    "section-8-title": "8. Children's Privacy",
    "section-8-content":
      "Our services are not directed to children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.",

    "section-9-title": "9. International Data Transfers",
    "section-9-content":
      "Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We ensure appropriate safeguards are in place to protect your information.",

    "section-10-title": "10. Changes to This Privacy Policy",
    "section-10-content":
      "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date.",

    "section-11-title": "11. Contact Us",
    "section-11-content": "If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:",
    "data-protection-officer": "Data Protection Officer",
    "email-label": "Email:",
    "website-label": "Website:",

    "ready-to-start": "Ready to get started with our services?",
    "create-account": "Create Your Account",
    "by-signing-up": "By signing up, you agree to this Privacy Policy and our Terms of Use.",

    "footer-rights": "All rights reserved.",
  },
  fr: {
    title: "Politique de confidentialité",
    "last-updated": "Dernière mise à jour",
    "effective-date": "Date d'entrée en vigueur",
    intro:
      "Chez {{company}}, nous nous engageons à protéger votre vie privée. Cette Politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez nos services. Veuillez lire attentivement cette politique de confidentialité.",

    "section-1-title": "1. Informations que nous collectons",
    "section-1-content":
      "Nous collectons les informations que vous nous fournissez directement et les informations collectées automatiquement lorsque vous utilisez nos services.",
    "section-1-subtitle-1": "Informations personnelles",
    "section-1-1-point-1": "Nom, adresse email et coordonnées",
    "section-1-1-point-2": "Identifiants de compte et informations de profil",
    "section-1-1-point-3": "Informations de paiement (traitées de manière sécurisée par des fournisseurs tiers)",
    "section-1-subtitle-2": "Informations collectées automatiquement",
    "section-1-2-point-1": "Données d'utilisation et journaux d'activité",
    "section-1-2-point-2": "Adresse IP, type de navigateur et informations sur l'appareil",
    "section-1-2-point-3": "Cookies et technologies de suivi similaires",

    "section-2-title": "2. Comment nous utilisons vos informations",
    "section-2-content": "Nous utilisons les informations que nous collectons pour :",
    "section-2-point-1": "Fournir, maintenir et améliorer nos services",
    "section-2-point-2": "Traiter les transactions et envoyer les informations connexes",
    "section-2-point-3": "Envoyer des notifications techniques, mises à jour, alertes de sécurité et messages d'assistance",
    "section-2-point-4": "Répondre à vos commentaires, questions et demandes",
    "section-2-point-5": "Surveiller et analyser les modèles d'utilisation et les tendances",
    "section-2-point-6": "Respecter les obligations légales et protéger nos droits",

    "section-3-title": "3. Partage et divulgation des informations",
    "section-3-content":
      "Nous ne vendons, n'échangeons ni ne louons vos informations personnelles. Nous pouvons partager vos informations uniquement dans les circonstances suivantes :",
    "section-3-point-1": "Avec votre consentement ou à votre demande",
    "section-3-point-2": "Avec des prestataires de services qui nous aident à exploiter nos services",
    "section-3-point-3": "Pour respecter les obligations légales ou répondre aux demandes légales",
    "section-3-point-4": "Pour protéger les droits, la propriété et la sécurité de notre entreprise, des utilisateurs ou d'autres",

    "section-4-title": "4. Sécurité des données",
    "section-4-content":
      "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles contre l'accès non autorisé, l'altération, la divulgation ou la destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sécurisée à 100%.",

    "section-5-title": "5. Conservation des données",
    "section-5-content":
      "Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services, respecter les obligations légales, résoudre les litiges et faire respecter nos accords. Lorsque nous n'avons plus besoin de vos informations, nous les supprimons ou les anonymisons de manière sécurisée.",

    "section-6-title": "6. Cookies et technologies de suivi",
    "section-6-content": "Nous utilisons des cookies et des technologies de suivi similaires pour :",
    "section-6-point-1": "Vous garder connecté et mémoriser vos préférences",
    "section-6-point-2": "Analyser comment nos services sont utilisés",
    "section-6-point-3": "Personnaliser votre expérience",

    "section-7-title": "7. Vos droits et choix",
    "section-7-content": "Selon votre localisation, vous pouvez avoir certains droits concernant vos informations personnelles :",
    "section-7-point-1": "Accéder et recevoir une copie de vos informations personnelles",
    "section-7-point-2": "Corriger ou mettre à jour les informations inexactes",
    "section-7-point-3": "Supprimer vos informations personnelles",
    "section-7-point-4": "S'opposer ou restreindre certains traitements",
    "section-7-point-5": "Portabilité des données",
    "section-7-point-6": "Retirer votre consentement à tout moment",

    "section-8-title": "8. Confidentialité des enfants",
    "section-8-content":
      "Nos services ne s'adressent pas aux enfants de moins de 18 ans. Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants de moins de 18 ans. Si nous prenons connaissance que nous avons collecté des informations personnelles d'un enfant de moins de 18 ans, nous prendrons des mesures pour supprimer ces informations.",

    "section-9-title": "9. Transferts internationaux de données",
    "section-9-content":
      "Vos informations peuvent être transférées et traitées dans des pays autres que votre pays de résidence. Ces pays peuvent avoir des lois sur la protection des données différentes de celles de votre pays. Nous nous assurons que des garanties appropriées sont en place pour protéger vos informations.",

    "section-10-title": "10. Modifications de cette politique de confidentialité",
    "section-10-content":
      "Nous pouvons mettre à jour cette Politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant la nouvelle Politique de confidentialité sur cette page et en mettant à jour la date de 'Dernière mise à jour'.",

    "section-11-title": "11. Nous contacter",
    "section-11-content":
      "Si vous avez des questions ou des préoccupations concernant cette Politique de confidentialité ou nos pratiques de confidentialité, veuillez nous contacter à :",
    "data-protection-officer": "Délégué à la protection des données",
    "email-label": "Email :",
    "website-label": "Site web :",

    "ready-to-start": "Prêt à commencer avec nos services ?",
    "create-account": "Créer votre compte",
    "by-signing-up": "En vous inscrivant, vous acceptez cette Politique de confidentialité et nos Conditions d'utilisation.",

    "footer-rights": "Tous droits réservés.",
  },
  de: {
    title: "Datenschutzerklärung",
    "last-updated": "Zuletzt aktualisiert",
    "effective-date": "Gültig ab",
    intro:
      "Bei {{company}} verpflichten wir uns, Ihre Privatsphäre zu schützen. Diese Datenschutzerklärung erklärt, wie wir Ihre Informationen sammeln, verwenden, offenlegen und schützen, wenn Sie unsere Dienste nutzen. Bitte lesen Sie diese Datenschutzerklärung sorgfältig durch.",

    "section-1-title": "1. Informationen, die wir sammeln",
    "section-1-content":
      "Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, und Informationen, die automatisch gesammelt werden, wenn Sie unsere Dienste nutzen.",
    "section-1-subtitle-1": "Persönliche Informationen",
    "section-1-1-point-1": "Name, E-Mail-Adresse und Kontaktinformationen",
    "section-1-1-point-2": "Kontozugangsdaten und Profilinformationen",
    "section-1-1-point-3": "Zahlungsinformationen (sicher über Drittanbieter verarbeitet)",
    "section-1-subtitle-2": "Automatisch gesammelte Informationen",
    "section-1-2-point-1": "Nutzungsdaten und Aktivitätsprotokolle",
    "section-1-2-point-2": "IP-Adresse, Browsertyp und Geräteinformationen",
    "section-1-2-point-3": "Cookies und ähnliche Tracking-Technologien",

    "section-2-title": "2. Wie wir Ihre Informationen verwenden",
    "section-2-content": "Wir verwenden die gesammelten Informationen, um:",
    "section-2-point-1": "Unsere Dienste bereitzustellen, zu warten und zu verbessern",
    "section-2-point-2": "Transaktionen zu verarbeiten und zugehörige Informationen zu senden",
    "section-2-point-3": "Technische Mitteilungen, Updates, Sicherheitswarnungen und Support-Nachrichten zu senden",
    "section-2-point-4": "Auf Ihre Kommentare, Fragen und Anfragen zu antworten",
    "section-2-point-5": "Nutzungsmuster und Trends zu überwachen und zu analysieren",
    "section-2-point-6": "Rechtliche Verpflichtungen einzuhalten und unsere Rechte zu schützen",

    "section-3-title": "3. Informationsweitergabe und Offenlegung",
    "section-3-content":
      "Wir verkaufen, handeln oder vermieten Ihre persönlichen Informationen nicht. Wir können Ihre Informationen nur unter folgenden Umständen teilen:",
    "section-3-point-1": "Mit Ihrer Zustimmung oder auf Ihre Anweisung",
    "section-3-point-2": "Mit Dienstleistern, die uns beim Betrieb unserer Dienste unterstützen",
    "section-3-point-3": "Um rechtlichen Verpflichtungen nachzukommen oder auf rechtliche Anfragen zu reagieren",
    "section-3-point-4": "Um die Rechte, das Eigentum und die Sicherheit unseres Unternehmens, der Nutzer oder anderer zu schützen",

    "section-4-title": "4. Datensicherheit",
    "section-4-content":
      "Wir implementieren angemessene technische und organisatorische Maßnahmen, um Ihre persönlichen Informationen vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung zu schützen. Jedoch ist keine Übertragungsmethode über das Internet oder elektronische Speicherung zu 100% sicher.",

    "section-5-title": "5. Datenspeicherung",
    "section-5-content":
      "Wir bewahren Ihre persönlichen Informationen so lange auf, wie es notwendig ist, um unsere Dienste bereitzustellen, rechtlichen Verpflichtungen nachzukommen, Streitigkeiten zu lösen und unsere Vereinbarungen durchzusetzen. Wenn wir Ihre Informationen nicht mehr benötigen, löschen oder anonymisieren wir sie sicher.",

    "section-6-title": "6. Cookies und Tracking-Technologien",
    "section-6-content": "Wir verwenden Cookies und ähnliche Tracking-Technologien, um:",
    "section-6-point-1": "Sie eingeloggt zu halten und Ihre Präferenzen zu speichern",
    "section-6-point-2": "Zu analysieren, wie unsere Dienste genutzt werden",
    "section-6-point-3": "Ihre Erfahrung zu personalisieren",

    "section-7-title": "7. Ihre Rechte und Wahlmöglichkeiten",
    "section-7-content": "Je nach Ihrem Standort haben Sie möglicherweise bestimmte Rechte bezüglich Ihrer persönlichen Informationen:",
    "section-7-point-1": "Zugriff auf und Erhalt einer Kopie Ihrer persönlichen Informationen",
    "section-7-point-2": "Korrektur oder Aktualisierung ungenauer Informationen",
    "section-7-point-3": "Löschung Ihrer persönlichen Informationen",
    "section-7-point-4": "Widerspruch gegen oder Einschränkung bestimmter Verarbeitungen",
    "section-7-point-5": "Datenportabilität",
    "section-7-point-6": "Widerruf der Einwilligung jederzeit",

    "section-8-title": "8. Datenschutz für Kinder",
    "section-8-content":
      "Unsere Dienste richten sich nicht an Kinder unter 18 Jahren. Wir sammeln wissentlich keine persönlichen Informationen von Kindern unter 18 Jahren. Wenn wir erfahren, dass wir persönliche Informationen von einem Kind unter 18 Jahren gesammelt haben, werden wir Schritte unternehmen, um diese Informationen zu löschen.",

    "section-9-title": "9. Internationale Datenübertragungen",
    "section-9-content":
      "Ihre Informationen können in Länder außerhalb Ihres Wohnsitzlandes übertragen und dort verarbeitet werden. Diese Länder können Datenschutzgesetze haben, die sich von den Gesetzen Ihres Landes unterscheiden. Wir stellen sicher, dass angemessene Schutzmaßnahmen vorhanden sind, um Ihre Informationen zu schützen.",

    "section-10-title": "10. Änderungen dieser Datenschutzerklärung",
    "section-10-content":
      "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Wir werden Sie über Änderungen informieren, indem wir die neue Datenschutzerklärung auf dieser Seite veröffentlichen und das Datum 'Zuletzt aktualisiert' aktualisieren.",

    "section-11-title": "11. Kontaktieren Sie uns",
    "section-11-content":
      "Wenn Sie Fragen oder Bedenken zu dieser Datenschutzerklärung oder unseren Datenschutzpraktiken haben, kontaktieren Sie uns bitte unter:",
    "data-protection-officer": "Datenschutzbeauftragter",
    "email-label": "E-Mail:",
    "website-label": "Webseite:",

    "ready-to-start": "Bereit, mit unseren Diensten zu beginnen?",
    "create-account": "Konto erstellen",
    "by-signing-up": "Mit der Anmeldung stimmen Sie dieser Datenschutzerklärung und unseren Nutzungsbedingungen zu.",

    "footer-rights": "Alle Rechte vorbehalten.",
  },
}
