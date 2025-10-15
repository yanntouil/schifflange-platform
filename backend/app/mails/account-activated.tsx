import DashboardService from '#services/utils/dashboard'
import { Section, Text } from '@react-email/components'
import React from 'react'
import { ButtonPrimary } from './_components/button.js'
import { Footer } from './_components/footer.js'
import { Header } from './_components/header.js'
import { Layout } from './_components/layout.js'
import { getTranslation, translate } from './_utils/translation.js'
import { DefaultProps, EmailComponent } from './_utils/types.js'

type Props = DefaultProps & {
  //
}
const Email: EmailComponent<Props> = ({ language, email }) => {
  const { _ } = getTranslation(dictionary, language)
  const loginUrl = DashboardService.makeLoginUrl()

  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
        <Text className="text-gray-700 mb-6">{_('body')}</Text>
      </Section>
      <ButtonPrimary href={loginUrl}>{_('cta')}</ButtonPrimary>
      <Footer language={language} email={email} />
    </Layout>
  )
}
Email.subject = (language: string) => translate('subject', dictionary, language)

const dictionary = {
  fr: {
    subject: 'Votre compte est maintenant actif',
    title: 'Compte activé avec succès',
    greeting: 'Félicitations !',
    body: 'Votre compte a été activé avec succès. Vous avez maintenant accès à toutes les fonctionnalités de la plateforme. Connectez-vous dès maintenant pour commencer à utiliser votre espace de travail.',
    cta: 'Accéder à mon compte',
  },
  en: {
    subject: 'Your account is now active',
    title: 'Account successfully activated',
    greeting: 'Congratulations!',
    body: 'Your account has been successfully activated. You now have access to all platform features. Sign in now to start using your workspace.',
    cta: 'Access my account',
  },
  de: {
    subject: 'Ihr Konto ist jetzt aktiv',
    title: 'Konto erfolgreich aktiviert',
    greeting: 'Herzlichen Glückwunsch!',
    body: 'Ihr Konto wurde erfolgreich aktiviert. Sie haben jetzt Zugriff auf alle Plattformfunktionen. Melden Sie sich jetzt an, um Ihren Arbeitsbereich zu nutzen.',
    cta: 'Auf mein Konto zugreifen',
  },
}

export default Email
