import { useTranslation } from "@compo/localize"
import { TrackingCharts } from "@compo/trackings"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, cx, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { ChevronsUpDown, Search } from "lucide-react"
import React from "react"
import { useArticles } from "../articles.context"

/**
 * TrackingsCharts
 */
export const TrackingsCharts: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()

  const { swr } = useArticles()
  const { articles } = swr
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<
    { type: "all" } | { type: "article"; article: (typeof articles)[number] }
  >({
    type: "all",
  })
  const trackingIds = React.useMemo(() => {
    // all articles
    if (selected.type === "all") return A.map(articles, (article) => article.tracking.id) as string[]
    // selected article
    return [selected.article.tracking.id]
  }, [articles, selected])

  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Content className='pt-6'>
        <TrackingCharts
          trackings={trackingIds}
          display='views'
          defaultStats='visit'
          defaultDisplayBy='months'
          classNames={{ header: "pb-6" }}
        >
          <Ui.Popover.Root open={open} onOpenChange={setOpen}>
            <Ui.Popover.Trigger
              className={cx(
                "group flex grow items-center gap-2 text-left",
                Ui.cardTitleVariants(),
                variants.focusVisible(),
                variants.inputRounded()
              )}
              role='combobox'
              aria-expanded={open}
            >
              <span className='line-clamp-1 grow'>
                {_("showing-message", {
                  selected:
                    selected.type === "article"
                      ? _("showing-specific-article", {
                          article: placeholder(
                            translate(selected.article.seo, servicePlaceholder.seo).title,
                            _("article-title-placeholder")
                          ),
                        })
                      : _("showing-all-article"),
                })}
              </span>
              <ChevronsUpDown className='ml-auto size-3.5 @2xl/analytics:ml-2' aria-hidden />
            </Ui.Popover.Trigger>
            <Ui.Popover.Content className='w-[var(--radix-popover-trigger-width)] p-0'>
              <Ui.Command.Root>
                <Ui.Command.Input placeholder={_("search-placeholder")} />
                <Ui.Command.List>
                  <Ui.Command.Empty className='text-muted-foreground flex flex-col items-center justify-center gap-2 px-4 py-4'>
                    <Search className='size-6 stroke-[1]' aria-hidden />
                    <div className='text-sm'>{_("empty-result")}</div>
                  </Ui.Command.Empty>
                  <Ui.Command.Group>
                    <Ui.Command.Item
                      value='all'
                      keywords={[_("all-articles")]}
                      onSelect={() => {
                        setSelected({ type: "all" })
                        setOpen(false)
                      }}
                    >
                      {_("all-articles")}
                    </Ui.Command.Item>
                  </Ui.Command.Group>
                  <Ui.Command.Group heading={_("article-heading")}>
                    {A.map(articles, (article) => (
                      <Ui.Command.Item
                        key={article.id}
                        value={article.id}
                        keywords={[
                          placeholder(translate(article.seo, servicePlaceholder.seo).title, _("article-placeholder")),
                        ]}
                        onSelect={() => {
                          setSelected({ type: "article", article })
                          setOpen(false)
                        }}
                      >
                        {placeholder(translate(article.seo, servicePlaceholder.seo).title, _("article-placeholder"))}
                      </Ui.Command.Item>
                    ))}
                  </Ui.Command.Group>
                </Ui.Command.List>
              </Ui.Command.Root>
            </Ui.Popover.Content>
          </Ui.Popover.Root>
        </TrackingCharts>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translation
 */
const dictionary = {
  fr: {
    title: "Statistiques des visites",
    "showing-message": "Statistiques des visites sur {{selected}}",
    "showing-all-article": "tous les articles",
    "showing-specific-article": "l'article {{article}}",
    "all-articles": "Toutes les articles publiées",
    "article-heading": "Statistiques par article",
    "article-placeholder": "Article sans titre",
    "search-placeholder": "Rechercher un article",
    "empty-result": "Aucun article trouvé",
  },
  en: {
    title: "Visits statistics",
    "showing-message": "Statistics of visits on {{selected}}",
    "showing-all-article": "all articles",
    "showing-specific-article": "the article {{article}}",
    "all-articles": "All published articles",
    "article-heading": "Statistics by article",
    "article-placeholder": "Untitled article",
    "search-placeholder": "Search an article",
    "empty-result": "No article found",
  },
  de: {
    title: "Besuchsstatistiken",
    "showing-message": "Besuchsstatistiken für {{selected}}",
    "showing-all-article": "alle Artikel",
    "showing-specific-article": "den Artikel {{article}}",
    "all-articles": "Alle veröffentlichten Artikel",
    "article-heading": "Statistiken nach Artikel",
    "article-placeholder": "Artikel ohne Titel",
    "search-placeholder": "Artikel suchen",
    "empty-result": "Kein Artikel gefunden",
  },
}
