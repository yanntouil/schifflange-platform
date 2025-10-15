import { useTranslation } from "@compo/localize"
import { TrackingCharts } from "@compo/trackings"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, cx, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { ChevronsUpDown, Search } from "lucide-react"
import React from "react"
import { usePages } from "../../pages.context"

/**
 * TrackingsCharts
 */
export const TrackingsCharts: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()

  const { swr } = usePages()
  const { pages } = swr
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<{ type: "all" } | { type: "page"; page: (typeof pages)[number] }>({
    type: "all",
  })
  const trackingIds = React.useMemo(() => {
    // all pages
    if (selected.type === "all") return A.map(pages, (page) => page.tracking.id) as string[]
    // selected page
    return [selected.page.tracking.id]
  }, [pages, selected])

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
                    selected.type === "page"
                      ? _("showing-specific-page", {
                          page: placeholder(
                            translate(selected.page.seo, servicePlaceholder.seo).title,
                            _("page-title-placeholder")
                          ),
                        })
                      : _("showing-all-page"),
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
                      keywords={[_("all-pages")]}
                      onSelect={() => {
                        setSelected({ type: "all" })
                        setOpen(false)
                      }}
                    >
                      {_("all-pages")}
                    </Ui.Command.Item>
                  </Ui.Command.Group>
                  <Ui.Command.Group heading={_("page-heading")}>
                    {A.map(pages, (page) => (
                      <Ui.Command.Item
                        key={page.id}
                        value={page.id}
                        keywords={[
                          placeholder(translate(page.seo, servicePlaceholder.seo).title, _("page-placeholder")),
                        ]}
                        onSelect={() => {
                          setSelected({ type: "page", page })
                          setOpen(false)
                        }}
                      >
                        {placeholder(translate(page.seo, servicePlaceholder.seo).title, _("page-placeholder"))}
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
    "showing-all-page": "tous les pages",
    "showing-specific-page": "la page {{page}}",
    "all-pages": "Toutes les pages publiées",
    "page-heading": "Statistiques par page",
    "page-placeholder": "Page sans titre",
    "search-placeholder": "Rechercher une page",
    "empty-result": "Aucune page trouvée",
  },
  en: {
    title: "Visits statistics",
    "showing-message": "Statistics of visits on {{selected}}",
    "showing-all-page": "all pages",
    "showing-specific-page": "the page {{page}}",
    "all-pages": "All published pages",
    "page-heading": "Statistics by page",
    "page-placeholder": "Untitled page",
    "search-placeholder": "Search a page",
    "empty-result": "No page found",
  },
  de: {
    title: "Besuchsstatistiken",
    "showing-message": "Statistiken der Aufrufe für {{selected}}",
    "showing-all-page": "alle Seiten",
    "showing-specific-page": "die Seite {{page}}",
    "all-pages": "Alle veröffentlichten Seiten",
    "page-heading": "Statistiken nach Seite",
    "page-placeholder": "Unbenannte Seite",
    "search-placeholder": "Seite suchen",
    "empty-result": "Keine Seite gefunden",
  },
}
