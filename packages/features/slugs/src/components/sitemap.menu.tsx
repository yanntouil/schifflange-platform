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

  const { routesTo, makeUrl } = useSlugsService()
  const route = React.useMemo(() => {
    return match(slug)
      .with({ model: "page" }, ({ page }) => routesTo.pages.byId(page.id))
      .with({ model: "article" }, ({ article }) => routesTo.articles.byId(article.id))
      .exhaustive()
  }, [slug, routesTo.pages.byId, routesTo.articles.byId])
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
    edit: "Edit slug",
  },
  de: {
    "open-page": "Seite öffnen",
    "view-page": "Seite anzeigen",
    "open-article": "Artikel öffnen",
    "view-article": "Artikel anzeigen",
    edit: "Slug bearbeiten",
  },
  fr: {
    "open-page": "Accéder à la page",
    "view-page": "Voir la page sur le site",
    "open-article": "Accéder à l'article",
    "view-article": "Voir l'article sur le site",
    edit: "Modifier le slug",
  },
}
