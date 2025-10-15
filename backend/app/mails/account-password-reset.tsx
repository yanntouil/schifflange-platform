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
  const resetUrl = DashboardService.makeResetPasswordUrl(token)

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
        <Text className="text-gray-700 mb-6">{_('body')}</Text>
      </Section>
      <ButtonPrimary href={resetUrl}>{_('cta')}</ButtonPrimary>
      <Section className="bg-[#98C5D5]/30 border border-[#98C5D5] rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-[#3b606e] text-sm font-medium">⏰ {_('info-title')}</Text>
        <Text className="text-[#3b606e] text-xs">{_('info-body')}</Text>
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

const dictionary = {
  fr: {
    'subject': 'Réinitialisation de votre mot de passe',
    'title': 'Mot de passe réinitialisé',
    'greeting': 'Bonjour,',
    'body': `Notre équipe d'administration a initié une réinitialisation de votre mot de passe ${config.appName} pour des raisons de sécurité. Cliquez sur le bouton ci-dessous pour vous connecter et définir un nouveau mot de passe.`,
    'cta': 'Se connecter et réinitialiser',
    'info-title': 'Important',
    'info-body':
      'Ce lien vous connectera automatiquement et vous redirigera vers les paramètres de votre compte pour changer votre mot de passe. Le lien expirera dans 24 heures.',
    'alternative':
      'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    'subject': 'Your password reset',
    'title': 'Password reset',
    'greeting': 'Hello,',
    'body': `Our administration team has initiated a password reset for your ${config.appName} account for security reasons. Click the button below to sign in and set a new password.`,
    'cta': 'Sign in and reset',
    'info-title': 'Important',
    'info-body':
      'This link will automatically sign you in and redirect you to your account settings to change your password. The link will expire in 24 hours.',
    'alternative': "If the button doesn't work, copy and paste this link into your browser:",
  },
  de: {
    'subject': 'Ihr Passwort wurde zurückgesetzt',
    'title': 'Passwort-Zurücksetzung',
    'greeting': 'Hallo,',
    'body': `Unser Administratorteam hat aus Sicherheitsgründen eine Passwort-Zurücksetzung für Ihr ${config.appName}-Konto eingeleitet. Klicken Sie auf die Schaltfläche unten, um sich anzumelden und ein neues Passwort festzulegen.`,
    'cta': 'Anmelden und zurücksetzen',
    'info-title': 'Wichtig',
    'info-body':
      'Dieser Link meldet Sie automatisch an und leitet Sie zu Ihren Kontoeinstellungen weiter, um Ihr Passwort zu ändern. Der Link läuft in 24 Stunden ab.',
    'alternative':
      'Falls die Schaltfläche nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
