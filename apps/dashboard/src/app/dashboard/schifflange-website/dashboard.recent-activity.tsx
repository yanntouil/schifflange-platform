import { useSwrArticles } from "@compo/articles"
import { useTranslation } from "@compo/localize"
import { useSwrPages } from "@compo/pages"
import { Ui } from "@compo/ui"
import { Clock } from "lucide-react"
import React from "react"

export const RecentActivityCard: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { pages } = useSwrPages()
  const { articles } = useSwrArticles()

  const recentContent = React.useMemo(() => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentPages = pages.filter((p) => new Date(p.updatedAt) > oneWeekAgo)
    const recentArticles = articles.filter((a) => new Date(a.updatedAt) > oneWeekAgo)

    return {
      total: recentPages.length + recentArticles.length,
      pages: recentPages.length,
      articles: recentArticles.length,
    }
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
            <Clock />
          </div>
        </Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-3xl font-bold">{recentContent.total}</p>
            <p className="text-muted-foreground text-xs">{_("description")}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-semibold">{recentContent.pages}</p>
              <p className="text-muted-foreground text-xs">{_("pages")}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{recentContent.articles}</p>
              <p className="text-muted-foreground text-xs">{_("articles")}</p>
            </div>
          </div>
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  en: {
    title: "Recent activity",
    description: "Content modified this week",
    pages: "Pages",
    articles: "Articles",
  },
  fr: {
    title: "Activité récente",
    description: "Contenus modifiés cette semaine",
    pages: "Pages",
    articles: "Articles",
  },
  de: {
    title: "Neueste Aktivität",
    description: "Diese Woche geänderte Inhalte",
    pages: "Seiten",
    articles: "Artikel",
  },
}
