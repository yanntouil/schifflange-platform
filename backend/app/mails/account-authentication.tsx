import DashboardService from '#services/utils/dashboard'
import { Link, Section, Text } from '@react-email/components'
import React from 'react'
import { ButtonPrimary } from './_components/button.js'
import { Footer } from './_components/footer.js'
import { Header } from './_components/header.js'
import { Layout } from './_components/layout.js'
import { config } from './_utils/config.js'
import { getTranslation, translate } from './_utils/translation.js'
import { DefaultProps, EmailComponent } from './_utils/types.js'

type Props = DefaultProps & {
  token: string
}
const Email: EmailComponent<Props> = ({ language, email, token }) => {
  const { _ } = getTranslation(dictionary, language)
  const authenticationUrl = DashboardService.makeAuthenticationUrl(token)

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
        <Text className="text-gray-700 mb-6">{_('body')}</Text>
      </Section>
      <ButtonPrimary href={authenticationUrl}>{_('cta')}</ButtonPrimary>
      <Section className="bg-[#98C5D5]/30 border border-[#98C5D5] rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-[#3b606e] text-sm font-medium">🔐 {_('security-title')}</Text>
        <Text className="text-[#3b606e] text-xs">{_('security-body')}</Text>
      </Section>
      <Section>
        <Text className="text-sm text-gray-600 mb-4">{_('alternative')}</Text>
        <Text className="text-xs text-gray-500 break-all mb-6">
          <Link href={authenticationUrl} className="text-blue-600">
            {authenticationUrl}
          </Link>
        </Text>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}
Email.subject = (language: string) => translate('subject', dictionary, language)

const dictionary = {
  fr: {
    subject: 'Connexion sécurisée à votre compte',
    title: 'Lien de connexion rapide',
    greeting: 'Bonjour,',
    body: `Nous vous envoyons un lien de connexion sécurisé pour accéder à votre compte ${config.appName}. Cliquez sur le bouton ci-dessous pour vous connecter instantanément, sans mot de passe.`,
    cta: 'Se connecter maintenant',
    'security-title': 'Sécurité',
    'security-body': 'Ce lien de connexion est à usage unique et expirera dans 15 minutes. Si vous n\'avez pas demandé ce lien, ignorez cet e-mail et votre compte restera sécurisé.',
    'alternative': 'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    subject: 'Secure login to your account',
    title: 'Quick Login Link',
    greeting: 'Hello,',
    body: `We are sending you a secure login link to access your ${config.appName} account. Click the button below to instantly sign in without a password.`,
    cta: 'Sign in now',
    'security-title': 'Security',
    'security-body': 'This login link is single-use and will expire in 15 minutes. If you didn\'t request this link, ignore this email and your account will remain secure.',
    'alternative': 'If the button doesn\'t work, copy and paste this link into your browser:',
  },
  de: {
    subject: 'Sichere Anmeldung bei Ihrem Konto',
    title: 'Schneller Anmeldelink',
    greeting: 'Hallo,',
    body: `Wir senden Ihnen einen sicheren Anmeldelink für den Zugriff auf Ihr ${config.appName}-Konto. Klicken Sie auf die Schaltfläche unten, um sich sofort ohne Passwort anzumelden.`,
    cta: 'Jetzt anmelden',
    'security-title': 'Sicherheit',
    'security-body': 'Dieser Anmeldelink ist einmalig verwendbar und läuft in 15 Minuten ab. Wenn Sie diesen Link nicht angefordert haben, ignorieren Sie diese E-Mail und Ihr Konto bleibt sicher.',
    'alternative': 'Falls die Schaltfläche nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
