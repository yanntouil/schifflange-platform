'use client'

import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { SearchSvg } from '@/components/icons'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { useTranslation } from '@/lib/localize'
import { prose } from '@compo/ui/src/variants'
import { S, stripHtml } from '@compo/utils'
import React from 'react'
import { ProjectCard } from '../../../components/projects/project-card'
import { CategoriesFilter, TagsFilter, YearsFilter } from './filters'
import { useProjectsSearchState } from './hooks'
import type { TemplateProps } from './index'

/**
 * Template Default
 * A simple template with a title, description, and image.
 */
export function TemplateDefault({ props, projectsData, metadata }: TemplateProps) {
  const { _ } = useTranslation(dictionary)
  const { categories, tags, years } = metadata
  const { title, level, subtitle, description, displayHeading, cardLevel } = props

  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))

  const [searchState, setSearchState] = useProjectsSearchState()
  const searchId = React.useId()
  return (
    <Wrapper paddingY>
      <Container>
        {displayHeading && (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 pb-[24px]'>
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
                <div
                  className={prose({ variant: 'heading' })}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </div>
          </div>
        )}

        <div className='space-y-[38px]'>
          {/* Search Interface */}
          <div className='space-y-2'>
            {/* Search bar */}
            <div className='relative'>
              <label
                className='absolute inset-y-0 flex items-center justify-center left-0 w-[42px] h-[46px] rounded-l-[8px]'
                htmlFor={searchId}
              >
                <SearchSvg className='size-4 text-gray-500' aria-label={_('search-label')} />
              </label>
              <input
                id={searchId}
                type='text'
                placeholder={_('search-placeholder')}
                value={searchState.search}
                onChange={e => setSearchState({ search: e.target.value, page: '1' })}
                className='w-full pl-[42px] pr-[14px] py-[14px] rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 placeholder:text-tuna/50 text-tuna text-xs leading-4 font-normal ring-offset-2 ring-offset-pampas'
              />
            </div>

            {/* Filters Row */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
              <TagsFilter
                tags={tags}
                selectedTags={searchState.tags}
                onTagsChange={newTags => setSearchState({ tags: newTags, page: '1' })}
              />

              <CategoriesFilter
                categories={categories}
                selectedCategories={searchState.categories}
                onCategoriesChange={newCategories =>
                  setSearchState({ categories: newCategories, page: '1' })
                }
              />

              <YearsFilter
                years={years}
                selectedYears={searchState.years}
                onYearsChange={newYears => setSearchState({ years: newYears, page: '1' })}
              />
            </div>
          </div>

          {/* Results */}
          {projectsData && (
            <div>
              {projectsData.projects.length > 0 ? (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]'>
                    {projectsData.projects.map(project => (
                      <ProjectCard key={project.id} project={project} level={cardLevel} />
                    ))}
                  </div>

                  {/* Bottom section with Pagination left and Results right */}
                  <div className='flex items-center justify-between mt-8'>
                    {/* Pagination left */}
                    <div>
                      {projectsData.metadata.lastPage > 1 && (
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href='#'
                                onClick={e => {
                                  e.preventDefault()
                                  setSearchState({
                                    page: String(
                                      Math.max(1, projectsData.metadata.currentPage - 1)
                                    ),
                                  })
                                }}
                                aria-disabled={projectsData.metadata.currentPage === 1}
                                className={
                                  projectsData.metadata.currentPage === 1
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                                }
                              />
                            </PaginationItem>

                            {Array.from(
                              { length: projectsData.metadata.lastPage },
                              (_, i) => i + 1
                            ).map(pageNum => (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  href='#'
                                  onClick={e => {
                                    e.preventDefault()
                                    setSearchState({ page: String(pageNum) })
                                  }}
                                  isActive={pageNum === projectsData.metadata.currentPage}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                href='#'
                                onClick={e => {
                                  e.preventDefault()
                                  setSearchState({
                                    page: String(
                                      Math.min(
                                        projectsData.metadata.lastPage,
                                        projectsData.metadata.currentPage + 1
                                      )
                                    ),
                                  })
                                }}
                                aria-disabled={
                                  projectsData.metadata.currentPage ===
                                  projectsData.metadata.lastPage
                                }
                                className={
                                  projectsData.metadata.currentPage ===
                                  projectsData.metadata.lastPage
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </div>

                    {/* Results count right */}
                    <div className='text-sm text-gray-600'>
                      {_(projectsData.metadata.total === 1 ? 'project-found' : 'projects-found', {
                        count: projectsData.metadata.total,
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <p className='text-gray-600 text-center py-8'>{_('no-projects-found')}</p>
              )}
            </div>
          )}
        </div>
      </Container>
    </Wrapper>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    'search-label': 'Search',
    'search-placeholder': 'What are you looking for?',
    result: 'Page {{currentPage}} of {{lastPage}}',
    'project-found': '{{count}} project found',
    'projects-found': '{{count}} projects found',
    'no-projects-found': 'No projects found',
  },
  fr: {
    'search-label': 'Rechercher',
    'search-placeholder': 'Que cherchez-vous ?',
    result: 'Page {{currentPage}} sur {{lastPage}}',
    'project-found': '{{count}} projet trouvé',
    'projects-found': '{{count}} projets trouvés',
    'no-projects-found': 'Aucun projet trouvé',
  },
  de: {
    'search-label': 'Suchen',
    'search-placeholder': 'Was suchen Sie?',
    result: 'Seite {{currentPage}} von {{lastPage}}',
    'project-found': '{{count}} Projekt gefunden',
    'projects-found': '{{count}} Projekte gefunden',
    'no-projects-found': 'Keine Projekte gefunden',
  },
}
