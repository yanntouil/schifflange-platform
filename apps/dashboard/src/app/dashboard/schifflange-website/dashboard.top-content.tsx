import { service } from "@/services"
import { useSwrArticles } from "@compo/articles"
import { useTranslation } from "@compo/localize"
import { useSwrPages } from "@compo/pages"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, millify, placeholder } from "@compo/utils"
import { LayoutPanelTop, Newspaper, TrendingUp } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import routeToArticle from "./articles/[articleId]"
import routeToPage from "./pages/[pageId]"

export const TopContentCard: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const { pages } = useSwrPages()
  const { articles } = useSwrArticles()

  const topContent = React.useMemo(() => {
    const allContent = [
      ...pages.map((p) => ({ ...p, type: "page" as const })),
      ...articles.map((a) => ({ ...a, type: "article" as const })),
    ]

    return A.take(
      A.sort(allContent, (a, b) => (b.tracking?.visits || 0) - (a.tracking?.visits || 0)),
      5
    )
  }, [pages, articles])

  return (
    <Ui.Card.Root className={className} {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2} className="relative">
          {_("title")}
          <div
            className="text-muted-foreground absolute top-0 right-0 flex size-8 items-center justify-center rounded-lg [&>svg]:size-4"
            aria-hidden
          >
            <TrendingUp />
          </div>
        </Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <div className="space-y-2 pr-1">
          {topContent.length > 0 ? (
            topContent.map((item) => (
              <Link
                key={item.id}
                className="flex items-center justify-between gap-2 text-sm"
                href={match(item.type)
                  .with("page", () => routeToPage(item.id))
                  .with("article", () => routeToArticle(item.id))
                  .exhaustive()}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {match(item.type)
                    .with("page", () => <LayoutPanelTop className="text-primary size-3 shrink-0" />)
                    .with("article", () => <Newspaper className="size-3 shrink-0 text-blue-500" />)
                    .exhaustive()}
                  <span className="truncate">{placeholder(translate(item.seo, service.placeholder.seo).title, _("placeholder"))}</span>
                </div>
                <span className="text-muted-foreground font-medium tabular-nums">
                  {millify(item.tracking?.visits || 0, { precision: 1 })}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground text-center text-sm">{_("no-data")}</p>
          )}
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  en: {
    title: "Top content",
    "no-data": "No visit data",
    placeholder: "Untitled",
  },
  fr: {
    title: "Top contenus",
    "no-data": "Aucune donnée de visite",
    placeholder: "Sans titre",
  },
  de: {
    title: "Top Inhalte",
    "no-data": "Keine Besuchsdaten",
    placeholder: "Ohne Titel",
  },
}
