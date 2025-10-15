import Workspace from '#models/workspace'
import DashboardService from '#services/utils/dashboard'
import { placeholder } from '#utils/string'
import { Section, Text } from '@react-email/components'
import React from 'react'
import { ButtonPrimary } from './_components/button.js'
import { Footer } from './_components/footer.js'
import { Header } from './_components/header.js'
import { Layout } from './_components/layout.js'
import { config } from './_utils/config.js'
import { getTranslation, translate } from './_utils/translation.js'
import { DefaultProps, EmailComponent } from './_utils/types.js'

type Props = DefaultProps & {
  workspace: Workspace
  token: string
}
const Email: EmailComponent<Props> = ({ language, email, workspace, token }) => {
  const { _ } = getTranslation(dictionary, language)
  const workspaceName = placeholder(workspace.name, _('workspace-name'))
  const authenticationUrl = DashboardService.makeAuthenticationUrl(token)
  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">{_('greeting')}</Text>
        <Text className="text-gray-700 mb-6">{_('body', { workspaceName })}</Text>
        <Text className="text-gray-700 mb-6">{_('next-steps')}</Text>
      </Section>
      <ButtonPrimary href={authenticationUrl}>{_('cta')}</ButtonPrimary>
      <Section className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-green-700 text-sm font-medium">🎉 {_('success-title')}</Text>
        <Text className="text-green-600 text-xs">{_('success-body')}</Text>
      </Section>
      <Footer language={language} email={email} />
    </Layout>
  )
}

Email.subject = (language: string) => translate('subject', dictionary, language)

const dictionary = {
  fr: {
    'subject': 'Inscription réussie ! Bienvenue dans le workspace',
    'title': 'Inscription confirmée 🎉',
    'workspace-name': 'Workspace',
    'greeting': 'Félicitations !',
    'body':
      'Votre compte a été créé avec succès et vous avez automatiquement rejoint l\'espace de travail "{{workspaceName}}". Vous faites maintenant partie de l\'équipe !',
    'next-steps': `Vous pouvez dès maintenant vous connecter à ${config.appName} pour commencer à collaborer avec votre équipe et explorer tous les projets disponibles.`,
    'cta': 'Se connecter maintenant',
    'success-title': 'Vous êtes prêt !',
    'success-body':
      'Votre espace de travail vous attend. Commencez à collaborer, partager et créer avec votre équipe.',
  },
  en: {
    'subject': 'Registration successful! Welcome to the workspace',
    'title': 'Registration confirmed 🎉',
    'workspace-name': 'Workspace',
    'greeting': 'Congratulations!',
    'body':
      'Your account has been successfully created and you have automatically joined the workspace "{{workspaceName}}". You are now part of the team!',
    'next-steps': `You can now log in to ${config.appName} to start collaborating with your team and explore all available projects.`,
    'cta': 'Sign in now',
    'success-title': "You're ready!",
    'success-body':
      'Your workspace is waiting for you. Start collaborating, sharing, and creating with your team.',
  },
  de: {
    'subject': 'Registrierung erfolgreich! Willkommen im Workspace',
    'title': 'Registrierung bestätigt 🎉',
    'workspace-name': 'Workspace',
    'greeting': 'Herzlichen Glückwunsch!',
    'body':
      'Ihr Konto wurde erfolgreich erstellt und Sie sind automatisch dem Workspace "{{workspaceName}}" beigetreten. Sie sind jetzt Teil des Teams!',
    'next-steps': `Sie können sich jetzt bei ${config.appName} anmelden, um mit Ihrem Team zusammenzuarbeiten und alle verfügbaren Projekte zu erkunden.`,
    'cta': 'Jetzt anmelden',
    'success-title': 'Sie sind bereit!',
    'success-body':
      'Ihr Workspace wartet auf Sie. Beginnen Sie mit der Zusammenarbeit, dem Teilen und Erstellen mit Ihrem Team.',
  },
}

export default Email
