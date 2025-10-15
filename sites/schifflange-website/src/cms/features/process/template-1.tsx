'use client'

import PatternCircles from '@/assets/pattern-circles.svg'
import PatternStar from '@/assets/pattern-star.svg'
import PatternWaves from '@/assets/pattern-waves.svg'
import { Carousel } from '@/components/carousel'
import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { ArrowRightSvg } from '@/components/icons'
import { MediaImage } from '@/components/image'
import { Link } from '@/components/link'
import { Wrapper, WrapperConcealer } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import { makeLinkProps } from '@/utils/links'
import { cn, match } from '@compo/utils'
import { cx } from 'class-variance-authority'
import type { TemplateProps } from './index'

/**
 * Template 1
 * A simple template with a title, description, and image.
 */

export function Template1({ props }: TemplateProps) {
  const { cards, contentLevel, ...head } = props

  return (
    <WrapperConcealer style={{ '--concealer-color': 'var(--color-pampas)' } as React.CSSProperties}>
      <Wrapper paddingY>
        <Container>
          <ComponentHead {...head} />

          <Carousel.Root>
            <Carousel.Content className='select-none -mr-5' overflow='visible'>
              {cards.map(card => {
                return (
                  <Carousel.Item
                    key={card.key}
                    className={cx(
                      'basis-auto w-[33%] min-w-[330px] lg:min-w-[280px] pr-5',
                      match(card.key)
                        .with('consultation', () => 'theme-finch')
                        .with('incubation', () => 'theme-moss')
                        .with('scaling', () => 'theme-glacier')
                        .otherwise(() => '')
                    )}
                  >
                    <Card card={card} level={contentLevel} />
                  </Carousel.Item>
                )
              })}
            </Carousel.Content>
          </Carousel.Root>
        </Container>
      </Wrapper>
    </WrapperConcealer>
  )
}

/**
 * Card
 */

