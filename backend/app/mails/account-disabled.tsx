import { Section, Text } from '@react-email/components'
import React from 'react'
import { Footer } from './_components/footer.js'
import { Header } from './_components/header.js'
import { Layout } from './_components/layout.js'
import { config } from './_utils/config.js'
import { getTranslation, translate } from './_utils/translation.js'
import { DefaultProps, EmailComponent } from './_utils/types.js'

type Props = DefaultProps & {
  //
}
const Email: EmailComponent<Props> = ({ language, email }) => {
  const { _ } = getTranslation(dictionary, language)

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
        <Text className="text-gray-700 mb-6">{_('body')}</Text>
        <Text className="text-gray-700 mb-6">{_('reason')}</Text>
      </Section>
      <Section className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-amber-700 text-sm font-medium">🔒 {_('warning-title')}</Text>
        <Text className="text-amber-600 text-xs">{_('warning-body')}</Text>
      </Section>
      <Section>
        <Text className="text-gray-700 mb-4">{_('action')}</Text>
        <Text className="text-gray-700">{_('contact', { support: config.supportEmail })}</Text>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}
Email.subject = (language: string) => translate('subject', dictionary, language)

const dictionary = {
  fr: {
    subject: 'Votre compte a été désactivé',
    title: 'Compte temporairement désactivé',
    greeting: 'Bonjour,',
    body: `Nous vous informons que votre compte ${config.appName} a été temporairement désactivé.`,
    reason: 'Cette désactivation peut être due à plusieurs raisons : violation des conditions d\'utilisation, activité suspecte détectée, ou à votre demande.',
    'warning-title': 'Accès restreint',
    'warning-body': 'Vous ne pouvez plus accéder à votre compte ni à vos données tant qu\'il reste désactivé.',
    action: 'Si vous pensez qu\'il s\'agit d\'une erreur ou si vous souhaitez réactiver votre compte, veuillez nous contacter.',
    contact: 'Notre équipe de support est disponible à l\'adresse {{support}} pour vous aider à résoudre cette situation.',
  },
  en: {
    subject: 'Your account has been disabled',
    title: 'Account temporarily disabled',
    greeting: 'Hello,',
    body: `We inform you that your ${config.appName} account has been temporarily disabled.`,
    reason: 'This deactivation may be due to several reasons: violation of terms of use, detected suspicious activity, or at your request.',
    'warning-title': 'Restricted access',
    'warning-body': 'You can no longer access your account or your data while it remains disabled.',
    action: 'If you believe this is an error or if you wish to reactivate your account, please contact us.',
    contact: 'Our support team is available at {{support}} to help you resolve this situation.',
  },
  de: {
    subject: 'Ihr Konto wurde deaktiviert',
    title: 'Konto vorübergehend deaktiviert',
    greeting: 'Hallo,',
    body: `Wir informieren Sie, dass Ihr ${config.appName}-Konto vorübergehend deaktiviert wurde.`,
    reason: 'Diese Deaktivierung kann mehrere Gründe haben: Verstoß gegen die Nutzungsbedingungen, erkannte verdächtige Aktivität oder auf Ihre Anfrage.',
    'warning-title': 'Eingeschränkter Zugriff',
    'warning-body': 'Sie können nicht mehr auf Ihr Konto oder Ihre Daten zugreifen, solange es deaktiviert bleibt.',
    action: 'Wenn Sie glauben, dass es sich um einen Fehler handelt oder wenn Sie Ihr Konto reaktivieren möchten, kontaktieren Sie uns bitte.',
    contact: 'Unser Support-Team ist unter {{support}} erreichbar, um Ihnen bei der Lösung dieser Situation zu helfen.',
  },
}

export default Email
