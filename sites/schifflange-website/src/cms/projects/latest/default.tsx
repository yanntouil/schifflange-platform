"use client"
import { Container } from "@/components/layout/container"
import { Wrapper } from "@/components/layout/wrapper"
import { Link } from "@/components/link"
import { buttonVariants } from "@/components/ui/button"
import { Hn } from "@/components/ui/hn/components"
import { textVariants } from "@/components/variants"
import { useTranslation } from "@/lib/localize"
import { makeLinkProps } from "@/utils/links"
import { prose } from "@compo/ui/src/variants"
import { S, stripHtml } from "@compo/utils"
import { ProjectCard } from "../../../components/projects/project-card"
import type { TemplateProps } from "./index"

/**
 * TemplateDefault
 * A simple template with a title, description, and image.
 */
export function TemplateDefault({ props, projectsData }: TemplateProps) {
  const { _ } = useTranslation(dictionary)
  const { title, level, subtitle, description, displayHeading, cardLevel } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  return (
    <Wrapper paddingY>
      <Container>
        {displayHeading && (
          <div className='pb-[40px]'>
            <div className={`${props.link ? "grid grid-cols-1 items-end gap-8 md:grid-cols-2" : ""}`}>
              <div className='flex flex-col justify-center'>
                {title && (
                  <Hn level={level} className={textVariants({ variant: "title", color: "tuna" })}>
                    {title}
                  </Hn>
                )}
                {subtitle && <p className={textVariants({ variant: "subtitle", color: "tuna" })}>{subtitle}</p>}
                {hasDescription && (
                  <div className={prose({ variant: "heading" })} dangerouslySetInnerHTML={{ __html: description }} />
                )}
              </div>
              {props.link && (
                <div className='flex justify-end'>
                  <Button link={props.link} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {projectsData ? (
          projectsData.projects.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-[40px]'>
              {projectsData.projects.map((project) => (
                <ProjectCard key={project.id} project={project} level={cardLevel} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className={textVariants({ variant: "default", color: "tuna" })}>{_("no-projects-found")}</p>
            </div>
          )
        ) : (
          <div className='text-center py-12'>
            <p className={textVariants({ variant: "default", color: "tuna" })}>{_("error-loading-projects")}</p>
          </div>
        )}
      </Container>
    </Wrapper>
  )
}

/**
 * Button
 * A button component that renders a link or an anchor tag.
 */
type ButtonProps = {
  link: ReturnType<typeof makeLinkProps>
}
const Button: React.FC<ButtonProps> = ({ link }) => {
  if (!link?.href) return null
  const cx = buttonVariants({ scheme: "default" })
  if (link.isLink)
    return (
      <Link href={link.href} className={cx}>
        {link.text}
        <ArrowSvg aria-hidden />
      </Link>
    )
  return (
    <a href={link.href} target='_blank' rel='noopener noreferrer nofollow' className={cx}>
      {link.text}
    </a>
  )
}

/**
 * icons
 */
const ArrowSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 18 19' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M5.25 5.75H12.75M12.75 5.75V13.25M12.75 5.75L5.25 13.25'
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
    "no-projects-found": "Aucun projet trouvé.",
    "error-loading-projects": "Erreur lors du chargement des projets.",
  },
  en: {
    "no-projects-found": "No projects found.",
    "error-loading-projects": "Error loading projects.",
  },
  de: {
    "no-projects-found": "Keine Projekte gefunden.",
    "error-loading-projects": "Fehler beim Laden der Projekte.",
  },
}
