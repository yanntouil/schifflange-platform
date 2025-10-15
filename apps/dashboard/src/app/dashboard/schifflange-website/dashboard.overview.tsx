import { useSwrArticles } from "@compo/articles"
import { useTranslation } from "@compo/localize"
import { useSwrPages } from "@compo/pages"
import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import React from "react"

export const OverviewCard: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { pages } = useSwrPages()
  const { articles } = useSwrArticles()

  const totalContent = pages.length + articles.length
  const totalPublished = pages.filter((p) => p.state === "published").length + articles.filter((a) => a.state === "published").length
  const totalDrafts = pages.filter((p) => p.state === "draft").length + articles.filter((a) => a.state === "draft").length
  const publicationRate = totalContent > 0 ? Math.round((totalPublished / totalContent) * 100) : 0

  return (
    <Ui.Card.Root className={cxm("from-primary/5 to-primary/10 bg-gradient-to-br", className)} {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2}>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-muted-foreground text-xs">{_("total-content")}</p>
            <p className="text-2xl font-bold">{totalContent}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{_("published")}</p>
            <p className="text-2xl font-bold">{totalPublished}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{_("drafts")}</p>
            <p className="text-2xl font-bold">{totalDrafts}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{_("publication-rate")}</p>
            <p className="text-2xl font-bold">{publicationRate}%</p>
          </div>
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  en: {
    title: "Overview",
    "total-content": "Total content",
    published: "Published",
    drafts: "Drafts",
    "publication-rate": "Publication rate",
  },
  fr: {
    title: "Vue d'ensemble",
    "total-content": "Total contenu",
    published: "Publié",
    drafts: "Brouillons",
    "publication-rate": "Taux publication",
  },
  de: {
    title: "Übersicht",
    "total-content": "Gesamt Inhalt",
    published: "Veröffentlicht",
    drafts: "Entwürfe",
    "publication-rate": "Veröffentlichungsrate",
  },
}
