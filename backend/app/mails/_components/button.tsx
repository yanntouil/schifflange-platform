import { Button, Section } from '@react-email/components'
import React from 'react'

/**
 * display the primary button
 */
export type ButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
}
export const ButtonPrimary = ({ href, children, className }: ButtonProps) => {
  return (
    <Section className={'text-center mt-2 mb-3 ' + className}>
      <Button
        href={href}
        className="bg-[#FFD167] text-[#1D1D1B] px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#FFD167]/80"
      >
        {children}
      </Button>
    </Section>
  )
}
