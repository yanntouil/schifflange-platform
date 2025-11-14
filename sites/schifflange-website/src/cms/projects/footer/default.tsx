"use client"

import { Carousel, useCarousel } from "@/components/carousel"
import { Container } from "@/components/layout/container"
import { Wrapper, WrapperConcealer } from "@/components/layout/wrapper"
import { Hn } from "@/components/ui/hn/components"
import { textVariants } from "@/components/variants"
import { useTranslation } from "@/lib/localize"
import { cn } from "@/lib/utils"
import { service } from "@/service"
import { prose } from "@compo/ui/src/variants"
import { S, stripHtml } from "@compo/utils"
import Image from "next/image"
import type { TemplateProps } from "./index"

/**
 * TemplateDefault
 * A simple template with a title, description, and image.
 */
export function TemplateDefault({ props }: TemplateProps) {
  const { _ } = useTranslation(dictionary)
  const { title, level, subtitle, description, displayHeading, cardLevel } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  const cards: CardProps[] = [
    {
      id: "card-1",
      level: cardLevel,
      title: _("card-1.title"),
      description: _("card-1.description"),
      image: {
        src: service.makePath(
          "storage/workspaces/b825d97c-82d2-4989-8104-1b271b05e7cd/files/brapwqc03h4doql6043fsiy5.jpg",
          true
        ),
        alt: _("card-1.title"),
        width: 304,
        height: 178,
      },
      shape: <Shape1Svg className='absolute inset-0 size-full' />,
    },
    {
      id: "card-2",
      level: cardLevel,
      title: _("card-2.title"),
      description: _("card-2.description"),
      image: {
        src: service.makePath(
          "storage/workspaces/b825d97c-82d2-4989-8104-1b271b05e7cd/files/q5ozfit23r1pygbmuyo93nq9.jpg",
          true
        ),
        alt: _("card-2.title"),
        width: 304,
        height: 178,
      },
      shape: <Shape2Svg className='absolute inset-0 size-full' />,
    },
    {
      id: "card-3",
      level: cardLevel,
      title: _("card-3.title"),
      description: _("card-3.description"),
      image: {
        src: service.makePath(
          "storage/workspaces/b825d97c-82d2-4989-8104-1b271b05e7cd/files/k59qaz9td2x3jmvokh2rtcm0.jpg",
          true
        ),
        alt: _("card-3.title"),
        width: 304,
        height: 178,
      },
      shape: <Shape3Svg className='absolute inset-0 size-full' />,
    },
    {
      id: "card-4",
      level: cardLevel,
      title: _("card-4.title"),
      description: _("card-4.description"),
      image: {
        src: service.makePath(
          "storage/workspaces/b825d97c-82d2-4989-8104-1b271b05e7cd/files/k59qaz9td2x3jmvokh2rtcm0.jpg",
          true
        ),
        alt: _("card-4.title"),
        width: 304,
        height: 178,
      },
      shape: <Shape1Svg className='absolute inset-0 size-full' />,
    },
  ]
  return (
    <WrapperConcealer style={{ "--concealer-color": "var(--color-golden-20)" } as React.CSSProperties}>
      <Wrapper paddingY className='bg-golden-20'>
        <Container>
          <Carousel.Root>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 pb-[40px]'>
              <div className='flex flex-col justify-center'>
                {displayHeading && (
                  <>
                    {title && (
                      <Hn level={level} className={cn(textVariants({ variant: "title", color: "tuna" }))}>
                        <span className='block text-finch-100'>{title}</span>
                        {subtitle && <span className='block'>{subtitle}</span>}
                      </Hn>
                    )}
                    {hasDescription && (
                      <div
                        className={prose({ variant: "heading" })}
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                  </>
                )}
              </div>
              <div className='flex justify-end'>
                <Control />
              </div>
            </div>

            <Carousel.Content className='-ml-[40px]' overflow='visible'>
              {cards.map((card) => (
                <Carousel.Item key={card.id} className='basis-auto pl-[40px] w-[304px]'>
                  <Card {...card} />
                </Carousel.Item>
              ))}
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
type CardProps = {
  id: string
  level: string | number
  title: string
  description: string
  image: { src: string; alt: string; width: number; height: number } | null
  shape: React.ReactNode
}
const Card: React.FC<CardProps> = ({ level, title, description, image, shape }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <article>
      {/* Image container */}
      <div className='relative'>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            className='aspect-square w-full object-cover object-center rounded-[16px]'
            width={image.width}
            height={image.height}
          />
        ) : (
          <div className='aspect-[304/178] bg-pampas flex items-center justify-center rounded-[16px]' aria-hidden>
            <div className='text-tuna/30 text-sm'>{_("image-placeholder")}</div>
          </div>
        )}
        {shape}
      </div>

      {/* Content */}
      <div className='mt-6 space-y-2'>
        {/* Title */}
        <Hn level={level} className='text-tuna text-[18px] font-semibold leading-normal'>
          {title}
        </Hn>

        {/* Description */}
        {description && (
          <div
            className={prose({ variant: "card", color: "tuna", className: "-my-2" })}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </article>
  )
}

/**
 * shapes
 */
const Shape1Svg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 304 304' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M288 0C296.837 0 304 7.16344 304 16V288C304 296.837 296.837 304 288 304H16C7.16344 304 6.44299e-08 296.837 0 288V16C0 7.16344 7.16344 6.44257e-08 16 0H288ZM260 8C240.118 8.00001 224 24.1156 224 44C224 24.1156 207.882 8 188 8C168.118 8 152 24.1156 152 44C152 24.1156 135.882 8 116 8C96.118 8 80 24.1156 80 44C80 24.1156 63.882 8 44 8C24.118 8 8 24.1156 8 44C8 63.8844 24.118 80 44 80C24.118 80 8 96.1156 8 116C8 135.884 24.118 152 44 152C24.118 152 8 168.116 8 188C8 207.884 24.118 224 44 224C24.118 224 8.00001 240.116 8 260C8 279.884 24.118 296 44 296C63.882 296 80 279.884 80 260C80 279.884 96.118 296 116 296C135.882 296 152 279.884 152 260C152 279.884 168.118 296 188 296C207.882 296 224 279.884 224 260C224 279.884 240.118 296 260 296C279.882 296 296 279.884 296 260C296 240.116 279.882 224 260 224C279.882 224 296 207.884 296 188C296 168.116 279.882 152 260 152C279.882 152 296 135.884 296 116C296 96.1156 279.882 80 260 80C279.882 80 296 63.8844 296 44C296 24.1156 279.882 8 260 8Z'
      fill='#ADD1DD'
    />
  </svg>
)

const Shape2Svg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 304 304' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M288 0C296.837 0 304 7.16344 304 16V288C304 296.837 296.837 304 288 304H16C7.16344 304 6.44299e-08 296.837 0 288V16C0 7.16344 7.16344 6.44257e-08 16 0H288ZM56.0332 200.014C29.5393 200.014 8.04492 221.488 8.04492 248.007C8.04498 274.503 29.5163 296 56.0332 296H248.011C274.505 296 296 274.526 296 248.007C296 221.511 274.528 200.014 248.011 200.014H56.0332ZM55.9883 8C29.485 8.00004 8.00025 29.4868 8 55.9922V56.0156C8 82.5213 29.4849 104.009 55.9883 104.009H56.0332C29.5394 104.009 8.0451 125.482 8.04492 152.001C8.04492 178.497 29.5162 199.994 56.0332 199.994H248.011C274.505 199.994 296 178.52 296 152.001C296 125.505 274.528 104.009 248.011 104.009H247.989C274.493 104.009 295.979 82.5213 295.979 56.0156V55.9922C295.978 29.4867 274.493 8 247.989 8H55.9883Z'
      fill='#ADD1DD'
    />
  </svg>
)

const Shape3Svg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 304 304' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M288 0C296.837 0 304 7.16344 304 16V288C304 296.837 296.837 304 288 304H16C7.16344 304 6.44299e-08 296.837 0 288V16C0 7.16344 7.16344 6.44257e-08 16 0H288ZM80 8C40.2354 8 8.00002 40.2355 8 80C8 119.765 40.2354 152 80 152C40.2354 152 8.00005 184.236 8 224C8 263.764 40.2354 296 80 296H288.009C292.427 296 296 292.428 296 288.01V15.998C296 11.58 292.425 8.00004 288.007 8H80Z'
      fill='#ADD1DD'
    />
  </svg>
)

