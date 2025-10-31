import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, cx, D, G, placeholder } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { ChevronsUpDown, Link2 } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { useRouteTo } from "../hooks"
import { useSlugsService } from "../service.context"
import { useSWRSlugs } from "../swr"
import { getSlugResource } from "../utils"
import { EditSlugDialog } from "./dialog"
import { ResourceIcon } from "./icons"
import { SitemapFilters } from "./sitemap.filters"
import { GroupedSlugs, useEditSlug, useSitemapFiltered } from "./sitemap.hooks"
import { SitemapMenu } from "./sitemap.menu"

/**
 * Sitemap
 */
export const Sitemap: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const swr = useSWRSlugs()

  const [editSlug, editSlugProps] = useEditSlug(swr)

  const { filtered, filterable, matchable, sortable, groupedSlugs, reset } = useSitemapFiltered(swr)

  return (
    <>
      <Dashboard.Toolbar.Root>
        <Dashboard.Toolbar.Search {...matchable} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed(`sort`)} />
          <SitemapFilters {...filterable} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Collection>
        <Dashboard.Empty
          total={swr.slugs.length}
          results={filtered.length}
          t={_.prefixed(`empty`)}
          reset={reset}
          isLoading={swr.isLoading}
        >
          <div className='flex flex-col gap-2 pt-6'>
            <RecursiveItem partsOrSlugs={groupedSlugs} editSlug={editSlug} />
          </div>
        </Dashboard.Empty>
      </Dashboard.Collection>
      <EditSlugDialog {...editSlugProps} />
    </>
  )
}

/**
 * display recursively items as slug or part of tree with an header
 */
const RecursiveItem: React.FC<{
  partsOrSlugs: GroupedSlugs
  depth?: number
  editSlug: (slug: Api.Slug & Api.WithModel) => void
}> = ({ partsOrSlugs, depth = 0, ...props }) => {
  const items = A.sortBy(D.toPairs(partsOrSlugs), ([part]) => part)

  return (
    <>
      {A.map(items, ([part, partsOrSlugs]) => (
        <React.Fragment key={part}>
          <div className='flex flex-col gap-4'>
            {G.isArray(partsOrSlugs) ? (
              <>
                {A.map(partsOrSlugs, (slug) => (
                  <Slug key={slug.id} slug={slug} {...props} />
                ))}
              </>
            ) : (
              <Collapsible title={part}>
                <div className='flex flex-col gap-4'>
                  {/* Display items at this level if they exist */}
                  {partsOrSlugs.__items__ && Array.isArray(partsOrSlugs.__items__) && (
                    <div className='flex flex-col gap-4'>
                      {A.map(partsOrSlugs.__items__ as (Api.Slug & Api.WithModel)[], (slug) => (
                        <Slug key={slug.id} slug={slug} {...props} />
                      ))}
                    </div>
                  )}
                  {/* Display nested groups, excluding __items__ */}
                  <RecursiveItem
                    partsOrSlugs={D.deleteKeys(partsOrSlugs, ["__items__"]) as GroupedSlugs}
                    depth={depth + 1}
                    {...props}
                  />
                </div>
              </Collapsible>
            )}
          </div>
        </React.Fragment>
      ))}
    </>
  )
}

const Collapsible: React.FC<{
  title: string
  children: React.ReactNode
}> = ({ title, children }) => {
  const [open, onOpenChange] = React.useState(true)
  const [animate, setAnimate] = React.useState(false)
  React.useEffect(() => {
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 200)
    return () => clearTimeout(timeout)
  }, [open])
  return (
    <Ui.Collapsible.Root className={cx("flex flex-col gap-4 pb-4")} open={open} onOpenChange={onOpenChange}>
      <Ui.Collapsible.Trigger className='w-full flex justify-between items-center group'>
        <Ui.Badge variant='secondary' className='px-4 py-1 text-sm/relaxed'>
          {title}
        </Ui.Badge>
        <span
          className='flex justify-center items-center size-8 rounded-md mr-2 bg-background group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 ease-in-out'
          aria-hidden
        >
          <ChevronsUpDown className='size-3.5 text-muted-foreground shrink-0' />
        </span>
      </Ui.Collapsible.Trigger>
      <Ui.Collapsible.Content
        className={cx(
          "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down ml-4 border-l border-muted pl-4",
          animate && "overflow-hidden"
        )}
      >
        {children}
      </Ui.Collapsible.Content>
    </Ui.Collapsible.Root>
  )
}

/**
 * Slug
 */
const Slug: React.FC<{
  slug: Api.Slug & Api.WithModel
  editSlug: (slug: Api.Slug & Api.WithModel) => void
}> = ({ slug, editSlug }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useContextualLanguage()
  const { getImageUrl } = useSlugsService()
  const ressource = getSlugResource(slug)
  const seoTranslated = translate(ressource.seo, servicePlaceholder.seo)
  const ressourcePath = useRouteTo(slug)

  const image = seoTranslated?.image
    ? {
        url: getImageUrl(seoTranslated.image, "preview") ?? undefined,
        alt: translate(seoTranslated.image, servicePlaceholder.mediaFile).alt,
      }
    : {
        url: "",
        alt: seoTranslated.title,
      }
  return (
    <Dashboard.Row.Root menu={<SitemapMenu slug={slug} edit={() => editSlug(slug)} />}>
      <div className='relative bg-muted size-16 shrink-0 rounded flex items-center justify-center '>
        <ResourceIcon model={slug.model} className='size-6 stroke-1 shrink-0' />
        <Ui.Image src={image.url} className='size-full absolute inset-0 shrink-0 rounded object-cover' />
      </div>
      <Dashboard.Row.Header className='flex flex-col justify-center gap-1 grow'>
        <Dashboard.Row.Title>
          <Link to={ressourcePath}>{placeholder(seoTranslated?.title, _("title-placeholder"))}</Link>
          <Ui.Badge variant='ghost' tooltip={`/${slug.path}`}>
            <Link2 aria-hidden className='size-3' />
          </Ui.Badge>
        </Dashboard.Row.Title>
        <Dashboard.Row.Description className='line-clamp-3 leading-tight'>
          {placeholder(seoTranslated?.description, _("description-placeholder"))}
        </Dashboard.Row.Description>
      </Dashboard.Row.Header>
      <Dashboard.Row.Content>
        <Ui.Badge tooltip={_(`type-${slug.model}-tooltip`)}>{_(`type-${slug.model}`)}</Ui.Badge>
      </Dashboard.Row.Content>
    </Dashboard.Row.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    create: "Contenu",
    "type-page": "Page",
    "type-page-tooltip": "Page statique du site",
    "type-article": "Article",
    "type-article-tooltip": "Article de blog ou actualité",
    "title-placeholder": "Sans titre",
    "description-placeholder": "Sans description",
    "edit-slug": "Modifier l'URL",
    "display-resource": "Voir sur le site",
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
    create: "Inhalt",
    "type-page": "Seite",
    "type-page-tooltip": "Statische Website-Seite",
    "type-article": "Artikel",
    "type-article-tooltip": "Blog-Beitrag oder Nachrichtenartikel",
    "title-placeholder": "Ohne Titel",
    "description-placeholder": "Keine Beschreibung",
    "edit-slug": "URL bearbeiten",
    "display-resource": "Auf der Website anzeigen",
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
    create: "Content",
    "type-page": "Page",
    "type-page-tooltip": "Static website page",
    "type-article": "Article",
    "type-article-tooltip": "Blog post or news article",
    "title-placeholder": "Untitled",
    "description-placeholder": "No description",
    "edit-slug": "Edit URL",
    "display-resource": "View on site",
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
