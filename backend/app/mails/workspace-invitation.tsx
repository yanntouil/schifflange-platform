import User from '#models/user'
import Workspace from '#models/workspace'
import DashboardService from '#services/utils/dashboard'
import { placeholder } from '#utils/string'
import { G } from '@mobily/ts-belt'
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
  workspace: Workspace
  sender: User | null
  maybeUser: User | null
  token: string
}
const Email: EmailComponent<Props> = ({ language, email, workspace, sender, maybeUser, token }) => {
  const { _ } = getTranslation(dictionary, language)
  const isExistingUser = G.isNotNullable(maybeUser)
  const acceptLink = DashboardService.makeWorkspaceInvitationUrl(token, true)
  const rejectLink = DashboardService.makeWorkspaceInvitationUrl(token, false)
  const userName = placeholder(maybeUser?.profile.firstname, _('username-placeholder'))
  const senderName = placeholder(sender?.profile.firstname, _('senderPlaceholder'))
  const workspaceName = placeholder(workspace.name, _('workspace-name'))
  return (
    <Layout title={_('subject')} language={language}>
      <Header title={_('title')} language={language} />
      <Section>
        <Text className="text-gray-700 mb-4">
          {isExistingUser ? _('greeting-existing', { userName }) : _('greeting-new')}
        </Text>
        <Text className="text-gray-700 mb-2">
          {_('invitation-intro', { senderName, workspaceName })}
        </Text>
        <Text className="text-gray-700 mb-6">
          {isExistingUser ? _('body-existing') : _('body-new')}
        </Text>
        <ButtonPrimary href={acceptLink}>
          {isExistingUser ? _('cta-existing') : _('cta-new')}
        </ButtonPrimary>
        {isExistingUser && (
          <Section className="mt-4">
            <Text className="text-center">
              <Link
                href={rejectLink}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                {_('reject-invitation')}
              </Link>
            </Text>
          </Section>
        )}
      </Section>

      <Section className="bg-[#98C5D5]/30 border border-[#98C5D5] rounded-lg px-4 py-2 mt-5 mb-2">
        <Text className="text-[#3b606e] text-sm font-medium">ℹ️ {_('info-title')}</Text>
        <Text className="text-[#3b606e] text-xs">
          {isExistingUser ? _('info-existing') : _('info-new')}
        </Text>
      </Section>

      <Section>
        <Text className="text-sm text-gray-600 mb-4">{_('alternative')}</Text>
        <Text className="text-xs text-gray-500 break-all mb-6">
          <Link href={acceptLink} className="text-blue-800">
            {acceptLink}
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
    'subject': 'Vous êtes invité à rejoindre un workspace',
    'title': 'Invitation Workspace 🚀',
    'username-placeholder': 'Utilisateur',
    'senderPlaceholder': 'Un membre',
    'workspace-name': 'Workspace',
    'greeting-existing': 'Bonjour {{userName}} !',
    'greeting-new': 'Bonjour !',
    'invitation-intro':
      '{{senderName}} vous a invité à rejoindre l\'espace de travail "{{workspaceName}}".',
    'body-existing': `Vous avez déjà un compte sur ${config.appName}. Cliquez sur le bouton ci-dessous pour rejoindre cet espace de travail et commencer à collaborer.`,
    'cta-existing': 'Rejoindre le workspace',
    'reject-invitation': 'Décliner cette invitation',
    'body-new': `Pour rejoindre cet espace de travail, vous devez d'abord créer un compte sur ${config.appName}. Cliquez sur le bouton ci-dessous pour vous inscrire et rejoindre automatiquement le workspace.`,
    'cta-new': 'Créer un compte et rejoindre',
    'info-title': 'Information',
    'info-existing':
      "Vous pouvez accepter ou décliner cette invitation. Si vous l'acceptez, vous aurez accès à tous les projets et ressources partagés du workspace.",
    'info-new':
      'La création de compte est gratuite et rapide. Une fois inscrit, vous rejoindrez automatiquement ce workspace.',
    'alternative':
      'Si le bouton ci-dessus ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
  en: {
    'subject': 'You are invited to join a workspace',
    'title': 'Workspace Invitation 🚀',
    'username-placeholder': 'User',
    'senderPlaceholder': 'A member',
    'workspace-name': 'Workspace',
    'greeting-existing': 'Hello {{userName}}!',
    'greeting-new': 'Hello!',
    'invitation-intro': '{{senderName}} has invited you to join the workspace "{{workspaceName}}".',
    'body-existing': `You already have an account on ${config.appName}. Click the button below to join this workspace and start collaborating.`,
    'cta-existing': 'Join workspace',
    'reject-invitation': 'Decline this invitation',
    'body-new': `To join this workspace, you first need to create an account on ${config.appName}. Click the button below to sign up and automatically join the workspace.`,
    'cta-new': 'Create account and join',
    'info-title': 'Information',
    'info-existing':
      'You can accept or decline this invitation. If you accept, you will have access to all shared projects and resources in the workspace.',
    'info-new':
      'Account creation is free and quick. Once registered, you will automatically join this workspace.',
    'alternative': "If the button above doesn't work, copy and paste this link into your browser:",
  },
  de: {
    'subject': 'Sie sind eingeladen, einem Workspace beizutreten',
    'title': 'Workspace-Einladung 🚀',
    'username-placeholder': 'Benutzer',
    'senderPlaceholder': 'Ein Mitglied',
    'workspace-name': 'Workspace',
    'greeting-existing': 'Hallo {{userName}}!',
    'greeting-new': 'Hallo!',
    'invitation-intro':
      '{{senderName}} hat Sie eingeladen, dem Workspace "{{workspaceName}}" beizutreten.',
    'body-existing': `Sie haben bereits ein Konto bei ${config.appName}. Klicken Sie auf die Schaltfläche unten, um diesem Workspace beizutreten und mit der Zusammenarbeit zu beginnen.`,
    'cta-existing': 'Workspace beitreten',
    'reject-invitation': 'Diese Einladung ablehnen',
    'body-new': `Um diesem Workspace beizutreten, müssen Sie zuerst ein Konto bei ${config.appName} erstellen. Klicken Sie auf die Schaltfläche unten, um sich zu registrieren und automatisch dem Workspace beizutreten.`,
    'cta-new': 'Konto erstellen und beitreten',
    'info-title': 'Information',
    'info-existing':
      'Sie können diese Einladung annehmen oder ablehnen. Wenn Sie annehmen, haben Sie Zugriff auf alle geteilten Projekte und Ressourcen im Workspace.',
    'info-new':
      'Die Kontoerstellung ist kostenlos und schnell. Nach der Registrierung treten Sie automatisch diesem Workspace bei.',
    'alternative':
      'Falls die Schaltfläche oben nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
  },
}

export default Email
