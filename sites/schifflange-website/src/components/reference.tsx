import { MadeLinkProps } from '@/utils/links'
import Link from 'next/link'

/**
 * Reference
 */

export const Reference = (props: React.ComponentProps<'a'> & { link?: MadeLinkProps | null }) => {
  const { link, ...elementProps } = props
  if (!link || !link.href) return props.children

  const child = props.children ? props.children : link.text

  if (link.isLink) {
    return (
      <Link {...elementProps} aria-label={link.text} href={link.href}>
        {child}
      </Link>
    )
  }

  return (
    <a
      {...elementProps}
      href={link.href}
      aria-label={link.text}
      target='_blank'
      rel='noopener noreferrer nofollow'
    >
      {child}
    </a>
  )
}