type CardProps = TemplateProps['props']['cards'][number]
const Card = (props: { card: CardProps; level: number }) => {
  const { card, level } = props

  return (
    <div className='h-[420px] flex-1 relative'>
      {card.image && (
        <div className='absolute inset-0 size-full rounded-[16px] overflow-hidden'>
          <MediaImage
            image={makeMediaImage(card.image, 'preview')}
            className='size-full object-cover '
          />

          {match(card.key)
            .with('consultation', () => <PatternCircles className='absolute inset-0 size-full' />)
            .with('incubation', () => <PatternWaves className='absolute inset-0 size-full' />)
            .with('scaling', () => <PatternStar className='absolute inset-0 size-full' />)
            .otherwise(() => null)}
        </div>
      )}

      <div className='size-full -pt-[250px] -pr-[2%] -pl-[15%] rounded-b-xl flex flex-col justify-end'>
        <div className='relative'>
          <div className='hidden lg:block'>
            {card.key === 'consultation' && (
              <svg
                viewBox='0 0 141 36'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='absolute top-[35px] left-[100%] translate-x-[calc(-50%+15px)] xl:translate-x-[calc(-50%+6px)] z-20 w-[110px] xl:w-[130px]'
              >
                <path
                  d='M129.233 2.76173C130.226 2.23197 131.438 2.55563 132.049 3.4668L132.164 3.65671L132.165 3.65878L136.545 11.9171C137.061 12.8894 137.626 13.9466 138.069 15.0885L138.068 15.0883C138.229 15.4965 138.373 15.9061 138.508 16.3081L138.763 17.0303C139.012 17.7131 139.256 18.2759 139.594 18.7162L139.593 18.716C139.778 18.9558 139.903 19.2213 139.974 19.4956C140.039 19.6394 140.091 19.792 140.124 19.9534C140.365 21.1273 139.604 22.2726 138.429 22.5048L138.43 22.5059C134.297 23.3388 130.24 24.6065 126.364 26.2764L126.365 26.2775C125.245 26.7625 124.301 27.2329 123.775 27.8949C123.276 28.5275 122.503 28.8036 121.761 28.6956L121.761 28.6966L121.753 28.6954L121.753 28.6945C121.4 28.6407 121.046 28.5029 120.737 28.2556L120.737 28.2547C119.858 27.5582 119.666 26.3241 120.246 25.4002L120.375 25.216C121.572 23.6952 123.285 22.892 124.646 22.3011L124.647 22.3002C127.267 21.1683 129.968 20.2105 132.718 19.4341C113.401 8.41071 90.808 3.51721 68.6423 5.61676L68.6431 5.61787C45.0866 7.85601 22.5482 17.9354 5.18903 34.0154L5.1843 34.0206C4.68474 34.4749 4.02488 34.6623 3.39841 34.569L3.39165 34.568C2.9252 34.4985 2.47295 34.2786 2.1222 33.897C1.31186 33.0212 1.36169 31.651 2.23929 30.8388C20.2961 14.1165 43.7254 3.63478 68.2261 1.30717C90.6131 -0.819552 113.412 3.92365 133.107 14.6926C132.979 14.4463 132.848 14.1983 132.717 13.9492L132.717 13.9482L128.338 5.69307L128.242 5.49127C127.825 4.47204 128.244 3.28911 129.233 2.76173Z'
                  fill='var(--color-golden-100)'
                  stroke='var(--color-golden-100)'
                  strokeWidth='1.5'
                />
              </svg>
            )}
            {card.key === 'incubation' && (
              <svg
                viewBox='0 0 143 30'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='absolute top-[85px] left-[100%] translate-x-[calc(-50%+15px)] xl:translate-x-[calc(-50%+6px)] z-20 w-[110px] xl:w-[130px]'
              >
                <path
                  d='M131.629 25.5232C132.601 25.9955 133.751 25.6423 134.304 24.7469L134.407 24.5606L134.408 24.5585L138.222 16.6647C138.671 15.7369 139.163 14.7249 139.538 13.6377L139.735 13.0493C139.796 12.8564 139.853 12.6641 139.909 12.4741C140.204 11.5083 140.438 10.7524 140.833 10.1941C141.002 9.95807 141.113 9.69913 141.172 9.43413C141.227 9.29547 141.271 9.1492 141.297 8.99528C141.486 7.86111 140.714 6.79031 139.579 6.61004L139.58 6.6089C135.681 5.97446 131.838 4.92924 128.15 3.50199L128.149 3.50313C127.083 3.08842 126.195 2.68491 125.687 2.09526L125.688 2.09412C125.187 1.50339 124.434 1.26578 123.725 1.39625L123.725 1.39529L123.719 1.39655L123.719 1.39751C123.384 1.46144 123.051 1.60616 122.763 1.85313L122.763 1.85217C121.888 2.5976 121.786 3.90496 122.519 4.77839L122.523 4.78169C123.706 6.17439 125.35 6.87032 126.646 7.3761L126.647 7.37688C129.11 8.33267 131.64 9.12715 134.209 9.75429C116.523 20.7206 95.5709 26.0779 74.7717 24.8943C63.6761 24.2596 50.4122 22.0492 37.818 18.1857C25.2145 14.3193 13.3401 8.81573 4.97401 1.63107L4.96909 1.62604C4.4741 1.20877 3.83436 1.05207 3.23698 1.16419L3.23122 1.16527C2.78671 1.2487 2.3608 1.47655 2.03821 1.85519C1.29302 2.724 1.39005 4.0364 2.26088 4.78331L3.09624 5.486C11.838 12.6995 23.8126 18.1998 36.3778 22.0797C49.3571 26.0874 63.0244 28.3838 74.5277 29.0417C95.54 30.2433 116.695 25.0211 134.752 14.2836C134.662 14.4728 134.571 14.6633 134.479 14.8546L134.479 14.8555L130.666 22.7461L130.582 22.9426C130.218 23.9348 130.662 25.0532 131.629 25.5232Z'
                  fill='var(--color-golden-100)'
                  stroke='var(--color-golden-100)'
                  strokeWidth='1.5'
                />
              </svg>
            )}
          </div>

          <div className='relative isolate overflow-hidden rounded-b-xl pt-14 text-(--theme-readable) '>
            {/* Background */}
            <div
              className='absolute inset-0 left-[30px] top-[20px] w-full h-[120%] rounded-t-[12px] -rotate-[5deg] -z-10 bg-(--theme-100)'
              aria-hidden
            />

            <div className='z-10 pb-18 pl-14 pr-6 my-trim'>
              <Hn level={level} className='text-xl/[1.4] font-semibold my-2'>
                {card.title}
              </Hn>

              <div
                dangerouslySetInnerHTML={{ __html: card.description }}
                className='text-xs/[1.5] line-clamp-4 min-h-[84px]'
              ></div>
            </div>
          </div>
        </div>
      </div>

      {card.link && <OpenButton link={card.link} />}
    </div>
  )
}

/**
 * Button
 */

export type ButtonProps = {
  link: ReturnType<typeof makeLinkProps>
}

export const OpenButton: React.FC<ButtonProps> = ({ link }) => {
  if (!link?.href) return null
  const cx = cn(
    'absolute bottom-2 right-2 flex items-center justify-center gap-2 bg-white rounded-[8px] size-[47px]'
  )
  if (link.isLink)
    return (
      <Link href={link.href} className={cx}>
        <ArrowRightSvg aria-hidden className='size-5' />
        <span className='sr-only'>{link.text}</span>
      </Link>
    )
  return (
    <a href={link.href} target='_blank' rel='noopener noreferrer nofollow' className={cx}>
      <ArrowRightSvg aria-hidden className='size-5' />
      <span className='sr-only'>{link.text}</span>
    </a>
  )
}
