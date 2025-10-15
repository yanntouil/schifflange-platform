import { ComponentHead, ComponentHeadContent } from '@/components/component-head'
import { Container } from '@/components/container'
import { DecorationFinch, DecorationGlacier, DecorationMoss } from '@/components/svgs/decoration'
import { Wrapper } from '@/components/wrapper'
import Image from 'next/image'
import type { TemplateProps } from './index'
import { MediaImage } from '@/components/image'

/**
 * Template 1
 * A simple template with a title, description, and image.
 * @max todo
 */

export function Template1({ props }: TemplateProps) {
  const { image, ...head } = props
  return (
    <Wrapper paddingY>
      <Container>
        <div className='grid grid-cols-1 gap-x-11 @4xl/wrapper:grid-cols-2'>
          <ComponentHeadContent {...head} />

          {image && (
            <div className='flex items-center justify-center min-h-[502px]'>
              <div className='relative size-[310px]'>
                <DecorationFinch
                  className='absolute -top-[106px] -left-[96px] size-[310px]'
                  aria-hidden
                />
                <DecorationMoss
                  className='absolute -top-[53px] -right-[50px] size-[310px]'
                  aria-hidden
                />
                <DecorationGlacier
                  className='absolute -bottom-[84px] -left-[39px] size-[310px]'
                  aria-hidden
                />
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className='relative size-[310px] object-cover'
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </Wrapper>
  )
}

export const Decoration = () => {
  return (
    <div className='flex items-center justify-center min-h-[502px]'>
      <div className='relative size-[310px]'>
        <DecorationFinch className='absolute -top-[106px] -left-[96px] size-[310px]' aria-hidden />
        <DecorationMoss className='absolute -top-[53px] -right-[50px] size-[310px]' aria-hidden />
        <DecorationGlacier
          className='absolute -bottom-[84px] -left-[39px] size-[310px]'
          aria-hidden
        />

        <MediaImage />
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className='relative size-[310px] object-cover'
        />
      </div>
    </div>
  )
}
