import { Hr, Section, Text } from '@react-email/components'
import React from 'react'
import { config } from '../_utils/config.js'
import { getTranslation } from '../_utils/translation.js'

/**
 * display the footer of the email with the support email and the logo
 */
export type FooterProps = {
  language: string
  email: string
}
export const Footer = ({ language }: FooterProps) => {
  const { _ } = getTranslation(dictionary, language)
  return (
    <>
      <Hr className="border-gray-200 mt-3" />
      <Section>
        <Text className="text-xs text-gray-500">{_('security')}</Text>
        <Text className="text-xs text-gray-500">
          {_('support', { support: config.supportEmail })}
        </Text>
      </Section>
    </>
  )
}

const dictionary = {
  fr: {
    security: `Si vous n'avez pas de compte sur ${config.appName}, vous pouvez ignorer cet e-mail en toute sécurité.`,
    support:
      "Besoin d'aide ? Contactez notre équipe de support {{support}}, nous serons ravis de vous assister.",
  },
  en: {
    security: `If you didn't create an account on ${config.appName}, you can safely ignore this email.`,
    support: "Need help? Contact our support team {{support}}, we'll be happy to assist you.",
  },
  de: {
    security: `Wenn Sie kein Konto auf ${config.appName} erstellt haben, können Sie diese E-Mail bedenkenlos ignorieren.`,
    support:
      'Brauchen Sie Hilfe? Kontaktieren Sie unser Support-Team {{support}}, wir helfen Ihnen gerne weiter.',
  },
}
