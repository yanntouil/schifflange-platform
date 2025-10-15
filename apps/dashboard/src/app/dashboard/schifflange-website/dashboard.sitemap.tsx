import { useTranslation } from "@compo/localize"
import { SitemapCondensed } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { ExternalLink, LayoutPanelTop } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import routeToSiteMap from "./site/sitemap"

export const SitemapCard: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Card.Root className={className} {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2} className="relative">
          {_("title")}
          <div
            className="text-muted-foreground absolute top-0 right-0 flex size-8 items-center justify-center rounded-lg [&>svg]:size-4"
            aria-hidden
          >
            <LayoutPanelTop />
          </div>
        </Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <SitemapCondensed />
        <div className="mt-4 border-t pt-4">
          <Link
            to={routeToSiteMap()}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            {_("view-all-sitemap")}
            <ExternalLink className="size-3" aria-hidden />
          </Link>
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  en: {
    title: "Sitemap",
    "view-all-sitemap": "View all",
  },
  fr: {
    title: "Plan du site",
    "view-all-sitemap": "Voir tout",
  },
  de: {
    title: "Sitemap",
    "view-all-sitemap": "Alle anzeigen",
  },
}
