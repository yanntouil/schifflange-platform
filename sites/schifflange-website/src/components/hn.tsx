import { A } from '@compo/utils'
import React from 'react'

/**
 * Hn
 */
export type HnProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: string | number | 'p'
  debug?: boolean
}
export const Hn = ({ level = 1, ...props }: HnProps) => {
  const l = A.includes([1, 2, 3, 4, 5, 6, '1', '2', '3', '4', '5', '6'], level) ? level : 1
  const As = level === 'p' ? 'p' : (`h${l}` as React.ElementType)
  return <As {...props} />
}
