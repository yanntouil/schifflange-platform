"use client"

import { Carousel, useCarousel } from "@/components/carousel"
import { Container } from "@/components/container"
import { Hn } from "@/components/hn"
import { Lightbox } from "@/components/lightbox"
import { Button, buttonVariants } from "@/components/ui/button"
import { Wrapper } from "@/components/wrapper"
import { useTranslation } from "@/lib/localize"
import { cn } from "@/lib/utils"
import { A, match } from "@compo/utils"
import { Expand } from "lucide-react"
import Image from "next/image"
import type { TemplateProps } from "./index"
/**
 * Template 1
 * A simple template with a title, description, and image.
 */
export function Template1({ props }: TemplateProps) {
  const { _ } = useTranslation(dictionary)

  const { title, level, subtitle, description, displayHeading, slides } = props

  return (
    <Lightbox.Root>
      <Wrapper paddingY>
        <Container>
          <div className='py-6'>
            <Hn level={level} className='text-[#35374F] text-[24px] font-semibold leading-normal mb-3'>
              {title}
            </Hn>
            <Carousel.Root className={cn("space-y-4")}>
              <Carousel.Content className='-ml-2' overflow='visible'>
                {A.map(slides, (slide) => (
                  <Carousel.Item className='group/image relative grid basis-auto pl-3' key={slide.id}>
                    <Lightbox.Trigger
                      data={slide}
                      className={cn(
                        buttonVariants({ scheme: "secondary", variant: "icon" }),
                        "absolute right-2 top-2 group-focus-within/image:opacity-100 group-hover/image:opacity-100 sm:opacity-0 size-8 [&>svg]:size-4 transition-all"
                      )}
                    >
                      <Expand aria-hidden />
                      <span className='sr-only'>{_("lightbox-trigger", { name: slide?.alt ?? slide.id })}</span>
                    </Lightbox.Trigger>
                    {match(slide)
                      .with({ type: "image" }, (slide) => (
                        <Image
                          src={slide.previewUrl}
                          alt={slide.alt}
                          width={slide.width}
                          height={slide.height}
                          className='h-[204px] w-auto rounded-[16px]'
                        />
                      ))
                      .otherwise(() => null)}
                  </Carousel.Item>
                ))}
              </Carousel.Content>
              <Control />
            </Carousel.Root>
          </div>
        </Container>
      </Wrapper>
    </Lightbox.Root>
  )
}

/**
 * Control
 * A control component for the carousel.
 */
const Control: React.FC = () => {
  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel()
  if (!canScrollNext && !canScrollPrev) return null
  return (
    <div className='flex items-center justify-end gap-2' onClick={(e) => e.stopPropagation()}>
      <Button
        scheme={canScrollPrev ? "default" : "secondary"}
        variant='icon'
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowLeftSvg aria-hidden className='size-5' />
      </Button>
      <Button
        scheme={canScrollNext ? "default" : "secondary"}
        variant='icon'
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <ArrowRightSvg aria-hidden className='size-5' />
      </Button>
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
    "lightbox-trigger": "Ouvrir dans la lightbox",
  },
  en: {
    "lightbox-trigger": "Open in lightbox",
  },
  de: {
    "lightbox-trigger": "In Lightbox öffnen",
  },
}
