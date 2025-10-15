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
        <Text className="text-gray-700 mb-6">{_('instruction')}</Text>
      </Section>
      <Section className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-blue-700 text-sm font-medium">⏳ {_('info-title')}</Text>
        <Text className="text-blue-600 text-xs">{_('info-body')}</Text>
      </Section>
      <Section>
        <Text className="text-gray-700 mb-4">{_('next-steps')}</Text>
        <Text className="text-gray-700">{_('contact', { support: config.supportEmail })}</Text>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}
Email.subject = (language: string) => translate('subject', dictionary, language)

const dictionary = {
  fr: {
    subject: 'Votre compte est en attente d\'activation',
    title: 'Compte en cours de validation',
    greeting: 'Bonjour,',
    body: `Merci de votre inscription sur ${config.appName}. Votre compte a été créé avec succès et est actuellement en attente d'activation.`,
    instruction: 'Notre équipe va examiner votre demande d\'inscription. Ce processus de validation nous permet de maintenir un environnement sûr et de qualité pour tous nos utilisateurs.',
    'info-title': 'Délai d\'activation',
    'info-body': 'La validation de votre compte prend généralement entre 24 et 48 heures ouvrées. Vous recevrez un e-mail de confirmation dès que votre compte sera activé.',
    'next-steps': 'Une fois votre compte activé, vous pourrez vous connecter et accéder à toutes les fonctionnalités de la plateforme.',
    contact: 'Si vous avez des questions ou si vous souhaitez accélérer le processus, n\'hésitez pas à nous contacter à {{support}}.',
  },
  en: {
    subject: 'Your account is pending activation',
    title: 'Account under validation',
    greeting: 'Hello,',
    body: `Thank you for signing up for ${config.appName}. Your account has been successfully created and is currently pending activation.`,
    instruction: 'Our team will review your registration request. This validation process helps us maintain a safe and quality environment for all our users.',
    'info-title': 'Activation timeframe',
    'info-body': 'Account validation typically takes between 24 and 48 business hours. You will receive a confirmation email as soon as your account is activated.',
    'next-steps': 'Once your account is activated, you will be able to log in and access all platform features.',
    contact: 'If you have any questions or would like to expedite the process, please feel free to contact us at {{support}}.',
  },
  de: {
    subject: 'Ihr Konto wartet auf Aktivierung',
    title: 'Konto in Überprüfung',
    greeting: 'Hallo,',
    body: `Vielen Dank für Ihre Registrierung bei ${config.appName}. Ihr Konto wurde erfolgreich erstellt und wartet derzeit auf Aktivierung.`,
    instruction: 'Unser Team wird Ihre Registrierungsanfrage überprüfen. Dieser Validierungsprozess hilft uns, eine sichere und qualitativ hochwertige Umgebung für alle unsere Benutzer aufrechtzuerhalten.',
    'info-title': 'Aktivierungszeitraum',
    'info-body': 'Die Kontovalidierung dauert in der Regel zwischen 24 und 48 Geschäftsstunden. Sie erhalten eine Bestätigungs-E-Mail, sobald Ihr Konto aktiviert ist.',
    'next-steps': 'Sobald Ihr Konto aktiviert ist, können Sie sich anmelden und auf alle Plattformfunktionen zugreifen.',
    contact: 'Wenn Sie Fragen haben oder den Prozess beschleunigen möchten, kontaktieren Sie uns bitte unter {{support}}.',
  },
}

export default Email
