import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, millify, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { Link } from "wouter"
import { useProjects } from "../../projects.context"
import { useProjectsService } from "../../service.context"

/**
 * TopPerformingProjects
 */
export const TopPerformingProjects: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { routeToProject } = useProjectsService()
  const { translate } = useLanguage()
  const { swr } = useProjects()
  const { projects } = swr
  const sortedProjects = React.useMemo(
    () => A.sort(projects, (a, b) => b.tracking.visits - a.tracking.visits),
    [projects]
  )
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>

      <Ui.Card.Content className='flex flex-col gap-2'>
        <p className='flex items-center justify-end'>
          <span className='text-sm font-medium text-[var(--chart-2)]'>{_("visits")}</span>
        </p>
        <ul className='flex flex-col gap-2'>
          {A.map(A.take(sortedProjects, 5), ({ id, seo, tracking }) => (
            <li className='flex items-center justify-between gap-8 text-sm' key={id}>
              <Link to={routeToProject(id)} className={variants.link()}>
                <span className='line-clamp-1 tracking-tight'>
                  {placeholder(translate(seo, servicePlaceholder.seo).title, _("placeholder"))}
                </span>
              </Link>
              <span className='font-medium text-[var(--chart-2)]'>{millify(tracking.visits, { precision: 1 })}</span>
            </li>
          ))}
        </ul>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  fr: {
    title: "Projets les plus visités",
    placeholder: "Projet sans titre",
    visits: "Visites",
  },
  en: {
    title: "Top performing projects",
    placeholder: "Untitled project",
    visits: "Visits",
  },
  de: {
    title: "Leistungsstärkste Projekte",
    placeholder: "Projekt ohne Titel",
    visits: "Besuche",
  },
}
