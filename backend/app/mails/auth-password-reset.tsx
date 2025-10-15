import DashboardService from '#services/utils/dashboard'
import { Link, Section, Text } from '@react-email/components'
import React from 'react'
import { ButtonPrimary } from './_components/button.js'
import { Footer } from './_components/footer.js'
import { Header } from './_components/header.js'
import { Layout } from './_components/layout.js'
import { getTranslation, translate } from './_utils/translation.js'
import { DefaultProps, EmailComponent } from './_utils/types.js'
import { mockPasswordResetProps } from './mocked/index.js'

type Props = DefaultProps & {
  token: string
}
const Email: EmailComponent<Props> = ({ language, token, email }) => {
  const { _ } = getTranslation(dictionary, language)
  const resetUrl = DashboardService.makeResetPasswordUrl(token)

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
      <Text className="text-gray-700 mb-6">{_('body')}</Text>
      <ButtonPrimary href={resetUrl}>{_('cta')}</ButtonPrimary>
      <Section className="bg-[#98C5D5]/30 border border-[#98C5D5] rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-[#3b606e] text-sm font-medium">⏰ {_('expiry-title')}</Text>
        <Text className="text-[#3b606e] text-xs">{_('expiry-body')}</Text>
      </Section>
      <Section>
        <Text className="text-sm text-gray-600 mb-4">{_('alternative')}</Text>
        <Text className="text-xs text-gray-500 break-all mb-6">
          <Link href={resetUrl} className="text-blue-600">
            {resetUrl}
          </Link>
        </Text>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}

Email.subject = (language: string) => translate('subject', dictionary, language)
Email.PreviewProps = mockPasswordResetProps

const dictionary = {
  fr: {
    'subject': 'Réinitialisez votre mot de passe',
    'title': 'Réinitialisation de mot de passe',
    'greeting': 'Bonjour,',
    'body':
      'Nous avons reçu une demande de réinitialisation du mot de passe pour votre compte. Cliquez sur le bouton ci-dessous pour vous connecter automatiquement. Une fois connecté, vous serez redirigé vers les paramètres de votre compte pour définir un nouveau mot de passe.',
    'cta': 'Se connecter et réinitialiser',
    'expiry-title': 'Important',
    'expiry-body':
      'Ce lien de connexion automatique expirera dans 24 heures pour des raisons de sécurité. Après connexion, rendez-vous dans vos paramètres de compte pour changer votre mot de passe.',
    'alternative':
      'Si le bouton ci-dessus ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    'subject': 'Reset your password',
    'title': 'Password Reset',
    'greeting': 'Hello,',
    'body':
      'We received a request to reset the password for your account. Click the button below to automatically sign in. Once logged in, you will be redirected to your account settings to set a new password.',
    'cta': 'Sign in and reset',
    'expiry-title': 'Important',
    'expiry-body':
      'This automatic sign-in link will expire in 24 hours for security reasons. After signing in, go to your account settings to change your password.',
    'alternative':
      "If the button above doesn't work, copy and paste this link into your browser:",
  },
  de: {
    'subject': 'Passwort zurücksetzen',
    'title': 'Passwort-Zurücksetzung',
    'greeting': 'Hallo,',
    'body':
      'Wir haben eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto erhalten. Klicken Sie auf die Schaltfläche unten, um sich automatisch anzumelden. Nach der Anmeldung werden Sie zu Ihren Kontoeinstellungen weitergeleitet, um ein neues Passwort festzulegen.',
    'cta': 'Anmelden und zurücksetzen',
    'expiry-title': 'Wichtig',
    'expiry-body':
      'Dieser automatische Anmeldelink läuft aus Sicherheitsgründen in 24 Stunden ab. Nach der Anmeldung gehen Sie zu Ihren Kontoeinstellungen, um Ihr Passwort zu ändern.',
    'alternative':
      'Falls die Schaltfläche oben nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
