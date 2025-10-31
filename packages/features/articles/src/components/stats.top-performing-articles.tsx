import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, millify, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { Link } from "wouter"
import { useArticles } from "../articles.context"
import { useArticlesService } from "../service.context"

/**
 * TopPerformingArticles
 */
export const TopPerformingArticles: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { routesTo } = useArticlesService()
  const { translate } = useLanguage()
  const { swr } = useArticles()
  const { articles } = swr
  const sortedArticles = React.useMemo(
    () => A.sort(articles, (a, b) => b.tracking.visits - a.tracking.visits),
    [articles]
  )
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>

      <Ui.Card.Content className='flex flex-col gap-2'>
        <p className='flex items-center justify-end'>
          <span className='text-sm font-medium text-[var(--chart-2)]'>{_("visits")}</span>
        </p>
        <ul className='flex flex-col gap-2'>
          {A.map(A.take(sortedArticles, 5), ({ id, seo, tracking }) => (
            <li className='flex items-center justify-between gap-8 text-sm' key={id}>
              <Link to={routesTo.articles.byId(id)} className={variants.link()}>
                <span className='line-clamp-1 tracking-tight'>
                  {placeholder(translate(seo, servicePlaceholder.seo).title, _("placeholder"))}
                </span>
              </Link>
              <span className='font-medium text-[var(--chart-2)]'>{millify(tracking.visits, { precision: 1 })}</span>
            </li>
          ))}
        </ul>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  fr: {
    title: "Articles les plus visités",
    placeholder: "Article sans titre",
    visits: "Visites",
  },
  en: {
    title: "Top performing articles",
    placeholder: "Untitled article",
    visits: "Visits",
  },
  de: {
    title: "Am besten performende Artikel",
    placeholder: "Artikel ohne Titel",
    visits: "Besuche",
  },
}
