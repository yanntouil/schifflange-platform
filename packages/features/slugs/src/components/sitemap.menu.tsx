import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { FileInput, FilePenLine, SquareArrowOutUpRight } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { useSlugsService } from "../service.context"

/**
 * SitemapMenu
 */
export const SitemapMenu: React.FC<{ slug: Api.Slug & Api.WithModel; edit: () => void }> = ({ slug, edit }) => {
  const { _ } = useTranslation(dictionary)

  const { routeToArticle, routeToPage, routeToProject, routeToProjectStep, makeUrl } = useSlugsService()
  const route = match(slug)
    .with({ model: "page" }, ({ page }) => routeToPage(page.id))
    .with({ model: "article" }, ({ article }) => routeToArticle(article.id))
    .with({ model: "project" }, ({ project }) => routeToProject(project.id))
    .with({ model: "project-step" }, ({ projectStep }) => routeToProjectStep(projectStep.projectId, projectStep.id))
    .exhaustive()
  const url = makeUrl(slug)
  return (
    <>
      <Ui.Menu.Item asChild>
        <Link href={route}>
          <FileInput aria-hidden />
          {_(`open-${slug.model}`)}
        </Link>
      </Ui.Menu.Item>
      <Ui.Menu.Item asChild>
        <a href={url} target='_blank' rel='noopener noreferrer nofollow'>
          <SquareArrowOutUpRight aria-hidden />
          {_(`view-${slug.model}`)}
        </a>
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={edit}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "open-page": "Open page",
    "view-page": "View page",
    "open-article": "Open article",
    "view-article": "View article",
    "open-project": "Open project",
    "view-project": "View project",
    "open-project-step": "Open project step",
    "view-project-step": "View project step",
    edit: "Edit slug",
  },
  de: {
    "open-page": "Seite öffnen",
    "view-page": "Seite anzeigen",
    "open-article": "Artikel öffnen",
    "view-article": "Artikel anzeigen",
    "open-project": "Projekt öffnen",
    "view-project": "Projekt anzeigen",
    "open-project-step": "Schritt öffnen",
    "view-project-step": "Schritt anzeigen",
    edit: "Slug bearbeiten",
  },
  fr: {
    "open-page": "Accéder à la page",
    "view-page": "Voir la page sur le site",
    "open-article": "Accéder à l'article",
    "view-article": "Voir l'article sur le site",
    "open-project": "Accéder au projet",
    "view-project": "Voir le projet sur le site",
    "open-project-step": "Accéder au projet",
    "view-project-step": "Voir le projet sur le site",
    edit: "Modifier le slug",
  },
}
