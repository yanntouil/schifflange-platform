import DashboardService from '#services/utils/dashboard'
import { Section, Text } from '@react-email/components'
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
  const authenticationUrl = DashboardService.makeAuthenticationUrl(token)

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
      <Text className="text-gray-700 mb-5">{_('body', { email })}</Text>
      <Section className="bg-[#FFD167]/30 border border-[#FFD167] rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-[#795e20] text-sm font-medium">⚠️ {_('warning-title')}</Text>
        <Text className="text-[#795e20] text-xs">{_('warning-body')}</Text>
      </Section>
      <Section>
        <Text className="text-gray-700 mb-6">{_('action')}</Text>
        <ButtonPrimary href={authenticationUrl}>{_('cta')}</ButtonPrimary>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}

Email.subject = (language: string) => translate('subject', dictionary, language)
Email.PreviewProps = mockAuthProps

const dictionary = {
  fr: {
    'subject': "Quelqu'un a tenté de s'inscrire avec votre e-mail",
    'title': "Tentative d'inscription de compte",
    'greeting': 'Bonjour,',
    'body':
      "Quelqu'un a récemment tenté de créer un nouveau compte en utilisant votre adresse e-mail ({{email}}). Comme vous avez déjà un compte chez nous, nous voulions vous informer de cette tentative.",
    'warning-title': 'Avis de sécurité',
    'warning-body':
      "Si ce n'était pas vous, veuillez vous assurer que votre compte e-mail est sécurisé et envisagez de changer votre mot de passe.",
    'action':
      "Si vous essayiez d'accéder à votre compte existant, vous pouvez vous connecter en utilisant le bouton ci-dessous :",
    'cta': 'Se connecter à votre compte',
  },
  en: {
    'subject': "Someone attempted to sign up with your email",
    'title': "Account Registration Attempt",
    'greeting': 'Hello,',
    'body':
      "Someone recently tried to create a new account using your email address ({{email}}). Since you already have an account with us, we wanted to inform you of this attempt.",
    'warning-title': 'Security Notice',
    'warning-body':
      "If this wasn't you, please ensure your email account is secure and consider changing your password.",
    'action':
      "If you were trying to access your existing account, you can sign in using the button below:",
    'cta': 'Sign in to your account',
  },
  de: {
    'subject': "Jemand hat versucht, sich mit Ihrer E-Mail anzumelden",
    'title': "Versuchte Kontoregistrierung",
    'greeting': 'Hallo,',
    'body':
      "Jemand hat kürzlich versucht, ein neues Konto mit Ihrer E-Mail-Adresse ({{email}}) zu erstellen. Da Sie bereits ein Konto bei uns haben, wollten wir Sie über diesen Versuch informieren.",
    'warning-title': 'Sicherheitshinweis',
    'warning-body':
      "Wenn Sie das nicht waren, stellen Sie bitte sicher, dass Ihr E-Mail-Konto sicher ist und erwägen Sie, Ihr Passwort zu ändern.",
    'action':
      "Wenn Sie versucht haben, auf Ihr bestehendes Konto zuzugreifen, können Sie sich über die Schaltfläche unten anmelden:",
    'cta': 'Bei Ihrem Konto anmelden',
  },
}

export default Email
