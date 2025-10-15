import { Heading, Img, Section } from '@react-email/components'
import React from 'react'
import { config } from '../_utils/config.js'
import { getTranslation } from '../_utils/translation.js'

/**
 * display the header of the email with the logo and the title
 */
export type HeaderProps = {
  title: string
  language: string
}
export const Header = ({ title, language }: HeaderProps) => {
  const { _ } = getTranslation(dictionary, language)
  return (
    <>
      <Section className="mt-[32px]">
        <Img
          src={`${config.baseUrl}/assets/images/logo-square.png`}
          width="80"
          height="80"
          alt={_('logo')}
          className="mx-auto my-0"
        />
      </Section>
      <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
        {title}
      </Heading>
    </>
  )
}

const dictionary = {
  fr: {
    logo: `Logo de ${config.appName}`,
  },
  en: {
    logo: `Logo of ${config.appName}`,
  },
  de: {
    logo: `Logo von ${config.appName}`,
  },
}
