import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { rebaseHeadings } from '@/utils/html'
import { S, stripHtml } from '@compo/utils'
import type { TemplateProps } from './index'
import { prose } from '@compo/ui/src/variants'

/**
 * Template 1
 * Simple layout - heading above, content below
 */
export function Template1({ props }: TemplateProps) {
  const { title, level, subtitle, description, displayHeading, content } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  const hasContent = S.isNotEmpty(S.trim(stripHtml(content)))

  // rebase content to h2, components likley to follow component header h1
  const rebasedContent = rebaseHeadings(content, 2)

  return (
    <Wrapper paddingY>
      <Container padding='default'>
        {displayHeading && (
          <div className='grid grid-cols-1 gap-8 pb-[24px]'>
            <div className='flex flex-col justify-center'>
              {title && (
                <Hn level={level} className={textVariants({ variant: 'title', color: 'tuna' })}>
                  {title}
                </Hn>
              )}
              {subtitle && (
                <p className={textVariants({ variant: 'subtitle', color: 'tuna' })}>{subtitle}</p>
              )}
              {hasDescription && (
                <div className={prose({})} dangerouslySetInnerHTML={{ __html: description }} />
              )}
            </div>
          </div>
        )}

        {hasContent && (
          <div
            className={prose({ visual: false, theme: 'finch' })}
            dangerouslySetInnerHTML={{ __html: rebasedContent }}
          />
        )}
      </Container>
    </Wrapper>
  )
}