/**
 * Control
 * A control component for the carousel.
 */
const Control: React.FC = () => {
  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel()
  if (!canScrollNext && !canScrollPrev) return null
  return (
    <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
      <button
        type='button'
        className='size-[47px] rounded-[8px] disabled:bg-white bg-[#98C5D5] flex items-center justify-center'
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowLeftSvg aria-hidden className='size-5' />
      </button>
      <button
        type='button'
        className='size-[47px] rounded-[8px] disabled:bg-white bg-[#98C5D5] flex items-center justify-center'
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <ArrowRightSvg aria-hidden className='size-5' />
      </button>
    </div>
  )
}
/**
 * icons
 */
const ArrowLeftSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M10.5 16.3334L4.66669 10.5001M4.66669 10.5001L10.5 4.66675M4.66669 10.5001H16.3334'
        stroke='#35374F'
        strokeWidth='1.25'
        strokeLinecap='square'
        strokeLinejoin='round'
      />
    </svg>
  )
}
const ArrowRightSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M4.66669 10.5001H16.3334M16.3334 10.5001L10.5 4.66675M16.3334 10.5001L10.5 16.3334'
        stroke='#1D1D1B'
        strokeWidth='1.25'
        strokeLinecap='square'
        strokeLinejoin='round'
      />
    </svg>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "image-placeholder": "Image à venir",
    "card-1": {
      title: "Ressources humaines",
      description: `<p>Bénéficier de décharge et créer des conditions idéales pour la réflexion, l'innovation et la concrétisation de vos idées en projets concrets.</p>`,
    },
    "card-2": {
      title: "Ressources intellectuelles et méthodologiques",
      description: `<p>Profiter de formations spécifiques et innovantes, d'un suivi pédagogique individualisé et d'évaluations continues visant à assurer la progression continue de votre projet.</p>`,
    },
    "card-3": {
      title: "Ressources matérielles",
      description: `<p>Disposer d’espaces dédiés et adaptés à vos rencontres et réunions pour faciliter la collaboration, les échanges et la créativité.</p>`,
    },
    "card-4": {
      title: "Ressources financières",
      description: `<p>Bénéficier de financements potentiels pour acquérir les supports pédagogiques innovants nécessaires au développement de votre projet.</p>`,
    },
  },
  en: {
    "image-placeholder": "Image coming soon",
    "card-1": {
      title: "Human resources",
      description: `<p>Benefit from discharge and create ideal conditions for reflection, innovation and concretization of your ideas into concrete projects.</p>`,
    },
    "card-2": {
      title: "Intellectual and methodological resources",
      description: `<p>Benefit from specific and innovative training, personalized pedagogical follow-up and continuous evaluations aimed at ensuring continuous progress of your project.</p>`,
    },
    "card-3": {
      title: "Relational and social resources",
      description: `<p>Access a dynamic network fostering idea exchanges, experience sharing and the creation of strong ties.</p>`,
    },
  },
  de: {
    "image-placeholder": "Bild folgt",
    "card-1": {
      title: "Personelle Ressourcen",
      description: `<p>Profitieren Sie von Entlastung und schaffen Sie ideale Bedingungen für Reflexion, Innovation und die Umsetzung Ihrer Ideen in konkrete Projekte.</p>`,
    },
    "card-2": {
      title: "Intellektuelle und methodische Ressourcen",
      description: `<p>Nutzen Sie spezifische und innovative Schulungen, individuelle pädagogische Betreuung und kontinuierliche Evaluierungen, um den Fortschritt Ihres Projekts sicherzustellen.</p>`,
    },
    "card-3": {
      title: "Beziehungs- und Sozialressourcen",
      description: `<p>Zugang zu einem dynamischen Netzwerk, das den Ideenaustausch, den Erfahrungsaustausch und die Schaffung starker Verbindungen fördert.</p>`,
    },
  },
}
