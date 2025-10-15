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
        <Text className="text-gray-700 mb-6">{_('info')}</Text>
      </Section>
      <ButtonPrimary href={authenticationUrl}>{_('cta')}</ButtonPrimary>
      <Section className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-green-700 text-sm font-medium">🎉 {_('welcome-title')}</Text>
        <Text className="text-green-600 text-xs">{_('welcome-body')}</Text>
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
    'subject': `Bienvenue sur ${config.appName} !`,
    'title': `Bienvenue sur ${config.appName}`,
    'greeting': 'Bonjour et bienvenue !',
    'body': `Notre équipe vous a créé un compte sur ${config.appName}. Nous sommes ravis de vous accueillir dans notre plateforme !`,
    'info': 'Votre compte est maintenant prêt à être utilisé. Cliquez sur le bouton ci-dessous pour vous connecter directement et commencer à explorer toutes les fonctionnalités disponibles.',
    'cta': 'Accéder à mon compte',
    'welcome-title': 'Votre aventure commence !',
    'welcome-body':
      'Une fois connecté, vous pourrez personnaliser votre profil et définir un mot de passe pour sécuriser votre compte pour les prochaines connexions.',
    'alternative':
      'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    'subject': `Welcome to ${config.appName}!`,
    'title': `Welcome to ${config.appName}`,
    'greeting': 'Hello and welcome!',
    'body': `Our team has created an account for you on ${config.appName}. We're delighted to welcome you to our platform!`,
    'info': 'Your account is now ready to use. Click the button below to sign in directly and start exploring all available features.',
    'cta': 'Access my account',
    'welcome-title': 'Your journey begins!',
    'welcome-body':
      'Once signed in, you can customize your profile and set a password to secure your account for future logins.',
    'alternative': "If the button doesn't work, copy and paste this link into your browser:",
  },
  de: {
    'subject': `Willkommen bei ${config.appName}!`,
    'title': `Willkommen bei ${config.appName}`,
    'greeting': 'Hallo und willkommen!',
    'body': `Unser Team hat für Sie ein Konto bei ${config.appName} erstellt. Wir freuen uns, Sie auf unserer Plattform begrüßen zu dürfen!`,
    'info': 'Ihr Konto ist jetzt einsatzbereit. Klicken Sie auf die Schaltfläche unten, um sich direkt anzumelden und alle verfügbaren Funktionen zu erkunden.',
    'cta': 'Auf mein Konto zugreifen',
    'welcome-title': 'Ihre Reise beginnt!',
    'welcome-body':
      'Nach der Anmeldung können Sie Ihr Profil anpassen und ein Passwort festlegen, um Ihr Konto für zukünftige Anmeldungen zu sichern.',
    'alternative':
      'Falls die Schaltfläche nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
