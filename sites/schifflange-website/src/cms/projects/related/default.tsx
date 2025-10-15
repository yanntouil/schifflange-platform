'use client'
import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { useTranslation } from '@/lib/localize'
import { prose } from '@compo/ui/src/variants'
import { S, stripHtml } from '@compo/utils'
import { ProjectCard } from '../../../components/projects/project-card'
import type { TemplateProps } from './index'

/**
 * TemplateDefault
 * A simple template with a title, description, and image.
 */
export function TemplateDefault({ props, projectsData }: TemplateProps) {
  const { _ } = useTranslation(dictionary)
  const { title, level, subtitle, description, displayHeading, cardLevel } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  return (
    <Wrapper paddingY className='bg-glacier-20'>
      <Container>
        {displayHeading && (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 pb-[40px]'>
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

        {/* Results */}
        {projectsData ? (
          projectsData.projects.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]'>
              {projectsData.projects.map(project => (
                <ProjectCard key={project.id} project={project} level={cardLevel} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className={textVariants({ variant: 'default', color: 'tuna' })}>
                {_('no-projects-found')}
              </p>
            </div>
          )
        ) : (
          <div className='text-center py-12'>
            <p className={textVariants({ variant: 'default', color: 'tuna' })}>
              {_('error-loading-projects')}
            </p>
          </div>
        )}
      </Container>
    </Wrapper>
  )
}
/**
 * translations
 */
const dictionary = {
  fr: {
    'no-projects-found': 'Aucun projet trouvé.',
    'error-loading-projects': 'Erreur lors du chargement des projets.',
  },
  en: {
    'no-projects-found': 'No projects found.',
    'error-loading-projects': 'Error loading projects.',
  },
  de: {
    'no-projects-found': 'Keine Projekte gefunden.',
    'error-loading-projects': 'Fehler beim Laden der Projekte.',
  },
}
