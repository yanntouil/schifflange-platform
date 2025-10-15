import { Button } from '@/components/button'
import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { MediaImage } from '@/components/image'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import { prose } from '@compo/ui/src/variants'
import { match } from '@compo/utils'
import type { TemplateProps } from './index'

/**
 * Template 2
 * A simple template with a title, description, and image.
 */
export function Template2({ props }: TemplateProps) {
  const { cards, contentLevel, ...head } = props

  return (
    <Wrapper paddingY>
      <Container>
        <ComponentHead {...head} />

        <ul className='grid grid-cols-1 gap-2 md:grid-cols-3 grid-rows-1 relative isolate items-stretch'>
          {cards.map((card, i) => {
            const themeClasses = match(i)
              .with(0, () => 'rotate-[-3deg] z-30 theme-moss')
              .with(1, () => 'rotate-[3deg] z-20 theme-golden')
              .with(2, () => 'rotate-[-3deg] z-10 theme-glacier')
              .otherwise(() => '')

            return (
              <li key={card.key} className={themeClasses}>
                <Card level={contentLevel} card={card} />
              </li>
            )
          })}
        </ul>
      </Container>
    </Wrapper>
  )
}

type CardProps = TemplateProps['props']['cards'][number]
const Card = (props: { level: string | number; card: CardProps }) => {
  const { level, card } = props
  const image = makeMediaImage(card.image, 'thumbnail')

  return (
    <div className='rounded-[16px] grid grid-rows-[70px_1fr_auto] h-full p-[24px] bg-(--theme-20) gap-[20px] shadow-[2px_2px_6px_0_rgba(53,55,79,0.04)]'>
      <MediaImage image={image} className='size-16 object-cover' />

      <div>
        <Hn
          level={+level}
          className={textVariants({
            variant: 'cardTitle',
          })}
        >
          {card.title}
        </Hn>

        <div className={prose({})} dangerouslySetInnerHTML={{ __html: card.description }} />
      </div>

      <div className='flex items-end justify-start'>
        {card.link && <Button link={card.link} scheme='variable' />}
      </div>
    </div>
  )
}
