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
import { mockAuthProps } from './mocked/index.js'

type Props = DefaultProps & {
  token: string
}
const Email: EmailComponent<Props> = ({ language, token, email }) => {
  const { _ } = getTranslation(dictionary, language)
  const verifyUrl = DashboardService.makeRegisterUrl(token)

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
        <Text className="text-gray-700 mb-6">{_('body')}</Text>
      </Section>
      <ButtonPrimary href={verifyUrl}>{_('cta')}</ButtonPrimary>
      <Section>
        <Text className="text-sm text-gray-600 mb-4">{_('alternative')}</Text>
        <Text className="text-xs text-gray-500 break-all mb-6">
          <Link href={verifyUrl} className="text-[#795e20]">
            {verifyUrl}
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
    subject: `Confirmez votre inscription à ${config.appName}`,
    title: `Bienvenue sur ${config.appName}`,
    greeting: 'Bonjour !',
    body: `Merci de vous être inscrit. Pour finaliser votre inscription sur ${config.appName} et commencer à collaborer avec votre équipe, veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous.`,
    cta: "Vérifier l'adresse e-mail",
    alternative:
      'Si le bouton ci-dessus ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    subject: `Confirm your registration to ${config.appName}`,
    title: `Welcome to ${config.appName}`,
    greeting: 'Hello!',
    body: `Thank you for signing up. To complete your registration on ${config.appName} and start collaborating with your team, please verify your email address by clicking the button below.`,
    cta: 'Verify Email Address',
    alternative: "If the button above doesn't work, copy and paste this link into your browser:",
  },
  de: {
    subject: `Bestätigen Sie Ihre Registrierung bei ${config.appName}`,
    title: `Willkommen bei ${config.appName}`,
    greeting: 'Hallo!',
    body: `Vielen Dank für Ihre Registrierung. Um Ihre Registrierung bei ${config.appName} abzuschließen und mit Ihrem Team zusammenzuarbeiten, bestätigen Sie bitte Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken.`,
    cta: 'E-Mail-Adresse bestätigen',
    alternative:
      'Falls die Schaltfläche oben nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
