import { Body, Container, Head, Html } from '@react-email/components'
import { Tailwind, pixelBasedPreset } from '@react-email/tailwind'
import React from 'react'
/**
 * Layout component for emails
 */
type Props = {
  title: string
  language: string
  children: React.ComponentProps<typeof Body>['children']
}
export const Layout: React.FC<Props> = ({ title, language, children }) => {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              brand: '#007291',
            },
          },
        },
      }}
    >
      <Html lang={language}>
        <Head>
          <title>{title}</title>
        </Head>
        <Body className="mx-auto my-auto bg-white px-2 font-sans antialiased">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            {children}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
