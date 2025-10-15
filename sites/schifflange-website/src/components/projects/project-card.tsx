'use client'

import { CardImage } from '@/cms/features/cards/components/card-image'
import { Hn } from '@/components/hn'
import { makeMediaImage } from '@/utils/image'
import { makeLinkFromSlug } from '@/utils/links'
import { type Api } from '@services/site'
import Link from 'next/link'

/**
 * Project Card Component
 * Displays project information in a card format
 */
interface ProjectCardProps {
  project: Api.Project
  level: string | number
}

// Helper function to parse tag name and remove content in parentheses
function parseTagName(tagName: string): string {
  return tagName.replace(/\s*\([^)]*\)/g, '').trim()
}

export function ProjectCard({ project, level }: ProjectCardProps) {
  const { title, description } = project.seo.translations

  const image = makeMediaImage(project.seo.translations.image, 'original')

  const tagName = project.tag?.translations?.name
  const category = project.category?.translations?.title
  const parsedTagName = tagName ? parseTagName(tagName) : null

  const projectUrl = makeLinkFromSlug(project.slug)

  return (
    <article className='group'>
      <Link href={projectUrl} className='cursor-pointer'>
        {/* Image container */}
        <div className='relative'>
          <CardImage image={image} placeholder />

          {/* Tag */}
          {parsedTagName && (
            <div className='absolute -top-4 -right-2'>
              <div className='w-[136px] flex justify-center items-center text-sm text-powder-100 pb-[10px] pt-[14px] px-[8px]'>
                <TagBackgroundSvg className='absolute inset-0 size-full' />
                <span className='relative'>{parsedTagName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='mt-4 space-y-2'>
          {/* Title */}
          <Hn
            level={level}
            className='text-tuna text-[18px] font-semibold leading-normal group-hover:text-tan transition-colors duration-300'
          >
            {title}
          </Hn>

          {/* Category */}
          {category && (
            <p className='text-powder-100 text-xs font-normal leading-normal'>{category}</p>
          )}

          {/* Description */}
          {description && (
            <p className='text-tuna text-xs leading-normal font-medium'>{description}</p>
          )}
        </div>
      </Link>
    </article>
  )
}

/**
 * TagBackgroundSvg
 */
const TagBackgroundSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width='136'
    height='45'
    viewBox='0 0 136 45'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M133.372 45L2.62802 45C1.17661 45 2.45243e-06 43.5313 2.32555e-06 41.7195L0 8.51389C-1.2402e-07 6.74306 1.1259 5.29184 2.5438 5.23508L133.288 0.00172087C134.771 -0.057665 136 1.42756 136 3.28053V41.7195C136 43.5313 134.823 45 133.372 45Z'
      fill='#FFD167'
    />
  </svg>
)
