import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { LayoutPanelTop } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { useRouteTo } from "../hooks"
import { useSlugsService } from "../service.context"
import { useSWRSlugs } from "../swr"
import { getSlugResource } from "../utils"
import { ResourceIcon } from "./icons"
import { SitemapFilters } from "./sitemap.filters"
import { useSitemapFiltered } from "./sitemap.hooks"

interface SitemapCondensedProps {
  //
}

/**
 * SitemapCondensed - Version compacte pour dashboard
 */
export const SitemapCondensed: React.FC<SitemapCondensedProps> = () => {
  const { _ } = useTranslation(dictionary)
  const swr = useSWRSlugs()
  const { filtered, filterable, matchable, sortable, reset } = useSitemapFiltered(swr)

  if (swr.isLoading) {
    return (
      <div className='flex flex-col pt-6 divide-y'>
        {Array.from({ length: 5 }).map((_, i) => (
          <article key={i} className='py-1'>
            <div className='flex items-center gap-3 p-2'>
              <div className='bg-muted size-12 shrink-0 rounded animate-pulse' />
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between'>
                  <div className='bg-muted h-4 w-3/4 rounded animate-pulse' />
                  <div className='bg-muted h-4 w-12 rounded animate-pulse' />
                </div>
                <div className='mt-0.5'>
                  <div className='bg-muted h-3 w-1/2 rounded animate-pulse' />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    )
  }

  if (swr.slugs.length === 0) {
    return (
      <div className='text-center py-8'>
        <LayoutPanelTop className='mx-auto size-12 text-muted-foreground/50' />
        <p className='text-muted-foreground mt-4 text-sm'>{_("condensed-empty")}</p>
      </div>
    )
  }

  return (
    <Dashboard.Collection>
      <Dashboard.Toolbar.Root className='pb-4'>
        <Dashboard.Toolbar.Search {...matchable} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed(`sort`)} />
          <SitemapFilters {...filterable} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Empty
        total={swr.slugs.length}
        results={filtered.length}
        t={_.prefixed(`empty`)}
        reset={reset}
        isLoading={swr.isLoading}
      >
        <div className='flex flex-col divide-y'>
          {filtered.map((slug) => (
            <CompactSlug key={slug.id} slug={slug} />
          ))}
        </div>
      </Dashboard.Empty>
    </Dashboard.Collection>
  )
}

/**
 * CompactSlug - Version compacte pour le dashboard
 */
const CompactSlug: React.FC<{ slug: Api.Slug & Api.WithModel }> = ({ slug }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { getImageUrl } = useSlugsService()
  const ressource = getSlugResource(slug)
  const ressourcePath = useRouteTo(slug)
  const seoTranslated = translate(ressource.seo, servicePlaceholder.seo)

  const image = seoTranslated?.image
    ? {
        url: getImageUrl(seoTranslated.image, "preview") ?? undefined,
        alt: translate(seoTranslated.image, servicePlaceholder.mediaFile).alt,
      }
    : null

  return (
    <article className='py-1'>
      <Link
        to={ressourcePath}
        className='flex items-center gap-3 hover:bg-muted/50 transition-colors group p-2 rounded-md'
      >
        <div className='relative bg-muted size-12 shrink-0 rounded flex items-center justify-center overflow-hidden'>
          <ResourceIcon model={slug.model} className='size-5 stroke-[0.5] shrink-0' />
          {image?.url && <Ui.Image src={image.url} className='size-full absolute inset-0 object-cover' />}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex justify-between'>
            <p className='text-sm font-medium truncate group-hover:text-foreground'>
              {placeholder(seoTranslated?.title, _("title-placeholder"))}
            </p>
            <Ui.Badge variant='secondary' className='text-xs'>
              {_(`type-${slug.model}`)}
            </Ui.Badge>
          </div>
          <div className='flex items-center gap-2 mt-0.5'>
            <span className='text-xs text-muted-foreground'>{slug.path}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "condensed-empty": "Aucun contenu publié",
    "search-placeholder": "Rechercher dans le plan du site...",
    "no-results": "Aucun résultat trouvé",
    "type-page": "Page",
    "type-page-tooltip": "Page statique du site",
    "type-article": "Article",
    "type-article-tooltip": "Article de blog ou actualité",
    "type-event": "Événement",
    "type-event-tooltip": "Événement",
    "title-placeholder": "Sans titre",
    "description-placeholder": "Sans description",
    sort: {
      title: "Titre de la ressource",
      path: "Slug de la ressource",
      createdAt: "Date de création",
      updatedAt: "Dernière modification",
    },
    empty: {
      "no-item-title": "Aucun contenu trouvé",
      "no-item-content-create": "Créez du contenu pour voir apparaître le plan du site",
      "no-item-content": "Votre site ne contient pas encore de pages ou d'articles publiés.",
      "no-result-title": "Aucun résultat",
      "no-result-content": "Aucun contenu ne correspond à votre recherche.",
      "no-result-content-reset":
        "Aucun contenu ne correspond à vos critères. {{reset:Réinitialisez les filtres}} pour voir tout le contenu.",
    },
  },
  de: {
    "condensed-empty": "Keine veröffentlichten Inhalte",
    "search-placeholder": "In der Sitemap suchen...",
    "no-results": "Keine Ergebnisse gefunden",
    "type-page": "Seite",
    "type-page-tooltip": "Statische Website-Seite",
    "type-article": "Artikel",
    "type-article-tooltip": "Blog-Beitrag oder Nachrichtenartikel",
    "type-event": "Veranstaltung",
    "type-event-tooltip": "Veranstaltung",
    "title-placeholder": "Ohne Titel",
    "description-placeholder": "Keine Beschreibung",
    sort: {
      title: "Titel der Ressource",
      path: "URL-Pfad",
      createdAt: "Erstellungsdatum",
      updatedAt: "Zuletzt geändert",
    },
    empty: {
      "no-item-title": "Keine Inhalte gefunden",
      "no-item-content-create": "Erstellen Sie Inhalte, um die Sitemap anzuzeigen",
      "no-item-content": "Ihre Website hat noch keine veröffentlichten Seiten oder Artikel.",
      "no-result-title": "Keine Ergebnisse",
      "no-result-content": "Kein Inhalt entspricht Ihrer Suche.",
      "no-result-content-reset":
        "Kein Inhalt entspricht Ihren Kriterien. {{reset:Filter zurücksetzen}}, um alle Inhalte anzuzeigen.",
    },
  },
  en: {
    "condensed-empty": "No published content",
    "search-placeholder": "Search in sitemap...",
    "no-results": "No results found",
    "type-page": "Page",
    "type-page-tooltip": "Static website page",
    "type-article": "Article",
    "type-article-tooltip": "Blog post or news article",
    "type-event": "Event",
    "type-event-tooltip": "Event",
    "title-placeholder": "Untitled",
    "description-placeholder": "No description",
    sort: {
      title: "Resource title",
      path: "URL path",
      createdAt: "Creation date",
      updatedAt: "Last modified",
    },
    empty: {
      "no-item-title": "No content found",
      "no-item-content-create": "Create content to see the sitemap appear",
      "no-item-content": "Your site doesn't have any published pages or articles yet.",
      "no-result-title": "No results",
      "no-result-content": "No content matches your search.",
      "no-result-content-reset": "No content matches your criteria. {{reset:Reset filters}} to see all content.",
    },
  },
}
