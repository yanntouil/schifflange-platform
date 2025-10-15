import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { prose } from '@compo/ui/src/variants'
import { S, stripHtml } from '@compo/utils'
import Image from 'next/image'
import type { TemplateProps } from './index'

/**
 * Template 2
 * A simple template with a title, description, and image.
 * @max todo
 */
export function Template2({ props }: TemplateProps) {
  const { title, level, subtitle, description, image } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  return (
    <Wrapper paddingY>
      <Container>
        <div className='grid grid-cols-1 gap-[50px] md:grid-cols-2'>
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
          {image && (
            <div className='pt-12'>
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className='w-full'
              />
            </div>
          )}
        </div>
      </Container>
    </Wrapper>
  )
}
