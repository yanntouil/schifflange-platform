import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { ArticlesCard, ArticlesCardSkeleton } from "./articles.card"

/**
 * ArticlesCards
 */
export const ArticlesCards: React.FC<{ articles: Api.ArticleWithRelations[] }> = ({ articles }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(articles, (article) => (
        <ArticlesCard key={article.id} article={article} />
      ))}
    </section>
  )
}

/**
 * ArticlesCardsSkeleton
 */
export const ArticlesCardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(
        Array.from({ length: count }, (_, i) => i),
        (index) => (
          <ArticlesCardSkeleton key={index} />
        )
      )}
    </section>
  )
}
