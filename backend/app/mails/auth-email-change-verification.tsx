import DashboardService from '#services/utils/dashboard'
import { Link, Section, Text } from '@react-email/components'
import React from 'react'
import { ButtonPrimary } from './_components/button.js'
import { Footer } from './_components/footer.js'
import { Header } from './_components/header.js'
import { Layout } from './_components/layout.js'
import { getTranslation, translate } from './_utils/translation.js'
import { DefaultProps, EmailComponent } from './_utils/types.js'
import { mockAuthProps } from './mocked/index.js'

type Props = DefaultProps & {
  token: string
}
const Email: EmailComponent<Props> = ({ language, email, token }) => {
  const { _ } = getTranslation(dictionary, language)
  const confirmUrl = DashboardService.makeEmailChangeUrl(token)

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
        <Text className="text-gray-700 mb-5">{_('body', { email })}</Text>
        <Text className="text-gray-700 mb-6">{_('action')}</Text>
        <ButtonPrimary href={confirmUrl}>{_('cta')}</ButtonPrimary>
      </Section>
      <Section className="bg-[#98C5D5]/30 border border-[#98C5D5] rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-[#3b606e] text-sm font-medium">⏰ {_('expiry-title')}</Text>
        <Text className="text-[#3b606e] text-xs">{_('expiry-body')}</Text>
      </Section>
      <Section>
        <Text className="text-sm text-gray-600 mb-4">{_('alternative')}</Text>
        <Text className="text-xs text-gray-500 break-all mb-6">
          <Link href={confirmUrl} className="text-blue-600">
            {confirmUrl}
          </Link>
        </Text>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}

Email.subject = (language: string) => translate('subject', dictionary, language)
Email.PreviewProps = mockAuthProps

const dictionary = {
  fr: {
    'subject': 'Confirmez votre nouvelle adresse e-mail',
    'title': "Changement d'adresse e-mail",
    'greeting': 'Bonjour,',
    'body': 'Vous avez demandé à changer votre adresse e-mail pour : {{email}}',
    'action':
      'Pour des raisons de sécurité, nous devons vérifier que vous avez accès à cette nouvelle adresse. Veuillez confirmer ce changement en cliquant sur le bouton ci-dessous.',
    'cta': 'Confirmer la nouvelle adresse',
    'expiry-title': 'Important',
    'expiry-body':
      'Ce lien de confirmation expirera dans 24 heures. Si vous ne confirmez pas avant, votre adresse e-mail actuelle restera inchangée.',
    'alternative':
      'Si le bouton ci-dessus ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    'subject': 'Confirm your new email address',
    'title': 'Email Address Change',
    'greeting': 'Hello,',
    'body': 'You requested to change your email address to: {{email}}',
    'action':
      'For security reasons, we need to verify that you have access to this new address. Please confirm this change by clicking the button below.',
    'cta': 'Confirm new address',
    'expiry-title': 'Important',
    'expiry-body':
      "This confirmation link will expire in 24 hours. If you don't confirm before then, your current email address will remain unchanged.",
    'alternative': "If the button above doesn't work, copy and paste this link into your browser:",
  },
  de: {
    'subject': 'Bestätigen Sie Ihre neue E-Mail-Adresse',
    'title': 'E-Mail-Adressänderung',
    'greeting': 'Hallo,',
    'body': 'Sie haben beantragt, Ihre E-Mail-Adresse zu ändern in: {{email}}',
    'action':
      'Aus Sicherheitsgründen müssen wir überprüfen, dass Sie Zugang zu dieser neuen Adresse haben. Bitte bestätigen Sie diese Änderung, indem Sie auf die Schaltfläche unten klicken.',
    'cta': 'Neue Adresse bestätigen',
    'expiry-title': 'Wichtig',
    'expiry-body':
      'Dieser Bestätigungslink läuft in 24 Stunden ab. Wenn Sie nicht vorher bestätigen, bleibt Ihre aktuelle E-Mail-Adresse unverändert.',
    'alternative':
      'Falls die Schaltfläche oben nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
