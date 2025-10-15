import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { prose } from '@compo/ui/src/variants'
import { S, stripHtml } from '@compo/utils'
import type { TemplateProps } from './index'

/**
 * Template 1
 * A simple template with a title, description.
 * @max todo
 */
export function Template1({ props }: TemplateProps) {
  const { title, level, subtitle, description } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  return (
    <Wrapper paddingY>
      <Container>
        <div className='flex flex-col justify-center gap-8'>
          {title && (
            <Hn level={level} className={textVariants({ variant: 'title', color: 'tuna' })}>
              {title}
            </Hn>
          )}
          {(hasDescription || subtitle) && (
            <div className='rounded-lg bg-[#E0E1DC] p-6'>
              {subtitle && (
                <Hn
                  level={+level + 1}
                  className='text-[#35374F] text-[24px] font-semibold leading-normal mb-3'
                >
                  {subtitle}
                </Hn>
              )}
              {hasDescription && (
                <div
                  className={prose({ variant: 'quote' })}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </div>
          )}
        </div>
      </Container>
    </Wrapper>
  )
}
