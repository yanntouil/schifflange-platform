import React from 'react'

/**
 * AutoGrid
 */

export const AutoGrid: React.FC<
  React.ComponentProps<'ul'> & {
    children: React.ReactNode
    min?: number
    shrink?: boolean
  }
> = props => {
  const { children, min = 200, shrink = true, ...ulProps } = props
  const minValue = shrink ? `min(${min}px,100%)` : `${min}px`

  return (
    <ul
      {...ulProps}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minValue}, 1fr))`,
        ...ulProps.style,
      }}
    >
      {children}
    </ul>
  )
}
