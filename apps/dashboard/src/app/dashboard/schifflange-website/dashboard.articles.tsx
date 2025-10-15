import { useSwrArticles } from "@compo/articles"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Newspaper } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import routeToArticles from "./articles"

export const ArticlesCard: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { articles } = useSwrArticles()

  return (
    <Ui.Card.Root className={className} {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2} className="relative">
          {_("title")}
          <div
            className="absolute top-0 right-0 flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 [&>svg]:size-4"
            aria-hidden
          >
            <Newspaper />
          </div>
        </Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight">{articles.length}</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{_("published")}</span>
                <span className="font-medium">{articles.filter((a) => a.state === "published").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{_("draft")}</span>
                <span className="font-medium">{articles.filter((a) => a.state === "draft").length}</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-xs">
              <Link to={routeToArticles()}>{_("description")}</Link>
            </p>
          </div>
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  en: {
    title: "Articles",
    description: "Create and manage your website articles",
    published: "Published",
    draft: "Drafts",
  },
  fr: {
    title: "Articles",
    description: "Créez et gérez les articles de votre site",
    published: "Publiés",
    draft: "Brouillons",
  },
  de: {
    title: "Artikel",
    description: "Erstellen und verwalten Sie Ihre Website-Artikel",
    published: "Veröffentlicht",
    draft: "Entwürfe",
  },
}
