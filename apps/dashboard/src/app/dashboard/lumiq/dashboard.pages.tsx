import { useTranslation } from "@compo/localize"
import { useSwrPages } from "@compo/pages"
import { Ui } from "@compo/ui"
import { LayoutPanelTop } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import routeToPages from "./pages"

export const PagesCard: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { pages } = useSwrPages()

  return (
    <Ui.Card.Root className={className} {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2} className="relative text-xl">
          {_("title")}
          <div
            className="bg-primary/10 text-primary absolute top-0 right-0 flex size-12 items-center justify-center rounded-lg [&>svg]:size-6"
            aria-hidden
          >
            <LayoutPanelTop />
          </div>
        </Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{pages.length}</span>
              <span className="text-muted-foreground text-sm">{_("total")}</span>
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              <Link to={routeToPages()}>{_("description")}</Link>
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs font-medium">{_("published")}</p>
            <p className="mt-1 text-xl font-semibold">{pages.filter((p) => p.state === "published").length}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs font-medium">{_("draft")}</p>
            <p className="mt-1 text-xl font-semibold">{pages.filter((p) => p.state === "draft").length}</p>
          </div>
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  en: {
    title: "Pages",
    description: "Create and manage your website pages",
    published: "Published",
    draft: "Drafts",
    total: "Total",
  },
  fr: {
    title: "Pages",
    description: "Créez et gérez les pages de votre site",
    published: "Publiées",
    draft: "Brouillons",
    total: "Total",
  },
  de: {
    title: "Seiten",
    description: "Erstellen und verwalten Sie Ihre Website-Seiten",
    published: "Veröffentlicht",
    draft: "Entwürfe",
    total: "Total",
  },
}
