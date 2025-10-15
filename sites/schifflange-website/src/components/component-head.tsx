import { Hn } from '@/components/hn'
import { prose } from '@compo/ui/src/variants'
import { cx } from 'class-variance-authority'

/**
 * Component head
 */

export const ComponentHead = (props: {
  displayHeading: boolean
  level: number | string
  title: string
  subtitle: string
  description: string
  inline?: boolean
  children?: React.ReactNode
}) => {
  const { inline = false, children, displayHeading, ...contentProps } = props
  if (!displayHeading) return

  return (
    <div
      className={cx(
        inline
          ? 'flex flex-col gap-y-6 justify-center'
          : 'mb-7 grid grid-cols-1 gap-8 md:grid-cols-2'
      )}
    >
      <ComponentHeadContent {...contentProps} />

      <div className='empty:hidden'>{children}</div>
    </div>
  )
}

/**
 * ComponentHeadContent
 */

export const ComponentHeadContent = (props: {
  level: number | string
  title: string
  subtitle: string
  description: string
}) => {
  const { level, title, subtitle, description } = props

  return (
    <div className='my-trim'>
      <Hn level={level} className={cx('empty:hidden text-2xl font-semibold my-2')}>
        {title}
      </Hn>

      <p className={cx('empty:hidden text-lg font-medium my-2')}>{subtitle}</p>

      <div
        className={prose({ className: 'empty:hidden my-3' })}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
}
