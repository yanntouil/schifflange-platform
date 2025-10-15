import { Container } from "@/components/container"
import { Link } from "@/components/link"
import { Wrapper } from "@/components/wrapper"
import type { TemplateProps } from "./index"

/**
 * Template Default
 * Simple layout - breadcrumbs above, content below
 */
export function TemplateDefault({ props }: TemplateProps) {
  const { previous, next } = props
  const linkCx = "[&>svg]:size-5 [&>svg]:shrink-0 text-sm text-powder inline-flex items-center gap-2"
  return (
    <Wrapper className='py-12'>
      <Container>
        <div className='grid gap-8 grid-cols-2 bg-[#F3EADE] p-[22px] rounded-[16px]'>
          <div className='flex justify-start'>
            {!!previous?.href && (
              <>
                {previous.isLink ? (
                  <Link href={previous.href} className={linkCx}>
                    <ArrowLeftSvg aria-hidden /> {previous.text}
                  </Link>
                ) : (
                  <a href={previous.href} target='_blank' rel='noopener noreferrer nofollow' className={linkCx}>
                    <ArrowLeftSvg aria-hidden /> {previous.text}
                  </a>
                )}
              </>
            )}
          </div>
          <div className='flex justify-end'>
            {!!next?.href && (
              <>
                {next.isLink ? (
                  <Link href={next.href} className={linkCx}>
                    {next.text}
                    <ArrowRightSvg aria-hidden />
                  </Link>
                ) : (
                  <a href={next.href} target='_blank' rel='noopener noreferrer nofollow' className={linkCx}>
                    {next.text}
                    <ArrowRightSvg aria-hidden />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </Wrapper>
  )
}

/**
 * assets
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
