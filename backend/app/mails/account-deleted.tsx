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
        <Text className="text-gray-700 mb-6">{_('consequences')}</Text>
      </Section>
      <Section className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-red-700 text-sm font-medium">⚠️ {_('warning-title')}</Text>
        <Text className="text-red-600 text-xs">{_('warning-body')}</Text>
      </Section>
      <Section>
        <Text className="text-gray-700">{_('farewell')}</Text>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}
Email.subject = (language: string) => translate('subject', dictionary, language)

const dictionary = {
  fr: {
    subject: 'Votre compte a été supprimé',
    title: 'Suppression de compte',
    greeting: 'Bonjour,',
    body: `Nous vous confirmons que votre compte ${config.appName} a été définitivement supprimé de nos serveurs.`,
    consequences: 'Toutes vos données personnelles, vos projets et vos accès ont été supprimés de manière permanente et ne pourront pas être récupérés.',
    'warning-title': 'Action irréversible',
    'warning-body': 'Cette suppression est définitive. Si vous souhaitez utiliser nos services à nouveau, vous devrez créer un nouveau compte.',
    farewell: `Nous vous remercions d'avoir utilisé ${config.appName}. Nous espérons vous revoir bientôt.`,
  },
  en: {
    subject: 'Your account has been deleted',
    title: 'Account Deletion',
    greeting: 'Hello,',
    body: `We confirm that your ${config.appName} account has been permanently deleted from our servers.`,
    consequences: 'All your personal data, projects, and access have been permanently deleted and cannot be recovered.',
    'warning-title': 'Irreversible action',
    'warning-body': 'This deletion is permanent. If you wish to use our services again, you will need to create a new account.',
    farewell: `Thank you for using ${config.appName}. We hope to see you again soon.`,
  },
  de: {
    subject: 'Ihr Konto wurde gelöscht',
    title: 'Kontolöschung',
    greeting: 'Hallo,',
    body: `Wir bestätigen, dass Ihr ${config.appName}-Konto dauerhaft von unseren Servern gelöscht wurde.`,
    consequences: 'Alle Ihre persönlichen Daten, Projekte und Zugänge wurden dauerhaft gelöscht und können nicht wiederhergestellt werden.',
    'warning-title': 'Unwiderrufliche Aktion',
    'warning-body': 'Diese Löschung ist endgültig. Wenn Sie unsere Dienste wieder nutzen möchten, müssen Sie ein neues Konto erstellen.',
    farewell: `Vielen Dank für die Nutzung von ${config.appName}. Wir hoffen, Sie bald wiederzusehen.`,
  },
}

export default Email
