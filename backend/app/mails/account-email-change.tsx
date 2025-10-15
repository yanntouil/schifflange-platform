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
    'subject': 'Changement d\'adresse e-mail de votre compte',
    'title': 'Adresse e-mail modifiée',
    'greeting': 'Bonjour,',
    'body': `Notre équipe d'administration a modifié l'adresse e-mail associée à votre compte ${config.appName} pour des raisons de maintenance. Votre nouvelle adresse e-mail est maintenant active.`,
    'cta': 'Accéder à mon compte',
    'security-title': 'Information importante',
    'security-body':
      'Ce changement a été effectué par notre équipe pour maintenir la sécurité et la fonctionnalité de votre compte. Vous pouvez continuer à utiliser votre compte normalement.',
    'alternative':
      'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    'subject': 'Email address change for your account',
    'title': 'Email address updated',
    'greeting': 'Hello,',
    'body': `Our administration team has updated the email address associated with your ${config.appName} account for maintenance reasons. Your new email address is now active.`,
    'cta': 'Access my account',
    'security-title': 'Important information',
    'security-body':
      'This change was made by our team to maintain the security and functionality of your account. You can continue to use your account normally.',
    'alternative': "If the button doesn't work, copy and paste this link into your browser:",
  },
  de: {
    'subject': 'E-Mail-Adresse Ihres Kontos geändert',
    'title': 'E-Mail-Adresse aktualisiert',
    'greeting': 'Hallo,',
    'body': `Unser Administratorteam hat die E-Mail-Adresse Ihres ${config.appName}-Kontos aus Wartungsgründen aktualisiert. Ihre neue E-Mail-Adresse ist jetzt aktiv.`,
    'cta': 'Auf mein Konto zugreifen',
    'security-title': 'Wichtige Information',
    'security-body':
      'Diese Änderung wurde von unserem Team vorgenommen, um die Sicherheit und Funktionalität Ihres Kontos zu gewährleisten. Sie können Ihr Konto weiterhin normal nutzen.',
    'alternative':
      'Falls die Schaltfläche nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
