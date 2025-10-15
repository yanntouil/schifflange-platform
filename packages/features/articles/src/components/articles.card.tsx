import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match, placeholder, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarSync, FileTextIcon, FolderIcon, GlobeIcon, LayoutPanelTop } from "lucide-react"
import React from "react"
import { useArticles } from "../articles.context"
import { useArticlesService } from "../service.context"
import { ArticlesMenu } from "./articles.menu"

/**
 * ArticlesCard
 */
export const ArticlesCard: React.FC<{ article: Api.ArticleWithRelations }> = ({ article }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { getImageUrl } = useArticlesService()
  const { translate } = useLanguage()
  const translatedSeo = translate(article.seo, servicePlaceholder.seo)
  const { selectable, displayArticle } = useArticles()
  const title = placeholder(translatedSeo.title, _("untitled"))
  const description = placeholder(translatedSeo.description, _("no-description"))
  const imageUrl = getImageUrl(translatedSeo.image)

  // Category information
  const categoryTitle = article.category
    ? placeholder(translate(article.category, servicePlaceholder.articleCategory).title, _("uncategorized"))
    : _("uncategorized")

  return (
    <Dashboard.Card.Root
      key={article.id}
      menu={<ArticlesMenu article={article} />}
      item={article}
      selectable={selectable}
      {...smartClick(article, selectable, () => displayArticle(article))}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined}>
        <LayoutPanelTop className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          {match(article.state)
            .with("published", () => <GlobeIcon aria-hidden className='text-green-600' />)
            .with("draft", () => <FileTextIcon aria-hidden className='text-orange-600' />)
            .exhaustive()}
          {_(`state-${article.state}`)}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field>
          <FolderIcon aria-hidden className='text-blue-600' />
          {categoryTitle}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field
          tooltip={_("updated-at-tooltip", { date: format(T.parseISO(article.updatedAt), "PPPp") })}
        >
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(article.updatedAt)) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * ArticlesCardsSkeleton
 */
export const ArticlesCardSkeleton: React.FC = () => {
  return (
    <Dashboard.Card.Root>
      <Dashboard.Card.Image className='animate-pulse'>
        <LayoutPanelTop className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>
          <Ui.Skeleton variant='text-lg' className='w-./4' />
          <div>
            <Ui.Skeleton variant='text-sm' className='w-full' />
            <Ui.Skeleton variant='text-sm' className='w-3/4' />
          </div>
        </Dashboard.Card.Title>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Ui.Skeleton variant='text-sm' className='w-1/2' />
        <Ui.Skeleton variant='text-sm' className='w-3/4' />
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    locked: "This article is locked, ask an administrator to unlock it",
    untitled: "Untitled article",
    "no-description": "No description",
    uncategorized: "Uncategorized",
    "state-draft": "Draft",
    "state-published": "Published",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    locked: "Cet article est verrouillé, demander à un administrateur pour la déverrouiller",
    untitled: "Article sans titre",
    "no-description": "Aucune description",
    uncategorized: "Non catégorisé",
    "state-draft": "Brouillon",
    "state-published": "Publié",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    locked: "Dieser Artikel ist gesperrt. Bitten Sie einen Administrator, ihn zu entsperren",
    untitled: "Artikel ohne Titel",
    "no-description": "Keine Beschreibung",
    uncategorized: "Unkategorisiert",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
