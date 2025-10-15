import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { DecorationFinch2, DecorationGlacier2, DecorationMoss2 } from '@/components/svgs/decoration'
import { textVariants } from '@/components/variants'
import { Video } from '@/components/video'
import { Wrapper } from '@/components/wrapper'
import { prose } from '@compo/ui/src/variants'
import { S, stripHtml } from '@compo/utils'
import type { TemplateProps } from './index'

/**
 * Template Default
 * A simple template with a title, description, and video.
 * @max todo
 */
export function TemplateDefault({ props }: TemplateProps) {
  const { title, level, subtitle, description, video } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  return (
    <Wrapper paddingY>
      <Container>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='flex flex-col justify-start'>
            {title && (
              <Hn level={level} className={textVariants({ variant: 'title', color: 'tuna' })}>
                {title}
              </Hn>
            )}
            {subtitle && (
              <p className={textVariants({ variant: 'subtitle', color: 'tuna' })}>{subtitle}</p>
            )}
            {hasDescription && (
              <div
                className={prose({ variant: 'heading' })}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
          <div>
            {video && <Video url={video} controls={false} className='rounded-t-[8px]' />}
            <div className='flex'>
              <DecorationFinch2 className='w-1/3 aspect-square' aria-hidden />
              <DecorationMoss2 className='w-1/3 aspect-square' aria-hidden />
              <DecorationGlacier2 className='w-1/3 aspect-square' aria-hidden />
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  )
}
